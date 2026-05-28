import type { ReactNode } from "react";

type Tone = "critical" | "warning" | "resolved" | "tracking" | "muted";

const toneText: Record<Tone, string> = {
  critical: "text-critical",
  warning: "text-warning",
  resolved: "text-resolved",
  tracking: "text-tracking",
  muted: "text-muted-foreground",
};
const toneBg: Record<Tone, string> = {
  critical: "bg-critical",
  warning: "bg-warning",
  resolved: "bg-resolved",
  tracking: "bg-tracking",
  muted: "bg-muted",
};

export function Panel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-navy-900 border border-white/5 rounded-lg p-5 ${className}`}>
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {title}
          </h3>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  tone = "muted",
}: {
  label: string;
  value: string;
  delta?: string;
  tone?: Tone;
}) {
  return (
    <div className="bg-navy-900 border border-white/5 rounded-lg p-4">
      <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest mb-1">
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className={`text-2xl font-mono font-bold ${toneText[tone]}`}>{value}</span>
        {delta && <span className="text-[10px] font-mono text-muted-foreground">{delta}</span>}
      </div>
    </div>
  );
}

export function SeverityBadge({ tone, label }: { tone: Tone; label: string }) {
  return (
    <span
      className={`px-2 py-0.5 rounded-sm text-[10px] font-bold font-mono uppercase tracking-wider ${toneText[tone]} ${toneBg[tone].replace("bg-", "bg-")}/15 border border-current/20`}
    >
      {label}
    </span>
  );
}

export function ProgressBar({ value, tone = "tracking" }: { value: number; tone?: Tone }) {
  return (
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
      <div className={`h-full ${toneBg[tone]}`} style={{ width: `${value}%` }} />
    </div>
  );
}

export function Sparkline({ data, tone = "tracking" }: { data: number[]; tone?: Tone }) {
  const w = 200;
  const h = 50;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data
    .map((d, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((d - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  const stroke = {
    critical: "oklch(0.645 0.22 25)",
    warning: "oklch(0.78 0.16 75)",
    resolved: "oklch(0.72 0.17 155)",
    tracking: "oklch(0.7 0.16 245)",
    muted: "oklch(0.68 0.025 256)",
  }[tone];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-12">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" />
      <polyline points={`0,${h} ${points} ${w},${h}`} fill={stroke} opacity="0.1" />
    </svg>
  );
}

export function BarChart({
  data,
  tone = "tracking",
}: {
  data: { label: string; value: number }[];
  tone?: Tone;
}) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-[10px] font-mono text-muted-foreground w-16 truncate uppercase">
            {d.label}
          </span>
          <div className="flex-1 h-2 bg-white/5 rounded-sm overflow-hidden">
            <div
              className={toneBg[tone]}
              style={{ width: `${(d.value / max) * 100}%`, height: "100%" }}
            />
          </div>
          <span className="text-[10px] font-mono w-10 text-right">{d.value}</span>
        </div>
      ))}
    </div>
  );
}
