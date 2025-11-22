-- OpenRedact API Database Schema
-- Run with: supabase db push

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- API Keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  key_hash TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  rate_limit_per_minute INTEGER NOT NULL DEFAULT 60,
  monthly_quota INTEGER, -- NULL means unlimited
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT true,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster lookups
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_api_keys_user_id ON api_keys(user_id);
CREATE INDEX idx_api_keys_is_active ON api_keys(is_active) WHERE is_active = true;

-- API Usage tracking
CREATE TABLE api_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE CASCADE NOT NULL,

  -- Request details
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL DEFAULT 'POST',
  status_code INTEGER NOT NULL,

  -- Usage metrics
  request_count INTEGER NOT NULL DEFAULT 1,
  tokens_processed INTEGER NOT NULL DEFAULT 0,
  pii_detected_count INTEGER NOT NULL DEFAULT 0,
  response_time_ms NUMERIC(10,2) NOT NULL,

  -- Metadata
  user_agent TEXT,
  ip_address INET,
  error_message TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for analytics queries
CREATE INDEX idx_api_usage_api_key_id ON api_usage(api_key_id);
CREATE INDEX idx_api_usage_created_at ON api_usage(created_at DESC);
CREATE INDEX idx_api_usage_endpoint ON api_usage(endpoint);
CREATE INDEX idx_api_usage_api_key_created ON api_usage(api_key_id, created_at DESC);

-- False positives / User feedback
CREATE TABLE false_positives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  api_key_id UUID REFERENCES api_keys(id) ON DELETE SET NULL,

  -- Detection details
  detected_text TEXT NOT NULL,
  detection_type TEXT NOT NULL,
  context TEXT NOT NULL,

  -- Feedback
  is_false_positive BOOLEAN NOT NULL DEFAULT true,
  user_comment TEXT,

  -- Review status
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_false_positives_verified ON false_positives(is_verified) WHERE is_verified = false;
CREATE INDEX idx_false_positives_type ON false_positives(detection_type);

-- User subscriptions (for billing)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Stripe details
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,

  -- Subscription details
  tier TEXT NOT NULL CHECK (tier IN ('free', 'pro', 'enterprise')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'past_due', 'trialing')),

  -- Billing
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_stripe_customer ON subscriptions(stripe_customer_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status) WHERE status = 'active';

-- Custom patterns (for enterprise users)
CREATE TABLE custom_patterns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Pattern details
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  regex_pattern TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 50,
  description TEXT,

  -- Validation
  is_active BOOLEAN NOT NULL DEFAULT true,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_custom_patterns_user_id ON custom_patterns(user_id);
CREATE INDEX idx_custom_patterns_active ON custom_patterns(is_active) WHERE is_active = true;

-- Webhooks configuration
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Webhook details
  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- ['detection.completed', 'batch.completed']
  secret TEXT NOT NULL,

  -- Status
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_triggered_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_webhooks_user_id ON webhooks(user_id);
CREATE INDEX idx_webhooks_active ON webhooks(is_active) WHERE is_active = true;

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE false_positives ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- API Keys policies
CREATE POLICY "Users can view their own API keys"
  ON api_keys FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own API keys"
  ON api_keys FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own API keys"
  ON api_keys FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own API keys"
  ON api_keys FOR DELETE
  USING (auth.uid() = user_id);

-- API Usage policies
CREATE POLICY "Users can view their own usage"
  ON api_usage FOR SELECT
  USING (
    api_key_id IN (
      SELECT id FROM api_keys WHERE user_id = auth.uid()
    )
  );

-- False positives policies
CREATE POLICY "Users can submit false positive reports"
  ON false_positives FOR INSERT
  WITH CHECK (true); -- Anyone can submit (even with API key)

CREATE POLICY "Users can view their own reports"
  ON false_positives FOR SELECT
  USING (
    api_key_id IN (
      SELECT id FROM api_keys WHERE user_id = auth.uid()
    )
  );

-- Subscriptions policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Custom patterns policies
CREATE POLICY "Users can manage their own patterns"
  ON custom_patterns FOR ALL
  USING (auth.uid() = user_id);

-- Webhooks policies
CREATE POLICY "Users can manage their own webhooks"
  ON webhooks FOR ALL
  USING (auth.uid() = user_id);

-- Helper Functions

-- Function to get current month usage
CREATE OR REPLACE FUNCTION get_monthly_usage(key_id UUID)
RETURNS INTEGER AS $$
  SELECT COALESCE(SUM(request_count), 0)::INTEGER
  FROM api_usage
  WHERE api_key_id = key_id
    AND created_at >= date_trunc('month', NOW());
$$ LANGUAGE SQL STABLE;

-- Function to check if user has exceeded quota
CREATE OR REPLACE FUNCTION check_quota_exceeded(key_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  current_usage INTEGER;
  monthly_limit INTEGER;
BEGIN
  SELECT get_monthly_usage(key_id) INTO current_usage;
  SELECT monthly_quota INTO monthly_limit FROM api_keys WHERE id = key_id;

  IF monthly_limit IS NULL THEN
    RETURN false; -- Unlimited
  END IF;

  RETURN current_usage >= monthly_limit;
END;
$$ LANGUAGE plpgsql STABLE;

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_custom_patterns_updated_at
  BEFORE UPDATE ON custom_patterns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert default tiers
COMMENT ON COLUMN api_keys.tier IS 'Subscription tier: free (10K/mo), pro (100K/mo), enterprise (unlimited)';
COMMENT ON COLUMN api_keys.rate_limit_per_minute IS 'Requests per minute: free=60, pro=300, enterprise=1000';
