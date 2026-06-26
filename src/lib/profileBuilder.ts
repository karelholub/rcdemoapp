import type { DemoEvent, MeiroProfile } from './types';

export const createInitialProfile = (): MeiroProfile => ({
  anonymous_id: 'demo_visitor_001',
  known_customer_id: null,
  customer_lifecycle_stage: 'anonymous_prospect',
  investment_onboarding_status: 'not_started',
  investment_onboarding_started_at: null,
  investment_onboarding_last_activity_at: null,
  investment_onboarding_last_completed_step: null,
  investment_onboarding_next_step: null,
  investment_onboarding_abandoned_step: null,
  investment_onboarding_completion_percentage: 0,
  has_existing_account: null,
  is_existing_bank_customer: null,
  identity_verification_status: 'not_started',
  identity_verification_attempt_count: 0,
  identity_verification_last_error: null,
  personal_info_consent: false,
  marketing_consent_push: true,
  marketing_consent_email: false,
  marketing_consent_whatsapp: true,
  push_token_available: true,
  email_available: true,
  whatsapp_phone_available: true,
  approved_template_available: true,
  privacy_notice_viewed: false,
  privacy_notice_accepted: false,
  last_completed_form_name: null,
  employment_information_completed: false,
  investment_profile_completed: false,
  risk_profile_category: null,
  investment_goal_category: null,
  investment_experience_level: null,
  investment_wallet_type: null,
  investment_wallet_selected_at: null,
  account_details_completed: false,
  application_review_status: 'not_started',
  password_creation_status: 'not_started',
  password_creation_failed_count: 0,
  verification_code_status: 'not_started',
  verification_code_attempt_count: 0,
  account_request_submitted: false,
  account_request_submitted_at: null,
  investment_account_created: false,
  investment_account_created_at: null,
  support_case_recommended: false,
  next_best_action: null,
});

const completionByStep: Record<string, number> = {
  account_status: 8,
  onboarding_path: 14,
  identity: 24,
  verification: 34,
  privacy: 42,
  consent: 50,
  personal_information: 60,
  employment_information: 70,
  investment_profile: 78,
  wallet: 84,
  account_details: 88,
  review: 90,
  password: 94,
  otp: 98,
};

const nextStepByScreen: Record<string, string> = {
  welcome: 'account_status',
  'account-status': 'onboarding_path',
  'onboarding-path': 'identity',
  identity: 'verification',
  verification: 'privacy_notice',
  privacy: 'consent',
  consent: 'personal_information',
  personal: 'employment_information',
  employment: 'investment_profile',
  investment: 'wallet_selection',
  wallet: 'account_details',
  'account-details': 'application_review',
  review: 'create_password',
  password: 'final_verification',
  otp: 'submit_application',
};

export function applyEvent(profile: MeiroProfile, event: DemoEvent): { profile: MeiroProfile; updates: Record<string, unknown> } {
  const p: MeiroProfile = { ...profile, investment_onboarding_last_activity_at: event.timestamp };
  const updates: Record<string, unknown> = { investment_onboarding_last_activity_at: event.timestamp };
  const set = <K extends keyof MeiroProfile>(key: K, value: MeiroProfile[K]) => {
    p[key] = value;
    updates[key] = value;
  };
  const payload = event.payload;

  if (event.event_type === 'account_opening_started') {
    set('investment_onboarding_status', 'started');
    set('investment_onboarding_started_at', p.investment_onboarding_started_at ?? event.timestamp);
    set('investment_onboarding_completion_percentage', 5);
    set('next_best_action', 'choose onboarding path');
  }

  if (event.event_type === 'account_status_selected') {
    set('has_existing_account', Boolean(payload.has_existing_account));
    set('investment_onboarding_last_completed_step', 'account_status');
    set('investment_onboarding_next_step', Boolean(payload.has_existing_account) ? 'login' : 'onboarding_path');
    set('investment_onboarding_completion_percentage', completionByStep.account_status);
  }

  if (event.event_type === 'login_completed') {
    set('known_customer_id', 'aurum_existing_customer');
    set('customer_lifecycle_stage', 'existing_customer');
    set('has_existing_account', true);
    set('investment_onboarding_status', 'completed');
    set('next_best_action', 'show secure account dashboard');
  }

  if (event.event_type === 'onboarding_path_selected') {
    set('is_existing_bank_customer', Boolean(payload.is_existing_bank_customer));
    set('investment_onboarding_last_completed_step', 'onboarding_path');
    set('investment_onboarding_next_step', 'identity_verification');
    set('investment_onboarding_completion_percentage', completionByStep.onboarding_path);
    set('investment_onboarding_status', 'in_progress');
  }

  if (event.event_type === 'identity_verification_started') {
    set('identity_verification_status', 'started');
    set('investment_onboarding_next_step', 'complete_identity_verification');
    set('next_best_action', 'complete secure identity verification');
  }

  if (event.event_type === 'identity_verification_completed') {
    set('identity_verification_status', 'completed');
    set('investment_onboarding_last_completed_step', 'identity_verification');
    set('investment_onboarding_next_step', 'privacy_notice');
    set('investment_onboarding_completion_percentage', completionByStep.verification);
  }

  if (event.event_type === 'identity_verification_failed') {
    set('identity_verification_status', (payload.error === 'timeout' ? 'timeout' : 'failed') as MeiroProfile['identity_verification_status']);
    set('identity_verification_attempt_count', p.identity_verification_attempt_count + 1);
    set('identity_verification_last_error', String(payload.error ?? 'verification_failed'));
  }

  if (event.event_type === 'privacy_notice_viewed') set('privacy_notice_viewed', true);
  if (event.event_type === 'privacy_notice_accepted') {
    set('privacy_notice_accepted', true);
    set('investment_onboarding_last_completed_step', 'privacy_notice');
    set('investment_onboarding_next_step', 'consent');
    set('investment_onboarding_completion_percentage', completionByStep.privacy);
  }

  if (event.event_type === 'personal_info_consent_given') {
    set('personal_info_consent', Boolean(payload.personal_info_consent));
    set('investment_onboarding_last_completed_step', 'consent');
    set('investment_onboarding_next_step', 'personal_information');
    set('investment_onboarding_completion_percentage', completionByStep.consent);
  }

  if (event.event_type === 'channel_consent_updated') {
    if ('marketing_consent_push' in payload) set('marketing_consent_push', Boolean(payload.marketing_consent_push));
    if ('marketing_consent_email' in payload) set('marketing_consent_email', Boolean(payload.marketing_consent_email));
    if ('marketing_consent_whatsapp' in payload) set('marketing_consent_whatsapp', Boolean(payload.marketing_consent_whatsapp));
  }

  if (event.event_type === 'form_completed') {
    const formName = String(payload.form_name);
    set('last_completed_form_name', formName);
    set('investment_onboarding_last_completed_step', formName);
    set('investment_onboarding_completion_percentage', completionByStep[formName] ?? p.investment_onboarding_completion_percentage);
    if (formName === 'personal_information') set('investment_onboarding_next_step', 'employment_information');
    if (formName === 'employment_information') {
      set('employment_information_completed', true);
      set('investment_onboarding_next_step', 'investment_profile');
    }
    if (formName === 'investment_profile') {
      set('investment_profile_completed', true);
      set('risk_profile_category', 'balanced');
      set('investment_goal_category', 'long-term growth');
      set('investment_experience_level', 'some experience');
      set('investment_onboarding_next_step', 'wallet_selection');
    }
  }

  if (event.event_type === 'wallet_type_selected') {
    set('investment_wallet_type', String(payload.wallet_type));
    set('investment_wallet_selected_at', event.timestamp);
    set('investment_onboarding_last_completed_step', 'wallet_selection');
    set('investment_onboarding_next_step', 'account_details');
    set('investment_onboarding_completion_percentage', completionByStep.wallet);
  }

  if (event.event_type === 'account_details_submitted') {
    set('account_details_completed', true);
    set('investment_onboarding_last_completed_step', 'account_details');
    set('investment_onboarding_next_step', 'application_review');
    set('investment_onboarding_completion_percentage', completionByStep.account_details);
  }

  if (event.event_type === 'application_review_started') {
    set('application_review_status', 'started');
    set('investment_onboarding_last_completed_step', 'application_review');
    set('investment_onboarding_next_step', 'submit_application');
    set('investment_onboarding_completion_percentage', 90);
    set('next_best_action', 'return to review and submit');
  }

  if (event.event_type === 'application_review_confirmed') {
    set('application_review_status', 'confirmed');
    set('investment_onboarding_next_step', 'create_secure_password');
  }

  if (event.event_type === 'password_creation_started') set('password_creation_status', 'started');
  if (event.event_type === 'password_created') {
    set('password_creation_status', 'created');
    set('investment_onboarding_completion_percentage', completionByStep.password);
    set('investment_onboarding_next_step', 'final_verification');
  }
  if (event.event_type === 'password_creation_failed') {
    set('password_creation_status', 'failed');
    set('password_creation_failed_count', p.password_creation_failed_count + 1);
  }

  if (event.event_type === 'verification_code_sent') set('verification_code_status', 'sent');
  if (event.event_type === 'verification_code_submitted') set('verification_code_status', 'submitted');
  if (event.event_type === 'verification_code_verified') {
    set('verification_code_status', 'verified');
    set('investment_onboarding_completion_percentage', completionByStep.otp);
  }
  if (event.event_type === 'verification_code_failed') {
    set('verification_code_status', String(payload.error) === 'expired' ? 'expired' : 'failed');
    set('verification_code_attempt_count', p.verification_code_attempt_count + 1);
  }

  if (event.event_type === 'account_request_submitted') {
    set('account_request_submitted', true);
    set('account_request_submitted_at', event.timestamp);
    set('investment_onboarding_status', 'submitted');
    set('customer_lifecycle_stage', 'applicant');
    set('investment_onboarding_completion_percentage', 100);
    set('next_best_action', 'pending review journey');
  }

  if (event.event_type === 'account_creation_completed') {
    set('investment_account_created', true);
    set('investment_account_created_at', event.timestamp);
    set('customer_lifecycle_stage', 'active_customer');
    set('investment_onboarding_status', 'completed');
    set('next_best_action', 'make first deposit');
  }

  if (event.event_type === 'demo_abandonment_simulated') {
    set('investment_onboarding_status', 'abandoned');
    set('investment_onboarding_abandoned_step', String(payload.step ?? event.screen_name));
  }

  if (['identity_verification_failed', 'password_creation_failed', 'verification_code_failed'].includes(event.event_type)) {
    if (p.identity_verification_attempt_count >= 2 || p.password_creation_failed_count >= 2 || p.verification_code_attempt_count >= 2) {
      set('support_case_recommended', true);
      set('next_best_action', 'offer secure support');
    }
  }

  if (nextStepByScreen[event.screen_name] && event.event_type === 'screen_viewed') {
    set('investment_onboarding_next_step', nextStepByScreen[event.screen_name]);
  }

  return { profile: p, updates };
}
