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
  !function(t,e){var o,n,p,r;e.__SV||(window.posthog && window.posthog.__loaded)||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="fi init Oi Fi ft Ii Ai Ri capture calculateEventProperties Ni register register_once register_for_session unregister unregister_for_session Hi getFeatureFlag getFeatureFlagPayload getFeatureFlagResult isFeatureEnabled reloadFeatureFlags updateFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey displaySurvey cancelPendingSurvey canRenderSurvey canRenderSurveyAsync qi identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException startExceptionAutocapture stopExceptionAutocapture loadToolbar get_property getSessionProperty zi Li createPersonProfile setInternalOrTestUser Bi $i Wi opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing get_explicit_consent_status is_capturing clear_opt_in_out_capturing Mi debug bt ji getPageViewId captureTraceFeedback captureTraceMetric Si".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
  posthog.init('__POSTHOG_PROJECT_ID__', {
    api_host: 'https://p.imaan.co',
    ui_host: 'https://eu.posthog.com',
    defaults: '2026-01-30',
    person_profiles: 'identified_only',
    capture_pageview: true,
    capture_pageleave: true
  });
</script>`;
