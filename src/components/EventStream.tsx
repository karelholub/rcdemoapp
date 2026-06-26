import { motion, AnimatePresence } from 'framer-motion';
import { Radio } from 'lucide-react';
import type { DemoEvent } from '../lib/types';

const important = new Set(['application_review_started', 'demo_abandonment_simulated', 'account_request_submitted', 'account_creation_completed', 'support_case_recommended']);

export function EventStream({ events }: { events: DemoEvent[] }) {
  return (
    <section className="glass rounded-2xl p-4">
      <div className="mb-3 flex items-center gap-2">
        <Radio size={17} className="text-mint" />
        <h2 className="text-sm font-semibold">Live Event Stream</h2>
      </div>
      <div className="hide-scrollbar flex max-h-52 flex-col gap-2 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {events.length === 0 ? <p className="text-xs text-slate-400">Events will stream here as the app is used.</p> : null}
          {events.map((event) => (
            <motion.div
              key={`${event.timestamp}-${event.event_type}`}
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-lg border p-2 text-xs ${important.has(event.event_type) ? 'border-aurum/40 bg-aurum/10 shadow-glow' : 'border-white/10 bg-white/[0.04]'}`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-slate-100">{event.event_type}</span>
                <span className="text-[10px] text-slate-500">{new Date(event.timestamp).toLocaleTimeString()}</span>
              </div>
              <p className="mt-1 truncate text-slate-400">{JSON.stringify(event.payload)}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
}
