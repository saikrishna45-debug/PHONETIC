interface MatchIndicatorProps {
  label: string;
  value: number;
}

export function MatchIndicator({ label, value }: MatchIndicatorProps) {
  const percentage = Math.max(0, Math.min(100, value * 10));
  return (
    <div className="grid grid-cols-[6.25rem_1fr_2.25rem] items-center gap-2 text-xs">
      <span className="text-slate-600">{label}</span>
      <div role="progressbar" aria-label={`${label} capability`} aria-valuemin={0} aria-valuemax={10} aria-valuenow={value} className="h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className="h-full rounded-full bg-emerald-600" style={{ width: `${percentage}%` }} />
      </div>
      <span className="text-right font-medium tabular-nums text-slate-600">{value}/10</span>
    </div>
  );
}
