import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import type { MeiroProfile } from '../lib/types';
import { AudienceBadges } from './AudienceBadges';
import { ProgressBar } from './ProgressBar';

const label = (key: string) => key.replace(/_/g, ' ').replace(/\b\w/g, (letter: string) => letter.toUpperCase());

export function ProfilePanel({ profile, audiences }: { profile: MeiroProfile; audiences: string[] }) {
  const rows = [
    ['Browser ID', profile.browser],
    ['CRM customer ID', profile.crm_customer_id],
    ['Mobile user ID', profile.mobile_user_id],
    ['Device ID', profile.device_id],
    ['Lifecycle stage', profile.customer_lifecycle_stage],
    ['Onboarding status', profile.investment_onboarding_status],
    ['Last completed step', profile.investment_onboarding_last_completed_step],
    ['Next expected step', profile.investment_onboarding_next_step],
    ['Abandoned step', profile.investment_onboarding_abandoned_step],
    ['Existing account', profile.has_existing_account],
    ['Bank customer', profile.is_existing_bank_customer],
    ['Identity status', profile.identity_verification_status],
    ['Identity attempts', profile.identity_verification_attempt_count || null],
    ['Consent: processing', profile.personal_info_consent],
    ['Consent: push', profile.marketing_consent_push],
    ['Consent: email', profile.marketing_consent_email],
    ['Consent: WhatsApp', profile.marketing_consent_whatsapp],
    ['Wallet type', profile.investment_wallet_type],
    ['Next best action', profile.next_best_action],
  ].filter(([, value]) => value !== null && value !== 'not_started' && value !== false);

  return (
    <section className="glass flex min-h-0 flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl border border-mint/30 bg-mint/10 p-2 text-mint">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Live Meiro CDP Profile</h2>
          <p className="text-xs text-slate-400">Real-time journey intelligence</p>
        </div>
      </div>
      <div className="mb-5 space-y-2">
        <div className="flex justify-between text-xs text-slate-400">
          <span>Completion</span>
          <span>{profile.investment_onboarding_completion_percentage}%</span>
        </div>
        <ProgressBar value={profile.investment_onboarding_completion_percentage} />
      </div>
      <div className="mb-5">
        <AudienceBadges audiences={audiences} />
      </div>
      <div className="hide-scrollbar min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
        {rows.map(([name, value]) => (
          <motion.div
            key={`${name}-${String(value)}`}
            initial={{ backgroundColor: 'rgba(214, 182, 106, 0.18)' }}
            animate={{ backgroundColor: 'rgba(255, 255, 255, 0.045)' }}
            className="rounded-lg border border-white/10 px-3 py-2"
          >
            <div className="text-[11px] uppercase tracking-wide text-slate-500">{name}</div>
            <div className="text-sm font-medium text-slate-100">{typeof value === 'boolean' ? (value ? 'true' : 'false') : label(String(value))}</div>
          </motion.div>
        ))}
      </div>
      <p className="mt-4 rounded-lg border border-cyanSoft/20 bg-cyanSoft/10 p-3 text-xs leading-relaxed text-cyanSoft/90">
        Demo principle: Meiro tracks journey state and consent-aware activation signals, not unnecessary sensitive form values.
      </p>
    </section>
  );
}
