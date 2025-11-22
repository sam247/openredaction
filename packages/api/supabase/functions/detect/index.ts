// Supabase Edge Function for PII Detection
// Deploy with: supabase functions deploy detect

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Import OpenRedact (you'll need to bundle this or use npm specifier)
// For now, using dynamic import
// const { OpenRedact } = await import('openredact');

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
    // Verify API key
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify API key and check rate limits
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('*')
      .eq('key_hash', hashApiKey(apiKey))
      .eq('is_active', true)
      .single();

    if (keyError || !keyData) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Check rate limit
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60000);

    const { count } = await supabase
      .from('api_usage')
      .select('*', { count: 'exact', head: true })
      .eq('api_key_id', keyData.id)
      .gte('created_at', oneMinuteAgo.toISOString());

    if ((count ?? 0) >= keyData.rate_limit_per_minute) {
      return new Response(
        JSON.stringify({
          error: 'Rate limit exceeded',
          limit: keyData.rate_limit_per_minute,
          reset_at: new Date(now.getTime() + 60000).toISOString()
        }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse request body
    const { text, options = {} } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Missing "text" field in request body' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const startTime = performance.now();

    // TODO: Use actual OpenRedact library
    // For now, returning mock response
    const result = {
      original: text,
      redacted: text, // TODO: Actually redact
      detections: [],
      redactionMap: {},
      stats: {
        processingTime: performance.now() - startTime,
        piiCount: 0
      }
    };

    // Log usage
    await supabase.from('api_usage').insert({
      api_key_id: keyData.id,
      endpoint: '/v1/detect',
      request_count: 1,
      tokens_processed: text.length,
      response_time_ms: result.stats.processingTime,
      created_at: now.toISOString()
    });

    // Update last_used_at
    await supabase
      .from('api_keys')
      .update({ last_used_at: now.toISOString() })
      .eq('id', keyData.id);

    return new Response(
      JSON.stringify(result),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'X-RateLimit-Limit': String(keyData.rate_limit_per_minute),
          'X-RateLimit-Remaining': String(keyData.rate_limit_per_minute - (count ?? 0) - 1)
        }
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
});

// Simple hash function for API keys (use crypto.subtle in production)
function hashApiKey(key: string): string {
  // TODO: Use proper SHA-256 hashing
  return key; // Temporary - DO NOT USE IN PRODUCTION
}
