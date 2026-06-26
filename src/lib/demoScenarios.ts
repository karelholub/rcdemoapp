import { trackEvent, updateProfileFlags } from './tracking';
import type { DemoState, ScreenId } from './types';

export type ScenarioId = 'early' | 'verification-failure' | 'form' | 'review' | 'completed';

export const scenarioNotes: Record<ScenarioId, string> = {
  early: 'Intent is known after the first step. Generic acquisition is suppressed and recovery can use consented channels.',
  'verification-failure': 'Two failed checks move the next action from marketing recovery to secure support.',
  form: 'Identity and consent are complete. Meiro keeps the next form step and channel eligibility current.',
  review: 'At 90% completion, Meiro treats the user as high intent, suppresses acquisition, and activates only consented channels.',
  completed: 'Once the account is created, recovery stops and the welcome journey takes over.',
};

export function runScenario(initial: DemoState, scenario: ScenarioId): { state: DemoState; screen: ScreenId } {
  let state = initial;
  const t = (event: string, screen: string, payload: Record<string, unknown> = {}) => {
    state = trackEvent(state, event, screen, payload);
  };

  t('app_opened', 'welcome');
  t('screen_viewed', 'welcome');
  t('account_opening_started', 'welcome');
  t('account_status_selected', 'account-status', { has_existing_account: false });
  t('onboarding_path_selected', 'onboarding-path', { onboarding_path: 'new_customer', is_existing_bank_customer: false });

  if (scenario === 'early') {
    t('demo_abandonment_simulated', 'identity', { step: 'identity_verification' });
    return { state, screen: 'identity' };
  }

  t('identity_number_submitted', 'identity', { identity_step_completed: true });
  t('identity_verification_started', 'identity');

  if (scenario === 'verification-failure') {
    t('identity_verification_failed', 'verification', { error: 'verification_failed' });
    t('identity_verification_failed', 'verification', { error: 'timeout' });
    t('support_case_recommended', 'verification');
    return { state, screen: 'verification' };
  }

  t('identity_verification_completed', 'verification');
  t('privacy_notice_viewed', 'privacy');
  t('privacy_notice_accepted', 'privacy');
  t('personal_info_consent_given', 'consent', { personal_info_consent: true });
  t('channel_consent_updated', 'consent', { marketing_consent_push: true, marketing_consent_email: scenario === 'form', marketing_consent_whatsapp: true });
  t('form_step_started', 'personal', { form_name: 'personal_information' });
  t('form_step_completed', 'personal', { form_name: 'personal_information' });
  t('form_completed', 'personal', { form_name: 'personal_information' });
  t('form_step_started', 'employment', { form_name: 'employment_information' });

  if (scenario === 'form') {
    t('demo_abandonment_simulated', 'employment', { step: 'employment_information' });
    return { state, screen: 'employment' };
  }

  t('form_step_completed', 'employment', { form_name: 'employment_information' });
  t('form_completed', 'employment', { form_name: 'employment_information' });
  t('form_step_started', 'investment', { form_name: 'investment_profile' });
  t('form_completed', 'investment', { form_name: 'investment_profile' });
  t('wallet_type_selected', 'wallet', { wallet_type: 'Balanced portfolio' });
  t('account_details_submitted', 'account-details', { preferred_currency: 'USD', statement_preference: 'digital' });
  t('application_review_started', 'review');

  if (scenario === 'review') {
    t('demo_abandonment_simulated', 'review', { step: 'application_review' });
    return { state, screen: 'review' };
  }

  t('application_review_confirmed', 'review');
  t('password_creation_started', 'password');
  t('password_created', 'password');
  t('verification_code_sent', 'otp');
  t('verification_code_submitted', 'otp');
  t('verification_code_verified', 'otp');
  t('account_request_submitted', 'submitted');
  t('account_creation_completed', 'created');
  state = updateProfileFlags(state, { investment_wallet_type: 'Balanced portfolio' });
  return { state, screen: 'created' };
}
