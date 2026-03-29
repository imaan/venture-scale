// PostHog analytics helper
// Client-side: include posthog-js snippet in HTML, then use window.posthog
// These are the 6 funnel events + additional tracking events

export const EVENTS = {
  // Core funnel (6 events)
  SIGNUP: 'signup',
  FIRST_ACTION: 'first_action',           // user initiates first analysis
  COMPLETED_ACTION: 'completed_action',     // user receives analysis results
  RETURN_VISIT: 'return_visit',             // user comes back after first session
  SHARE: 'share',                           // user shares a report
  FEATURE_REQUESTED: 'feature_requested',   // user requests a feature

  // Feedback events
  POSITIVE_FEEDBACK: 'positive_feedback',
  NEGATIVE_FEEDBACK: 'negative_feedback',
  MONETIZATION_SIGNAL: 'monetization_signal',
  TESTIMONIAL_CAPTURED: 'testimonial_captured',
} as const;

// PostHog JS snippet for HTML pages
// Replace POSTHOG_PROJECT_ID with actual project ID at build/serve time
export const POSTHOG_SNIPPET = `
<script>
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('__POSTHOG_PROJECT_ID__', {
    api_host: 'https://us.i.posthog.com',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true
  });
</script>`;
