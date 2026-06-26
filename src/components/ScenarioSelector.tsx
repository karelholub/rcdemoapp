import type { ScenarioId } from '../lib/demoScenarios';

const scenarios: { id: ScenarioId; label: string }[] = [
  { id: 'early', label: 'Early abandonment' },
  { id: 'verification-failure', label: 'Verification failure' },
  { id: 'form', label: 'Form abandonment' },
  { id: 'review', label: 'Final review abandonment' },
  { id: 'completed', label: 'Completed application' },
];

export function ScenarioSelector({ active, onSelect }: { active: ScenarioId; onSelect: (id: ScenarioId) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {scenarios.map((scenario) => (
        <button
          key={scenario.id}
          onClick={() => onSelect(scenario.id)}
          className={`rounded-full border px-3 py-2 text-xs font-semibold ${active === scenario.id ? 'border-aurum bg-aurum text-graphite' : 'border-white/10 bg-white/5 text-slate-200'}`}
        >
          {scenario.label}
        </button>
      ))}
    </div>
  );
}
