export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/70">
      <div className="h-full rounded-full bg-gradient-to-r from-[#34127a] via-[#10b8aa] to-[#75d7f0] transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
