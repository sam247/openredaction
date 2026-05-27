'use client';

import { gtagEvent } from '@/lib/gtag';

// Event categories for organization
export type EventCategory = 
  | 'navigation'
  | 'playground'
  | 'conversion'
  | 'form'
  | 'external';

// Helper to sanitize event data for GA4
// - No nested objects
// - Max 255 characters per string value
// - Only strings, numbers, or booleans
function sanitizeEventData(data?: Record<string, any>): Record<string, string | number | boolean> {
  if (!data) return {};

  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(data)) {
    // Skip nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      continue;
    }

    // Handle arrays by converting to comma-separated string
    if (Array.isArray(value)) {
      sanitized[key] = value.join(', ').substring(0, 255);
      continue;
    }

    // Handle strings - truncate to 255 chars
    if (typeof value === 'string') {
      sanitized[key] = value.substring(0, 255);
      continue;
    }

    // Handle numbers and booleans as-is
    if (typeof value === 'number' || typeof value === 'boolean') {
      sanitized[key] = value;
      continue;
    }

    // Convert other types to string and truncate
    sanitized[key] = String(value).substring(0, 255);
  }

  return sanitized;
}

// Standardized event tracking function (GA4)
export function trackEvent(
  name: string,
  category: EventCategory,
  data?: Record<string, string | number | boolean>
) {
  // Validate event name length (max 255 chars)
  const eventName = name.substring(0, 255);
  
  // Sanitize data
  const sanitizedData = sanitizeEventData(data);

  gtagEvent(eventName, {
    event_category: category,
    ...sanitizedData,
  });
}

// Convenience functions for common event types
export const analytics = {
  // Navigation events
  pageView: (path: string) => {
    trackEvent('page_view', 'navigation', { page_path: path });
  },
  
  navClick: (destination: string, location: 'header' | 'footer' | 'mobile') => {
    trackEvent('nav_click', 'navigation', { 
      link_destination: destination,
      link_location: location 
    });
  },
  
  navDropdownOpen: () => {
    trackEvent('nav_dropdown_open', 'navigation');
  },
  
  mobileMenuToggle: (isOpen: boolean) => {
    trackEvent('mobile_menu_toggle', 'navigation', { is_open: isOpen });
  },
  
  ctaClick: (location: string) => {
    trackEvent('cta_click', 'navigation', { cta_location: location });
  },
  
  // Playground events
  playgroundPageView: (libraryLoaded: boolean) => {
    trackEvent('playground_page_view', 'playground', { 
      library_loaded: libraryLoaded 
    });
  },
  
  playgroundRedact: (params: {
    mode: 'regex' | 'ai';
    inputLength: number;
    detectionCount: number;
    preset: string;
    hasApiKey: boolean;
    success: boolean;
  }) => {
    trackEvent('playground_redact', 'playground', {
      mode: params.mode,
      input_length: params.inputLength,
      detection_count: params.detectionCount,
      preset: params.preset,
      has_api_key: params.hasApiKey,
      success: params.success,
    });
  },
  
  playgroundPresetChange: (preset: string, presetType: 'text' | 'api') => {
    trackEvent('playground_preset_change', 'playground', {
      preset,
      preset_type: presetType,
    });
  },
  
  playgroundAiToggle: (enabled: boolean) => {
    trackEvent('playground_ai_toggle', 'playground', { enabled });
  },
  
  playgroundCopy: (tab: 'redacted' | 'entities' | 'json', detectionCount: number) => {
    trackEvent('playground_copy', 'playground', {
      tab,
      detection_count: detectionCount,
    });
  },
  
  playgroundTabChange: (tab: string) => {
    trackEvent('playground_tab_change', 'playground', { tab });
  },
  
  playgroundError: (errorType: string, mode: 'regex' | 'ai', errorCode?: string) => {
    trackEvent('playground_error', 'playground', {
      error_type: errorType,
      mode,
      ...(errorCode && { error_code: errorCode }),
    });
  },
  
  // Form events
  formSubmit: (formType: string, data?: {
    hasCompany?: boolean;
    hasUseCase?: boolean;
    interestType?: string;
  }) => {
    trackEvent('form_submit', 'form', {
      form_type: formType,
      ...(data?.hasCompany !== undefined && { has_company: data.hasCompany }),
      ...(data?.hasUseCase !== undefined && { has_use_case: data.hasUseCase }),
      ...(data?.interestType && { interest_type: data.interestType }),
    });
  },
  
  formSubmitSuccess: (formType: string) => {
    trackEvent('form_submit_success', 'form', { form_type: formType });
  },
  
  formSubmitError: (formType: string, errorMessage?: string) => {
    trackEvent('form_submit_error', 'form', {
      form_type: formType,
      ...(errorMessage && { error_message: errorMessage }),
    });
  },
  
  // Conversion events
  enterprisePageView: () => {
    trackEvent('enterprise_page_view', 'conversion');
  },

  // External link events
  externalLinkClick: (destination: string, linkLocation: string, linkText?: string) => {
    trackEvent('external_link_click', 'external', {
      destination,
      link_location: linkLocation,
      ...(linkText && { link_text: linkText }),
    });
  },

  /** Buy Me a Coffee — header / mobile menu */
  buyMeACoffeeClick: (location: 'header' | 'mobile') => {
    trackEvent('bmc_click', 'conversion', { link_location: location });
  },

  /** Wall of love / community CTAs (GitHub Discussions, view all, etc.) */
  wallOfLoveClick: (action: 'submit_discussion' | 'get_listed' | 'inline_discussions' | 'view_all') => {
    trackEvent('wall_of_love_click', 'navigation', { action });
  },
  
  // Blog events
  blogPostView: (postSlug: string, postTitle: string) => {
    trackEvent('blog_post_view', 'navigation', {
      post_slug: postSlug,
      post_title: postTitle,
    });
  },
  
  // Docs events
  docsPageView: (docPath: string, docSection?: string) => {
    trackEvent('docs_page_view', 'navigation', {
      doc_path: docPath,
      ...(docSection && { doc_section: docSection }),
    });
  },

  roadmapPageView: () => {
    trackEvent('roadmap_view', 'navigation');
  },

  wordpressWaitlistOpen: (source: string) => {
    trackEvent('wordpress_waitlist_open', 'form', { source });
  },

  wordpressWaitlistSubmit: (source: string) => {
    trackEvent('wordpress_waitlist_submit', 'form', { source });
  },

  wordpressWaitlistSuccess: (source: string) => {
    trackEvent('wordpress_waitlist_success', 'conversion', { source });
  },

  wordpressWaitlistError: (source: string, errorType?: string) => {
    trackEvent('wordpress_waitlist_error', 'form', {
      source,
      ...(errorType && { error_type: errorType }),
    });
  },
};

