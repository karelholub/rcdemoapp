export function AudienceBadges({ audiences }: { audiences: string[] }) {
  if (!audiences.length) return <p className="text-sm text-slate-400">Audiences will appear as behavior is tracked.</p>;
  return (
    <div className="flex flex-wrap gap-2">
      {audiences.map((audience) => (
        <span key={audience} className="rounded-full border border-aurum/30 bg-aurum/10 px-3 py-1 text-xs font-medium text-aurum">
          {audience}
        </span>
      ))}
    </div>
  );
}
