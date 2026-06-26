import { ArrowRight, BadgeCheck, BriefcaseBusiness, Check, ChevronLeft, CircleDollarSign, Fingerprint, KeyRound, LockKeyhole, MessageSquareWarning, Shield, UserRound } from 'lucide-react';
import type { MeiroProfile, ScreenId } from '../lib/types';
import { ProgressBar } from '../components/ProgressBar';

type Action = {
  label: string;
  event: string;
  next?: ScreenId;
  payload?: Record<string, unknown>;
  variant?: 'primary' | 'secondary' | 'danger';
};

type ScreenConfig = {
  eyebrow: string;
  title: string;
  copy: string;
  icon: typeof Shield;
  fields?: string[];
  cards?: string[];
  actions: Action[];
};

const configs: Record<ScreenId, ScreenConfig> = {
  welcome: {
    eyebrow: 'Investment account',
    title: 'Welcome to Aurum Capital',
    copy: 'Open an investment account with secure identity checks and saved progress.',
    icon: Shield,
    actions: [
      { label: 'Open investment account', event: 'account_opening_started', next: 'account-status' },
      { label: 'I already have an account', event: 'login_started', next: 'login', variant: 'secondary' },
    ],
  },
  'account-status': {
    eyebrow: 'Account status',
    title: 'Do you already have an account with us?',
    copy: 'This helps us personalize the secure onboarding path.',
    icon: UserRound,
    cards: ['Yes, I already have an account', 'No, I want to open one'],
    actions: [
      { label: 'Existing account', event: 'account_status_selected', next: 'login', payload: { has_existing_account: true }, variant: 'secondary' },
      { label: 'Open a new account', event: 'account_status_selected', next: 'onboarding-path', payload: { has_existing_account: false } },
    ],
  },
  login: {
    eyebrow: 'Secure access',
    title: 'Sign in to Aurum Capital',
    copy: 'Existing customers sign in here. Demo controls can complete or fail the attempt.',
    icon: LockKeyhole,
    fields: ['Username', 'Password'],
    actions: [
      { label: 'Sign in', event: 'login_completed', next: 'created' },
      { label: 'Simulate failed login', event: 'login_failed', variant: 'danger' },
    ],
  },
  'onboarding-path': {
    eyebrow: 'Journey setup',
    title: 'Choose how to continue',
    copy: 'Select the path that matches the customer relationship.',
    icon: Shield,
    cards: ['Continue as existing bank customer', 'Continue as new customer'],
    actions: [
      { label: 'Existing bank customer', event: 'onboarding_path_selected', next: 'identity', payload: { onboarding_path: 'existing_bank_customer', is_existing_bank_customer: true }, variant: 'secondary' },
      { label: 'New customer', event: 'onboarding_path_selected', next: 'identity', payload: { onboarding_path: 'new_customer', is_existing_bank_customer: false } },
    ],
  },
  identity: {
    eyebrow: 'Identity',
    title: 'Verify your identity',
    copy: 'Enter a customer identifier. The demo records completion state, not raw ID values.',
    icon: Fingerprint,
    fields: ['National ID / Customer ID'],
    actions: [{ label: 'Continue securely', event: 'identity_number_submitted', next: 'verification', payload: { identity_step_completed: true } }],
  },
  verification: {
    eyebrow: 'Trusted verification',
    title: 'Confirm verification',
    copy: 'Please approve the verification request in your trusted identity app.',
    icon: BadgeCheck,
    actions: [
      { label: 'Verification successful', event: 'identity_verification_completed', next: 'privacy' },
      { label: 'Simulate timeout', event: 'identity_verification_failed', payload: { error: 'timeout' }, variant: 'secondary' },
      { label: 'Simulate failed verification', event: 'identity_verification_failed', payload: { error: 'verification_failed' }, variant: 'danger' },
    ],
  },
  privacy: {
    eyebrow: 'Privacy notice',
    title: 'Privacy notice',
    copy: 'We use your information to verify your identity, process your application, and provide secure digital services.',
    icon: Shield,
    actions: [{ label: 'I understand', event: 'privacy_notice_accepted', next: 'consent' }],
  },
  consent: {
    eyebrow: 'Consent',
    title: 'Consent to use information',
    copy: 'Set processing and channel consent before continuing.',
    icon: Check,
    cards: ['Application processing consent', 'Push consent', 'Email consent', 'WhatsApp consent'],
    actions: [{ label: 'Continue', event: 'personal_info_consent_given', next: 'personal', payload: { personal_info_consent: true } }],
  },
  personal: {
    eyebrow: 'Form step',
    title: 'Personal information',
    copy: 'The CDP receives step completion, not sensitive form values.',
    icon: UserRound,
    fields: ['Full name', 'Date of birth', 'Nationality', 'Contact details'],
    actions: [{ label: 'Continue', event: 'form_completed', next: 'employment', payload: { form_name: 'personal_information' } }],
  },
  employment: {
    eyebrow: 'Form step',
    title: 'Employment information',
    copy: 'Use broad categories only for this demo.',
    icon: BriefcaseBusiness,
    fields: ['Employment status', 'Industry', 'Income range'],
    actions: [{ label: 'Continue', event: 'form_completed', next: 'investment', payload: { form_name: 'employment_information' } }],
  },
  investment: {
    eyebrow: 'Investor profile',
    title: 'Investment profile',
    copy: 'Capture goal, experience, and risk comfort as safe categories.',
    icon: CircleDollarSign,
    fields: ['Investment experience', 'Investment goal', 'Risk comfort level', 'Expected investment range'],
    actions: [{ label: 'Continue', event: 'form_completed', next: 'wallet', payload: { form_name: 'investment_profile' } }],
  },
  wallet: {
    eyebrow: 'Account setup',
    title: 'Choose your investment setup',
    copy: 'Select the starting investment setup.',
    icon: CircleDollarSign,
    cards: ['Local investments', 'Global investments', 'Balanced portfolio'],
    actions: [{ label: 'Continue with balanced portfolio', event: 'wallet_type_selected', next: 'account-details', payload: { wallet_type: 'Balanced portfolio' } }],
  },
  'account-details': {
    eyebrow: 'Account details',
    title: 'Account details',
    copy: 'Confirm funding, currency, and statement preferences.',
    icon: KeyRound,
    fields: ['Funding account', 'Preferred currency', 'Statement preference'],
    actions: [{ label: 'Continue', event: 'account_details_submitted', next: 'review', payload: { preferred_currency: 'USD', statement_preference: 'digital' } }],
  },
  review: {
    eyebrow: 'Final review',
    title: 'Review and confirm',
    copy: 'Your application is almost complete. Review and submit your details securely.',
    icon: BadgeCheck,
    cards: ['Identity verified', 'Privacy notice accepted', 'Consent provided', 'Personal information completed', 'Employment information completed', 'Investment profile completed', 'Wallet selected'],
    actions: [
      { label: 'Confirm and continue', event: 'application_review_confirmed', next: 'password' },
      { label: 'Simulate abandonment here', event: 'demo_abandonment_simulated', payload: { step: 'application_review' }, variant: 'secondary' },
    ],
  },
  password: {
    eyebrow: 'Security',
    title: 'Create secure password',
    copy: 'Protect your Aurum Capital access with a secure password.',
    icon: LockKeyhole,
    fields: ['Password', 'Confirm password'],
    actions: [
      { label: 'Continue', event: 'password_created', next: 'otp' },
      { label: 'Simulate password policy error', event: 'password_creation_failed', variant: 'danger' },
    ],
  },
  otp: {
    eyebrow: 'Final verification',
    title: 'Final verification',
    copy: 'Enter the 6-digit code. The code itself is never stored.',
    icon: MessageSquareWarning,
    fields: ['6-digit code'],
    actions: [
      { label: 'Verify', event: 'verification_code_verified', next: 'submitted' },
      { label: 'Resend code', event: 'verification_code_resend_requested', variant: 'secondary' },
      { label: 'Simulate expired code', event: 'verification_code_failed', payload: { error: 'expired' }, variant: 'danger' },
    ],
  },
  submitted: {
    eyebrow: 'Submitted',
    title: 'Application submitted',
    copy: 'Your investment account request has been submitted. We will notify you once the review is complete.',
    icon: Check,
    actions: [{ label: 'Simulate account created', event: 'account_creation_completed', next: 'created' }],
  },
  created: {
    eyebrow: 'Account ready',
    title: 'Your account is ready',
    copy: 'Welcome to Aurum Capital. You can now fund your wallet and explore investment options.',
    icon: BadgeCheck,
    actions: [{ label: 'Explore Aurum', event: 'screen_viewed', variant: 'secondary' }],
  },
};

export function OnboardingScreen({
  screen,
  profile,
  onAction,
  onBack,
}: {
  screen: ScreenId;
  profile: MeiroProfile;
  onAction: (action: Action) => void;
  onBack: () => void;
}) {
  const config = configs[screen];
  const Icon = config.icon;
  const primary = config.actions[0];

  return (
    <div className="flex min-h-[720px] flex-col px-5 pb-6 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={onBack} className="rounded-full border border-white/10 bg-white/5 p-2 text-slate-300">
          <ChevronLeft size={17} />
        </button>
        <span className="text-xs font-medium text-slate-400">{profile.investment_onboarding_completion_percentage}%</span>
      </div>
      <ProgressBar value={profile.investment_onboarding_completion_percentage} />
      <div className="mt-8 rounded-2xl border border-white/12 bg-white/[0.055] p-5 shadow-cyan">
        <div className="mb-10 flex items-center justify-between">
          <div className="rounded-xl border border-white/15 bg-black/20 p-3 text-aurum">
            <Icon size={26} />
          </div>
          <span className="rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] text-slate-300">Secure flow</span>
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aurum">{config.eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight text-white">{config.title}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-300">{config.copy}</p>
      </div>

      <div className="mt-5 flex-1 space-y-3">
        {config.fields?.map((field) => (
          <div key={field} className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div className="text-[11px] uppercase tracking-wide text-slate-500">{field}</div>
            <div className="mt-2 h-5 rounded bg-white/5" />
          </div>
        ))}
        {config.cards?.map((card) => (
          <div key={card} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.045] px-4 py-3 text-sm text-slate-100">
            <span>{card}</span>
            <Check size={15} className="text-mint" />
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        {config.actions.map((action) => (
          <button
            key={action.label}
            onClick={() => onAction(action)}
            className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${
              action.variant === 'danger'
                ? 'border border-rose-300/25 bg-rose-300/10 text-rose-100'
                : action.variant === 'secondary'
                  ? 'border border-white/10 bg-white/5 text-slate-100'
                  : 'bg-aurum text-graphite shadow-glow'
            }`}
          >
            {action.label}
            {action === primary ? <ArrowRight size={16} /> : null}
          </button>
        ))}
      </div>
    </div>
  );
}
