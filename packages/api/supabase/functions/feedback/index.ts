// Supabase Edge Function for Feedback Collection
// Deploy with: supabase functions deploy feedback

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

serve(async (req) => {
  // CORS handling
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const apiKey = authHeader?.replace('Bearer ', '') || 'anonymous';

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const {
      type, // 'false_positive' or 'false_negative'
      detectedText,
      detectionType,
      context,
      comment,
      fullText // Optional: the full text for analysis
    } = await req.json();

    // Validation
    if (!type || !['false_positive', 'false_negative'].includes(type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid feedback type. Must be "false_positive" or "false_negative"' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    if (!detectedText || !detectionType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: detectedText and detectionType' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get API key info (if authenticated)
    let apiKeyId = null;
    if (apiKey !== 'anonymous') {
      const { data: keyData } = await supabase
        .from('api_keys')
        .select('id')
        .eq('key_hash', apiKey)
        .single();

      apiKeyId = keyData?.id;
    }

    // Store feedback
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('feedback')
      .insert({
        api_key_id: apiKeyId,
        feedback_type: type,
        detected_text: detectedText,
        detection_type: detectionType,
        context: context || '',
        user_comment: comment || '',
        full_text: fullText || '',
        status: 'pending', // pending, approved, rejected
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (feedbackError) {
      throw feedbackError;
    }

    // Auto-analyze for patterns
    const analysis = await analyzeFeedback(detectedText, context, type);

    // Update feedback with analysis
    await supabase
      .from('feedback')
      .update({
        analysis: analysis,
        confidence_score: analysis.confidence
      })
      .eq('id', feedbackData.id);

    // Check if similar feedback exists
    const { data: similarFeedback, count } = await supabase
      .from('feedback')
      .select('*', { count: 'exact' })
      .eq('detected_text', detectedText)
      .eq('detection_type', detectionType)
      .eq('feedback_type', type);

    // If multiple reports of same issue, flag for priority review
    const shouldPrioritize = (count ?? 0) >= 3;

    return new Response(
      JSON.stringify({
        success: true,
        feedbackId: feedbackData.id,
        message: 'Thank you for your feedback! It will be reviewed and help improve detection.',
        analysis: {
          similarReports: count,
          priorityReview: shouldPrioritize,
          suggestedAction: analysis.suggestedAction
        }
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Failed to submit feedback',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

// Analyze feedback to suggest improvements
async function analyzeFeedback(
  detectedText: string,
  context: string,
  type: string
): Promise<{
  confidence: number;
  suggestedAction: string;
  patterns: string[];
  reasoning: string;
}> {
  const analysis = {
    confidence: 0.5,
    suggestedAction: 'review',
    patterns: [] as string[],
    reasoning: ''
  };

  if (type === 'false_positive') {
    // Check if it's a common business term
    const businessTerms = ['company', 'limited', 'ltd', 'inc', 'corp', 'llc'];
    const isBusinessTerm = businessTerms.some(term =>
      detectedText.toLowerCase().includes(term)
    );

    if (isBusinessTerm) {
      analysis.confidence = 0.8;
      analysis.suggestedAction = 'add_to_whitelist';
      analysis.patterns.push('business_entity');
      analysis.reasoning = 'Likely a business name, not personal PII';
    }

    // Check if it's a day of week / month
    const timeTerms = ['monday', 'tuesday', 'january', 'february'];
    const isTimeTerm = timeTerms.some(term =>
      detectedText.toLowerCase().includes(term)
    );

    if (isTimeTerm) {
      analysis.confidence = 0.9;
      analysis.suggestedAction = 'add_to_whitelist';
      analysis.patterns.push('calendar_term');
      analysis.reasoning = 'Calendar term detected as name - should be whitelisted';
    }

    // Check context for business indicators
    const contextLower = context.toLowerCase();
    if (contextLower.includes('company') || contextLower.includes('business')) {
      analysis.confidence = 0.7;
      analysis.patterns.push('business_context');
      analysis.reasoning = 'Appears in business context';
    }
  } else if (type === 'false_negative') {
    // Analyze why it might have been missed
    analysis.suggestedAction = 'review_pattern';
    analysis.reasoning = 'Pattern may need to be added or adjusted';

    // Check if it matches a pattern we should have
    if (/@/.test(detectedText)) {
      analysis.patterns.push('email_variant');
      analysis.confidence = 0.8;
    }
  }

  return analysis;
}
