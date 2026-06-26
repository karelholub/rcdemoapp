import { calculateActivations } from './activationRules';
import { calculateAudiences } from './audienceRules';
import { defaultMeiroEndpointType, meiroEndpoints, type MeiroEndpointType } from './meiroConfig';
import { applyEvent, createInitialProfile } from './profileBuilder';
import type { DemoEvent, DemoState, MeiroProfile, TrackingMode } from './types';

const sessionId = `session_${Math.random().toString(36).slice(2, 10)}`;

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
    user_id: profile.known_customer_id,
    journey_name: 'investment_account_opening',
    screen_name: screenName,
    payload,
  };
}

export function sendEventToMeiro(event: DemoEvent, endpointType: MeiroEndpointType = defaultMeiroEndpointType) {
  const endpoint = meiroEndpoints[endpointType];
  const body = JSON.stringify(event);

  if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
    const blob = new Blob([body], { type: 'application/json' });
    if (navigator.sendBeacon(endpoint, blob)) return;
  }

  void fetch(endpoint, {
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
