import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  BriefcaseBusiness,
  Check,
  ChevronLeft,
  CircleDollarSign,
  Fingerprint,
  Home,
  KeyRound,
  Landmark,
  LockKeyhole,
  MessageSquareWarning,
  MoreHorizontal,
  PieChart,
  RefreshCw,
  Shield,
  Star,
  UserRound,
  WalletCards,
} from 'lucide-react';
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
    <div className="flex min-h-[720px] flex-col bg-[#f7f8fb] text-[#23104f]">
      <div className="bg-gradient-to-br from-[#36117f] via-[#28106d] to-[#1d0b58] px-5 pb-14 pt-4 text-white">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={onBack} className="rounded-full border border-white/15 bg-white/10 p-2 text-white">
            <ChevronLeft size={17} />
          </button>
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <span className="rounded-full bg-white/15 px-2 py-1">Open</span>
            <span>TASI 7,942.43</span>
          </div>
          <button className="rounded-full border border-white/15 bg-white/10 p-2 text-white">
            <Bell size={15} />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#13b8aa] text-sm font-bold">A</div>
          <div>
            <p className="text-[11px] text-white/70">Good Morning, Ahmad</p>
            <h2 className="text-base font-semibold">Aurum Capital</h2>
          </div>
        </div>
      </div>

      <div className="-mt-10 flex flex-1 flex-col px-5 pb-4">
        <div className="rounded-lg bg-white p-4 shadow-xl shadow-[#23104f]/15">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium text-slate-500">Total balance</p>
              <div className="mt-1 flex items-end gap-1">
                <span className="text-2xl font-semibold tracking-tight text-[#1f1740]">100,000.00</span>
                <span className="pb-1 text-[10px] font-semibold text-slate-500">SAR</span>
              </div>
            </div>
            <div className="rounded-full bg-[#e8f8f5] px-2.5 py-1 text-[11px] font-semibold text-[#0b9f91]">{profile.investment_onboarding_completion_percentage}%</div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            {[
              ['Profit', '+1,000.00', '+1.00%'],
              ['G/L', '+2.75%', '+2.10%'],
              ['Net Worth', '98,000.00', 'SAR'],
            ].map(([label, value, meta]) => (
              <div key={label} className="rounded-lg bg-[#f6f8fb] px-2 py-2">
                <p className="text-[10px] text-slate-500">{label}</p>
                <p className="mt-1 text-xs font-semibold text-[#08a992]">{value}</p>
                <p className="text-[9px] text-slate-400">{meta}</p>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <ProgressBar value={profile.investment_onboarding_completion_percentage} />
          </div>
        </div>

        <div className="mt-4 rounded-lg bg-white p-4 shadow-sm shadow-[#23104f]/10">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#efeafb] p-3 text-[#34127a]">
                <Icon size={24} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#08a992]">{config.eyebrow}</p>
                <h2 className="text-xl font-semibold leading-tight text-[#1f1740]">{config.title}</h2>
              </div>
            </div>
            <span className="rounded-full border border-[#e6e1ef] px-2.5 py-1 text-[10px] font-semibold text-[#34127a]">Secure</span>
          </div>
          <p className="text-sm leading-6 text-slate-600">{config.copy}</p>

          <div className="mt-5 space-y-2">
            {config.fields?.map((field) => (
              <div key={field} className="rounded-lg border border-[#edf0f4] bg-[#f7f8fb] px-4 py-3">
                <div className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{field}</div>
                <div className="mt-2 h-5 rounded bg-white" />
              </div>
            ))}
            {config.cards?.map((card, index) => (
              <div key={card} className="flex items-center justify-between rounded-lg border border-[#edf0f4] bg-[#f7f8fb] px-4 py-3 text-sm text-[#241546]">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#e8f8f5] text-[10px] font-semibold text-[#08a992]">{index + 1}</span>
                  {card}
                </span>
                <Check size={15} className="text-[#08a992]" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {[
            ['Cash', '25,000.00', WalletCards],
            ['Stocks', '25,000.00', BarChart3],
            ['Funds', '50,000.00', Landmark],
          ].map(([label, value, CardIcon]) => {
            const TypedIcon = CardIcon as typeof WalletCards;
            const labelText = String(label);
            const valueText = String(value);
            return (
              <div key={labelText} className="rounded-lg bg-gradient-to-br from-[#4e35a0] to-[#8cb7e8] p-3 text-white">
                <TypedIcon size={17} />
                <p className="mt-2 text-[11px] font-semibold">{labelText}</p>
                <p className="mt-1 text-[10px] text-white/80">{valueText} SAR</p>
              </div>
            );
          })}
        </div>

        <div className="mt-auto space-y-2 pt-4">
          {config.actions.map((action) => (
            <button
              key={action.label}
              onClick={() => onAction(action)}
              className={`flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold ${
                action.variant === 'danger'
                  ? 'border border-red-100 bg-red-50 text-red-600'
                  : action.variant === 'secondary'
                    ? 'border border-[#ddd7eb] bg-white text-[#34127a]'
                    : 'bg-[#10b8aa] text-white shadow-lg shadow-[#10b8aa]/25'
              }`}
            >
              {action.label}
              {action === primary ? <ArrowRight size={16} /> : null}
            </button>
          ))}
        </div>

        <nav className="mt-4 grid grid-cols-5 items-center rounded-lg bg-white px-2 py-2 text-[10px] font-medium text-slate-400 shadow-sm">
          {[
            ['Portfolio', Home],
            ['Markets', PieChart],
            ['Trade', RefreshCw],
            ['Watchlist', Star],
            ['More', MoreHorizontal],
          ].map(([label, NavIcon]) => {
            const TypedIcon = NavIcon as typeof Home;
            const active = label === 'Trade';
            return (
              <div key={label as string} className={`flex flex-col items-center gap-1 ${active ? 'text-[#34127a]' : ''}`}>
                <span className={active ? 'rounded-full bg-[#34127a] p-2 text-white' : 'p-2'}>
                  <TypedIcon size={15} />
                </span>
                {label as string}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
