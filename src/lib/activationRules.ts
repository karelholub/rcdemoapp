import type { ActivationDecision, MeiroProfile } from './types';

export function calculateActivations(profile: MeiroProfile): ActivationDecision[] {
  const completed = profile.investment_account_created;
  const submitted = profile.account_request_submitted && !completed;
  const supportNeeded = profile.support_case_recommended;
  const highIntent = profile.application_review_status === 'started' && !profile.account_request_submitted;
  const abandoned = profile.investment_onboarding_status === 'abandoned' || highIntent;

  const pushAllowed = profile.marketing_consent_push && profile.push_token_available;
  const emailAllowed = profile.marketing_consent_email && profile.email_available;
  const whatsappAllowed = profile.marketing_consent_whatsapp && profile.whatsapp_phone_available && profile.approved_template_available;

  return [
    {
      channel: 'Push notification',
      status: completed ? 'Triggered' : supportNeeded && pushAllowed ? 'Triggered' : abandoned && pushAllowed ? 'Triggered' : pushAllowed && !submitted ? 'Eligible' : 'Not allowed',
      reason: completed ? 'Account lifecycle moved to active customer.' : supportNeeded ? 'Repeated friction detected; route to help instead of generic recovery.' : pushAllowed ? 'Push consent and token available.' : 'Push consent or token is unavailable.',
      message: completed ? 'Your account is ready. Open the app to get started.' : supportNeeded ? 'Need help completing your application? Open the app for secure support.' : highIntent ? 'Your application is almost complete. Review and submit it securely in the app.' : 'Continue your Aurum Capital application from where you left off.',
      deepLink: highIntent ? 'aurum://onboarding/review' : 'aurum://onboarding/resume',
    },
    {
      channel: 'Email',
      status: emailAllowed ? (submitted ? 'Triggered' : abandoned ? 'Eligible' : 'Waiting') : 'Suppressed',
      reason: emailAllowed ? 'Email consent and address are available.' : 'Email consent is false, so recovery email is suppressed.',
      message: submitted ? 'Subject: Application received. Preview: Your request is saved and pending review.' : 'Subject: Continue your Aurum Capital application. Preview: Your application is saved. Return to the app and continue securely.',
      deepLink: 'https://demo.aurum.example/onboarding/resume',
    },
    {
      channel: 'WhatsApp',
      status: whatsappAllowed && highIntent ? 'Eligible' : whatsappAllowed ? 'Waiting' : 'Not allowed',
      reason: whatsappAllowed ? 'Consent, reachable phone, and approved template are available.' : 'WhatsApp consent, reachable phone, or approved template is unavailable.',
      message: 'Your Aurum Capital application is almost complete. Continue securely in the app.',
      deepLink: 'aurum://onboarding/review',
      compliance: 'Uses approved service-oriented template. No sensitive details included.',
    },
    {
      channel: 'Paid media',
      status: profile.investment_onboarding_status !== 'not_started' || submitted || completed ? 'Suppressed' : 'Waiting',
      reason: profile.investment_onboarding_status !== 'not_started' || submitted || completed ? 'Suppress from generic acquisition campaigns.' : 'No onboarding intent yet.',
      message: profile.investment_onboarding_status !== 'not_started' && !submitted && !completed ? 'Eligible only for broad onboarding recovery audience. No sensitive step-level ad copy.' : 'Generic acquisition remains paused when customer intent is known.',
    },
    {
      channel: 'Support / call center',
      status: supportNeeded ? 'Triggered' : 'Waiting',
      reason: supportNeeded ? 'Repeated verification, password, or OTP friction detected.' : 'No repeated failure threshold reached.',
      message: 'Need help completing your application? Open the app for secure support.',
      deepLink: 'aurum://support/secure',
    },
    {
      channel: 'Welcome journey',
      status: completed ? 'Triggered' : submitted ? 'Waiting' : 'Suppressed',
      reason: completed ? 'Investment account created; recovery journeys are stopped.' : submitted ? 'Application submitted, pending account creation.' : 'Only starts after the account is ready.',
      message: completed ? `Welcome to Aurum Capital. Start with ${profile.investment_wallet_type ?? 'your selected'} onboarding and a first deposit.` : 'Pending account review journey is active.',
      deepLink: 'aurum://wallet/start',
    },
  ];
}
