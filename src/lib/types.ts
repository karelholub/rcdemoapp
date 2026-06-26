export type ScreenId =
  | 'welcome'
  | 'account-status'
  | 'login'
  | 'onboarding-path'
  | 'identity'
  | 'verification'
  | 'privacy'
  | 'consent'
  | 'personal'
  | 'employment'
  | 'investment'
  | 'wallet'
  | 'account-details'
  | 'review'
  | 'password'
  | 'otp'
  | 'submitted'
  | 'created';

export type ActivationStatus = 'Eligible' | 'Triggered' | 'Suppressed' | 'Waiting' | 'Not allowed' | 'Completed';

export type DemoEvent = {
  event_type: string;
  timestamp: string;
  anonymous_id: string;
  session_id: string;
  user_id?: string | null;
  browser?: string;
  crm_customer_id?: string;
  device_id?: string;
  mobile_user_id?: string;
  journey_name: 'investment_account_opening';
  screen_name: string;
  payload: Record<string, unknown>;
  profile_updates?: Record<string, unknown>;
};

export type MeiroProfile = {
  anonymous_id: string;
  known_customer_id: string | null;
  browser: string;
  crm_customer_id: string;
  device_id: string;
  mobile_user_id: string;
  user_id: string;
  customer_lifecycle_stage: 'anonymous_prospect' | 'known_prospect' | 'applicant' | 'active_customer' | 'existing_customer';
  investment_onboarding_status: 'not_started' | 'started' | 'in_progress' | 'submitted' | 'completed' | 'abandoned';
  investment_onboarding_started_at: string | null;
  investment_onboarding_last_activity_at: string | null;
  investment_onboarding_last_completed_step: string | null;
  investment_onboarding_next_step: string | null;
  investment_onboarding_abandoned_step: string | null;
  investment_onboarding_completion_percentage: number;
  has_existing_account: boolean | null;
  is_existing_bank_customer: boolean | null;
  identity_verification_status: 'not_started' | 'started' | 'completed' | 'failed' | 'timeout';
  identity_verification_attempt_count: number;
  identity_verification_last_error: string | null;
  personal_info_consent: boolean;
  marketing_consent_push: boolean;
  marketing_consent_email: boolean;
  marketing_consent_whatsapp: boolean;
  push_token_available: boolean;
  email_available: boolean;
  whatsapp_phone_available: boolean;
  approved_template_available: boolean;
  privacy_notice_viewed: boolean;
  privacy_notice_accepted: boolean;
  last_completed_form_name: string | null;
  employment_information_completed: boolean;
  investment_profile_completed: boolean;
  risk_profile_category: string | null;
  investment_goal_category: string | null;
  investment_experience_level: string | null;
  investment_wallet_type: string | null;
  investment_wallet_selected_at: string | null;
  account_details_completed: boolean;
  application_review_status: 'not_started' | 'started' | 'confirmed';
  password_creation_status: 'not_started' | 'started' | 'created' | 'failed';
  password_creation_failed_count: number;
  verification_code_status: 'not_started' | 'sent' | 'submitted' | 'verified' | 'failed' | 'expired';
  verification_code_attempt_count: number;
  account_request_submitted: boolean;
  account_request_submitted_at: string | null;
  investment_account_created: boolean;
  investment_account_created_at: string | null;
  support_case_recommended: boolean;
  next_best_action: string | null;
};

export type ActivationDecision = {
  channel: string;
  status: ActivationStatus;
  reason: string;
  message: string;
  deepLink?: string;
  compliance?: string;
};

export type DemoState = {
  profile: MeiroProfile;
  events: DemoEvent[];
  audiences: string[];
  activations: ActivationDecision[];
};

export type TrackingMode = 'demo' | 'live';
