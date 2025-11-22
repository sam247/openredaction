-- Feedback and Learning System
-- Allows users to report false positives/negatives and improves detection over time

-- Feedback submissions table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,

  -- Feedback details
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('false_positive', 'false_negative')),
  detected_text TEXT NOT NULL,
  detection_type TEXT NOT NULL, -- EMAIL, SSN, etc.
  context TEXT NOT NULL, -- Surrounding text for analysis
  full_text TEXT, -- Optional: full text for better analysis

  -- User input
  user_comment TEXT,

  -- Analysis (automated)
  analysis JSONB DEFAULT '{}'::jsonb,
  confidence_score NUMERIC(3,2), -- 0.00 to 1.00

  -- Review status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  review_comment TEXT,

  -- Applied changes
  applied_action TEXT, -- 'whitelist_added', 'pattern_updated', 'validator_adjusted'
  applied_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for feedback
CREATE INDEX idx_feedback_status ON feedback(status) WHERE status = 'pending';
CREATE INDEX idx_feedback_type ON feedback(feedback_type);
CREATE INDEX idx_feedback_detection_type ON feedback(detection_type);
CREATE INDEX idx_feedback_text ON feedback(detected_text);
CREATE INDEX idx_feedback_created ON feedback(created_at DESC);
CREATE INDEX idx_feedback_confidence ON feedback(confidence_score DESC);

-- Dynamic whitelist (learned from feedback)
CREATE TABLE learned_whitelist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Whitelist entry
  term TEXT NOT NULL UNIQUE,
  pattern_type TEXT, -- Which pattern it applies to (NULL = all)
  reason TEXT NOT NULL, -- Why it was whitelisted

  -- Source
  source TEXT NOT NULL CHECK (source IN ('feedback', 'manual', 'automated')),
  feedback_id UUID REFERENCES feedback(id) ON DELETE SET NULL,

  -- Stats
  times_reported INTEGER NOT NULL DEFAULT 1,
  last_reported_at TIMESTAMPTZ,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  confidence NUMERIC(3,2) NOT NULL DEFAULT 0.50,

  -- Metadata
  added_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_whitelist_term ON learned_whitelist(term) WHERE is_active = true;
CREATE INDEX idx_whitelist_active ON learned_whitelist(is_active) WHERE is_active = true;
CREATE INDEX idx_whitelist_confidence ON learned_whitelist(confidence DESC);

-- Pattern adjustments (learned improvements)
CREATE TABLE pattern_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Pattern details
  pattern_type TEXT NOT NULL,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('regex_update', 'validator_change', 'priority_change')),

  -- Changes
  old_value TEXT,
  new_value TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Source
  based_on_feedback_ids UUID[], -- Array of feedback IDs that led to this

  -- Status
  status TEXT NOT NULL DEFAULT 'proposed' CHECK (status IN ('proposed', 'tested', 'approved', 'implemented', 'rejected')),
  test_results JSONB,

  -- Review
  proposed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  implemented_at TIMESTAMPTZ
);

CREATE INDEX idx_adjustments_status ON pattern_adjustments(status);
CREATE INDEX idx_adjustments_pattern ON pattern_adjustments(pattern_type);

-- Feedback aggregations (for analytics)
CREATE TABLE feedback_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- Aggregation period
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,

  -- Stats
  total_feedback INTEGER NOT NULL DEFAULT 0,
  false_positives INTEGER NOT NULL DEFAULT 0,
  false_negatives INTEGER NOT NULL DEFAULT 0,
  approved INTEGER NOT NULL DEFAULT 0,
  rejected INTEGER NOT NULL DEFAULT 0,
  implemented INTEGER NOT NULL DEFAULT 0,

  -- By pattern type
  by_pattern_type JSONB DEFAULT '{}'::jsonb,

  -- Top issues
  top_false_positives JSONB DEFAULT '[]'::jsonb,
  top_false_negatives JSONB DEFAULT '[]'::jsonb,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_feedback_stats_period ON feedback_stats(period_start DESC);

-- RLS Policies

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE learned_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE pattern_adjustments ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback_stats ENABLE ROW LEVEL SECURITY;

-- Feedback policies (anyone can submit, users can view their own)
CREATE POLICY "Anyone can submit feedback"
  ON feedback FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view their own feedback"
  ON feedback FOR SELECT
  USING (
    api_key_id IN (
      SELECT id FROM api_keys WHERE user_id = auth.uid()
    )
    OR auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin')
  );

-- Whitelist policies (read-only for users, admins can manage)
CREATE POLICY "Anyone can view active whitelist"
  ON learned_whitelist FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage whitelist"
  ON learned_whitelist FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Pattern adjustments (admin only)
CREATE POLICY "Admins can manage pattern adjustments"
  ON pattern_adjustments FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'));

-- Stats are public
CREATE POLICY "Public can view feedback stats"
  ON feedback_stats FOR SELECT
  USING (true);

-- Functions

-- Get whitelist for a specific pattern type
CREATE OR REPLACE FUNCTION get_whitelist(pattern_type_filter TEXT DEFAULT NULL)
RETURNS TABLE (term TEXT, confidence NUMERIC) AS $$
BEGIN
  RETURN QUERY
  SELECT
    learned_whitelist.term,
    learned_whitelist.confidence
  FROM learned_whitelist
  WHERE is_active = true
    AND (pattern_type_filter IS NULL OR pattern_type = pattern_type_filter)
  ORDER BY confidence DESC, term;
END;
$$ LANGUAGE plpgsql STABLE;

-- Auto-approve high-confidence feedback
CREATE OR REPLACE FUNCTION auto_approve_feedback()
RETURNS TRIGGER AS $$
BEGIN
  -- If confidence is very high and it's a false positive
  IF NEW.confidence_score >= 0.85 AND NEW.feedback_type = 'false_positive' THEN
    -- Check if similar feedback exists
    IF EXISTS (
      SELECT 1 FROM feedback
      WHERE detected_text = NEW.detected_text
        AND detection_type = NEW.detection_type
        AND feedback_type = 'false_positive'
        AND status = 'approved'
    ) THEN
      -- Auto-approve and add to whitelist
      NEW.status := 'approved';

      -- Add to whitelist
      INSERT INTO learned_whitelist (
        term, pattern_type, reason, source, feedback_id, confidence
      ) VALUES (
        NEW.detected_text,
        NEW.detection_type,
        'Auto-approved: High confidence + similar reports',
        'automated',
        NEW.id,
        NEW.confidence_score
      ) ON CONFLICT (term) DO UPDATE
        SET times_reported = learned_whitelist.times_reported + 1,
            last_reported_at = NOW(),
            confidence = GREATEST(learned_whitelist.confidence, NEW.confidence_score);

      NEW.applied_action := 'whitelist_added';
      NEW.applied_at := NOW();
      NEW.status := 'implemented';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_approve_feedback
  BEFORE INSERT ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION auto_approve_feedback();

-- Aggregate feedback stats daily
CREATE OR REPLACE FUNCTION aggregate_feedback_stats()
RETURNS void AS $$
DECLARE
  start_time TIMESTAMPTZ;
  end_time TIMESTAMPTZ;
BEGIN
  start_time := date_trunc('day', NOW() - INTERVAL '1 day');
  end_time := date_trunc('day', NOW());

  INSERT INTO feedback_stats (
    period_start,
    period_end,
    total_feedback,
    false_positives,
    false_negatives,
    approved,
    rejected,
    implemented,
    by_pattern_type,
    top_false_positives,
    top_false_negatives
  )
  SELECT
    start_time,
    end_time,
    COUNT(*),
    COUNT(*) FILTER (WHERE feedback_type = 'false_positive'),
    COUNT(*) FILTER (WHERE feedback_type = 'false_negative'),
    COUNT(*) FILTER (WHERE status = 'approved'),
    COUNT(*) FILTER (WHERE status = 'rejected'),
    COUNT(*) FILTER (WHERE status = 'implemented'),
    jsonb_object_agg(
      detection_type,
      COUNT(*)
    ),
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'text', detected_text,
          'type', detection_type,
          'count', COUNT(*)
        )
      )
      FROM (
        SELECT detected_text, detection_type
        FROM feedback
        WHERE created_at >= start_time AND created_at < end_time
          AND feedback_type = 'false_positive'
        GROUP BY detected_text, detection_type
        ORDER BY COUNT(*) DESC
        LIMIT 10
      ) top_fp
    ),
    (
      SELECT jsonb_agg(
        jsonb_build_object(
          'text', detected_text,
          'type', detection_type,
          'count', COUNT(*)
        )
      )
      FROM (
        SELECT detected_text, detection_type
        FROM feedback
        WHERE created_at >= start_time AND created_at < end_time
          AND feedback_type = 'false_negative'
        GROUP BY detected_text, detection_type
        ORDER BY COUNT(*) DESC
        LIMIT 10
      ) top_fn
    )
  FROM feedback
  WHERE created_at >= start_time AND created_at < end_time;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_feedback_updated_at
  BEFORE UPDATE ON feedback
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_whitelist_updated_at
  BEFORE UPDATE ON learned_whitelist
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_adjustments_updated_at
  BEFORE UPDATE ON pattern_adjustments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE feedback IS 'User-submitted feedback on false positives and false negatives';
COMMENT ON TABLE learned_whitelist IS 'Terms learned from feedback to reduce false positives';
COMMENT ON TABLE pattern_adjustments IS 'Proposed and implemented pattern improvements based on feedback';
COMMENT ON COLUMN feedback.confidence_score IS 'Automated confidence in the feedback accuracy (0-1)';
COMMENT ON COLUMN learned_whitelist.confidence IS 'Confidence that this term is truly a false positive (0-1)';
