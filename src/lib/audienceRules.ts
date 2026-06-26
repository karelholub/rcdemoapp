import type { DemoEvent, MeiroProfile } from './types';

const has = (events: DemoEvent[], eventType: string) => events.some((event) => event.event_type === eventType);

export function calculateAudiences(profile: MeiroProfile, events: DemoEvent[]): string[] {
  const audiences: string[] = [];
  if (has(events, 'app_opened') && !has(events, 'account_opening_started')) audiences.push('Anonymous App Visitor');
  if (has(events, 'account_opening_started') && !profile.account_request_submitted && !profile.investment_account_created) audiences.push('Onboarding Started');
  if (has(events, 'identity_verification_started') && profile.identity_verification_status !== 'completed') audiences.push('Identity Verification Abandoner');
  if (
    has(events, 'form_step_started') &&
    profile.investment_onboarding_status === 'abandoned' &&
    ['personal', 'personal_information', 'employment', 'employment_information', 'investment', 'investment_profile'].includes(profile.investment_onboarding_abandoned_step ?? '')
  ) {
    audiences.push('Form Abandoner');
  }
  if (profile.application_review_status === 'started' && !profile.account_request_submitted && profile.investment_onboarding_completion_percentage >= 80) audiences.push('High Intent Abandoner');
  if (profile.identity_verification_attempt_count >= 2 || profile.verification_code_attempt_count >= 2 || profile.password_creation_failed_count >= 2) audiences.push('Support Needed');
  if (profile.account_request_submitted && !profile.investment_account_created) audiences.push('Submitted Applicant');
  if (profile.investment_account_created) audiences.push('Active Customer');
  if (has(events, 'account_opening_started') || profile.account_request_submitted || profile.investment_account_created) audiences.push('Suppress Acquisition');
  return audiences;
}
