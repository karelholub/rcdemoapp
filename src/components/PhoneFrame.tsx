import { motion, AnimatePresence } from 'framer-motion';
import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[390px] rounded-[2.25rem] border border-white/15 bg-black p-3 shadow-2xl shadow-black/50">
      <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#f7f8fb]">
        <div className="flex h-8 items-center justify-between bg-[#2f1175] px-6 text-[11px] text-white">
          <span>9:41</span>
          <span className="h-4 w-20 rounded-full bg-black/45" />
          <span>5G 100%</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={String((children as { key?: unknown }).key ?? 'screen')} initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -22 }} transition={{ duration: 0.22 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
