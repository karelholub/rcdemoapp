import { motion } from 'framer-motion';
import { Bell, CheckCircle2, Headphones, Mail, Megaphone, MessageCircle, Route } from 'lucide-react';
import type { ActivationDecision, ActivationStatus } from '../lib/types';

const icons = {
  'Push notification': Bell,
  Email: Mail,
  WhatsApp: MessageCircle,
  'Paid media': Megaphone,
  'Support / call center': Headphones,
  'Welcome journey': Route,
};

const tones: Record<ActivationStatus, string> = {
  Triggered: 'border-mint/40 bg-mint/10 text-mint',
  Eligible: 'border-cyanSoft/40 bg-cyanSoft/10 text-cyanSoft',
  Suppressed: 'border-rose-300/30 bg-rose-300/10 text-rose-200',
  Waiting: 'border-white/15 bg-white/5 text-slate-300',
  'Not allowed': 'border-amber-200/30 bg-amber-200/10 text-amber-100',
  Completed: 'border-mint/40 bg-mint/10 text-mint',
};

export function ActivationPanel({ decisions }: { decisions: ActivationDecision[] }) {
  return (
    <section className="glass flex min-h-0 flex-col rounded-2xl p-5">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-xl border border-aurum/30 bg-aurum/10 p-2 text-aurum">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <h2 className="text-lg font-semibold">Activation Engine</h2>
          <p className="text-xs text-slate-400">Consent-aware orchestration</p>
        </div>
      </div>
      <div className="hide-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto pr-1">
        {decisions.map((decision) => {
          const Icon = icons[decision.channel as keyof typeof icons] ?? Bell;
          return (
            <motion.article
              key={`${decision.channel}-${decision.status}-${decision.message}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-white/10 bg-white/[0.045] p-3"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon size={17} className="text-aurum" />
                  <h3 className="text-sm font-semibold">{decision.channel}</h3>
                </div>
                <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${tones[decision.status]}`}>{decision.status}</span>
              </div>
              <p className="text-xs leading-relaxed text-slate-300">{decision.reason}</p>
              <p className="mt-2 rounded-lg bg-black/20 p-2 text-xs text-slate-100">{decision.message}</p>
              {decision.deepLink ? <p className="mt-2 text-[11px] text-cyanSoft">{decision.deepLink}</p> : null}
              {decision.compliance ? <p className="mt-1 text-[11px] text-slate-500">{decision.compliance}</p> : null}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
