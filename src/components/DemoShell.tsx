import type { ReactNode } from 'react';

export function DemoShell({ left, center, right, controls, eventStream }: { left: ReactNode; center: ReactNode; right: ReactNode; controls: ReactNode; eventStream: ReactNode }) {
  return (
    <main className="min-h-screen px-4 py-5 lg:px-6">
      <div className="mx-auto flex max-w-[1800px] flex-col gap-4">
        <header className="grid gap-4 xl:grid-cols-[430px_minmax(0,1fr)] xl:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-aurum">Meiro CDP demo</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-50 md:text-4xl">Aurum Capital onboarding</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">A live view of a customer application, the profile Meiro builds from it, and the channels allowed to act.</p>
          </div>
          <div className="w-full">{controls}</div>
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
