import type { ReactNode } from 'react';

export function DemoShell({ left, center, right, controls, eventStream }: { left: ReactNode; center: ReactNode; right: ReactNode; controls: ReactNode; eventStream: ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-aurum">Aurum Capital</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 md:text-4xl">BFSI onboarding orchestration demo</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">Premium mobile onboarding on the left, Meiro-style customer intelligence in the middle, and consent-aware activation decisions on the right.</p>
          </div>
          <div className="w-full xl:max-w-3xl">{controls}</div>
        </header>
        <div className="grid min-h-[780px] grid-cols-1 gap-4 xl:grid-cols-[430px_minmax(360px,1fr)_minmax(360px,1fr)]">
          <div className="flex flex-col gap-4">
            {left}
            {eventStream}
          </div>
          {center}
          {right}
        </div>
      </div>
    </main>
  );
}
