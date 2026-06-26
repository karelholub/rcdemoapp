import { calculateActivations } from './activationRules';
import { calculateAudiences } from './audienceRules';
import { defaultMeiroEndpointType, meiroCollectProxyPath, type MeiroEndpointType } from './meiroConfig';
import { applyEvent, createInitialProfile } from './profileBuilder';
import type { DemoEvent, DemoState, MeiroProfile, TrackingMode } from './types';

const sessionId = `session_${Math.random().toString(36).slice(2, 10)}`;

const allowedMobileEvents = new Set([
  'Deposit',
  'app_installed',
  'app_login',
  'push_permission_granted',
  'app_logout',
  'language_changed',
  'biometric_login_enabled',
  'app_session_started',
  'push_permission_denied',
  'app_session_ended',
  'app_opened',
  'registration_started',
  'kyc_submitted',
  'kyc_rejected',
  'registration_completed',
  'kyc_approved',
  'suitability_assessment_completed',
  'kyc_started',
  'risk_profile_started',
  'investment_goal_selected',
  'risk_profile_completed',
  'fund_detail_viewed',
  'fund_comparison_completed',
  'fund_added_to_watchlist',
  'fund_document_downloaded',
  'fund_factsheet_opened',
  'fund_removed_from_watchlist',
  'fund_category_viewed',
  'fund_comparison_started',
  'fund_performance_viewed',
  'fund_list_viewed',
  'research_article_viewed',
  'research_report_opened',
  'research_report_downloaded',
  'market_insight_viewed',
  'cio_view_opened',
  'economic_update_viewed',
  'investment_outlook_viewed',
  'content_topic_followed',
  'portfolio_viewed',
  'whatsapp_cta_clicked',
  'fund_subscription_completed',
  'relationship_manager_contact_requested',
  'deposit_completed',
  'deposit_started',
  'fund_subscription_cancelled',
  'fund_subscription_started',
  'whatsapp_consent_updated',
  'in_app_message_clicked',
  'portfolio_performance_viewed',
]);

function getMobileCollectorEventType(event: DemoEvent): string | null {
  const formName = String(event.payload.form_name ?? '');

  const mapped: Record<string, string> = {
    app_opened: 'app_opened',
    account_opening_started: 'registration_started',
    login_started: 'app_login',
    login_completed: 'app_login',
    login_failed: 'app_login',
    identity_number_submitted: 'kyc_started',
    identity_verification_started: 'kyc_started',
    identity_verification_completed: 'kyc_approved',
    identity_verification_failed: 'kyc_rejected',
    onboarding_path_selected: 'registration_started',
    wallet_type_selected: 'investment_goal_selected',
    application_review_confirmed: 'kyc_submitted',
    verification_code_verified: 'registration_completed',
    account_request_submitted: 'registration_completed',
    account_creation_completed: 'registration_completed',
    support_case_recommended: 'relationship_manager_contact_requested',
    verification_code_resend_requested: 'in_app_message_clicked',
  };

  if (event.event_type === 'channel_consent_updated' && 'marketing_consent_whatsapp' in event.payload) return 'whatsapp_consent_updated';
  if (event.event_type === 'channel_consent_updated' && event.payload.marketing_consent_push === true) return 'push_permission_granted';
  if (event.event_type === 'channel_consent_updated' && event.payload.marketing_consent_push === false) return 'push_permission_denied';
  if (event.event_type === 'form_step_started' && formName === 'investment_profile') return 'risk_profile_started';
  if (event.event_type === 'form_completed' && formName === 'investment_profile') return 'risk_profile_completed';
  if (event.event_type === 'form_completed' && formName === 'employment_information') return 'suitability_assessment_completed';
  if (event.event_type === 'password_created') return 'registration_completed';

  return mapped[event.event_type] ?? null;
}

export const createInitialState = (): DemoState => {
  const profile = createInitialProfile();
  return {
    profile,
    events: [],
    audiences: [],
    activations: calculateActivations(profile),
  };
};

export function buildEvent(profile: MeiroProfile, eventType: string, screenName: string, payload: Record<string, unknown> = {}): DemoEvent {
  return {
    event_type: eventType,
    timestamp: new Date().toISOString(),
    anonymous_id: profile.anonymous_id,
    session_id: sessionId,
    user_id: profile.user_id,
    browser: profile.browser,
    crm_customer_id: profile.crm_customer_id,
    device_id: profile.device_id,
    mobile_user_id: profile.mobile_user_id,
    journey_name: 'investment_account_opening',
    screen_name: screenName,
    payload,
  };
}

export function sendEventToMeiro(event: DemoEvent, endpointType: MeiroEndpointType = defaultMeiroEndpointType) {
  const collectorEventType = getMobileCollectorEventType(event);
  if (!collectorEventType || !allowedMobileEvents.has(collectorEventType)) return;

  const collectorEvent = {
    ...event,
    event_type: collectorEventType,
    payload: {
      ...event.payload,
      demo_event_type: event.event_type,
      screen_name: event.screen_name,
      journey_name: event.journey_name,
    },
  };
  const body = JSON.stringify({ endpointType, event: collectorEvent });

  void fetch(meiroCollectProxyPath, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    keepalive: true,
  }).catch(() => {
    // The local demo keeps running even if the collector is unavailable.
  });
}

export function trackEvent(
  state: DemoState,
  eventType: string,
  screenName: string,
  payload: Record<string, unknown> = {},
  options: { mode?: TrackingMode; endpointType?: MeiroEndpointType } = {},
): DemoState {
  const event = buildEvent(state.profile, eventType, screenName, payload);
  const { profile, updates } = applyEvent(state.profile, event);
  const enriched = { ...event, profile_updates: updates };
  if (options.mode === 'live') sendEventToMeiro(enriched, options.endpointType);
  const events = [enriched, ...state.events].slice(0, 80);
  return {
    profile,
    events,
    audiences: calculateAudiences(profile, events),
    activations: calculateActivations(profile),
  };
}

export function updateProfileFlags(state: DemoState, updates: Partial<MeiroProfile>): DemoState {
  const profile = { ...state.profile, ...updates, investment_onboarding_last_activity_at: new Date().toISOString() };
  return {
    ...state,
    profile,
    audiences: calculateAudiences(profile, state.events),
    activations: calculateActivations(profile),
  };
}
