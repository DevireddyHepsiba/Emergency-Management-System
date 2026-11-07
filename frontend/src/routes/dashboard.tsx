import { Button } from "@/components/ui/button";
import {
  BarChart,
  Panel,
  ProgressBar,
  SeverityBadge,
  Sparkline,
  StatCard,
} from "@/components/dashboard/primitives";
import { PackageIcon, PlusIcon, ShieldCheckIcon, SirenIcon } from "lucide-react";

const responseTrend = [42, 38, 51, 45, 60, 55, 72, 68, 80, 75, 88, 92];
const sosTrend = [120, 135, 128, 142, 150, 148, 162, 175, 168, 180, 195, 210];

export function DashboardPage() {
  return (
    <div className="min-h-screen">
      <div className="p-6 space-y-6">
        <div className="flex flex-wrap justify-between items-end gap-4">
          <div>
            <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
              // Real-time Monitoring
            </div>
            <h1 className="text-3xl font-extrabold tracking-tighter">Command Overview</h1>
          </div>
          <div className="text-[10px] font-mono text-muted-foreground uppercase">
            Last sync: 00:00:04 ago · 1,284 active streams
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button variant="outline" className="h-12 justify-start gap-3">
            <SirenIcon className="size-5" />
            <div className="text-left">
              <p className="font-semibold">New Alert</p>
              <p className="text-xs text-muted-foreground">Broadcast a new incident</p>
            </div>
          </Button>
          <Button variant="outline" className="h-12 justify-start gap-3">
            <PlusIcon className="size-5" />
            <div className="text-left">
              <p className="font-semibold">Dispatch Unit</p>
              <p className="text-xs text-muted-foreground">Send team to location</p>
            </div>
          </Button>
          <Button variant="outline" className="h-12 justify-start gap-3">
            <ShieldCheckIcon className="size-5" />
            <div className="text-left">
              <p className="font-semibold">Register Evacuee</p>
              <p className="text-xs text-muted-foreground">Add person to shelter</p>
            </div>
          </Button>
          <Button variant="outline" className="h-12 justify-start gap-3">
            <PackageIcon className="size-5" />
            <div className="text-left">
              <p className="font-semibold">Supply Request</p>
              <p className="text-xs text-muted-foreground">Request new resources</p>
            </div>
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <StatCard label="Active Emergencies" value="142" delta="+12 (1h)" tone="critical" />
          <StatCard label="Teams Deployed" value="891" delta="of 1,284" />
          <StatCard label="Ambulances" value="64" delta="of 78 avail" tone="tracking" />
          <StatCard label="Hospital Cap." value="84%" delta="warning" tone="warning" />
          <StatCard label="Shelter Cap." value="62%" delta="14 sites" tone="resolved" />
          <StatCard label="Risk Zones" value="9" delta="High prio" tone="critical" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Panel
              title="Live Tactical Map"
              action={
                <div className="flex items-center gap-3 text-[10px] font-mono">
                  <span className="flex items-center gap-1.5 text-critical">
                    <span className="size-1.5 rounded-full bg-critical" /> Hazard
                  </span>
                  <span className="flex items-center gap-1.5 text-warning">
                    <span className="size-1.5 rounded-full bg-warning" /> Warning
                  </span>
                  <span className="flex items-center gap-1.5 text-tracking">
                    <span className="size-1.5 rounded-full bg-tracking" /> Units
                  </span>
                  <span className="flex items-center gap-1.5 text-resolved">
                    <span className="size-1.5 rounded-full bg-resolved" /> Cleared
                  </span>
                </div>
              }
            >
              <div className="relative aspect-video bg-navy-950 rounded-md overflow-hidden border border-white/5">
                <div className="absolute inset-0 grid-bg opacity-50" />
                <div className="absolute top-0 left-0 w-full h-0.5 bg-tracking/30 animate-scanline" />
                <TacticalSvg />
              </div>
            </Panel>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Panel title="Emergency Trends (24h)">
                <Sparkline data={sosTrend} tone="critical" />
                <div className="flex justify-between mt-3 text-[10px] font-mono text-muted-foreground">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>NOW</span>
                </div>
              </Panel>
              <Panel title="Response Time (min)">
                <Sparkline data={responseTrend} tone="tracking" />
                <div className="flex justify-between mt-3 text-[10px] font-mono text-muted-foreground">
                  <span>Target 5m</span>
                  <span className="text-resolved">Current 4.2m</span>
                </div>
              </Panel>
            </div>

            <Panel title="Resource Allocation">
              <BarChart
                tone="tracking"
                data={[
                  { label: "Ground", value: 84 },
                  { label: "Aerial", value: 12 },
                  { label: "Medical", value: 64 },
                  { label: "Shelter", value: 38 },
                  { label: "Food", value: 72 },
                ]}
              />
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <Panel
              title="Intelligence Feed"
              action={
                <span className="px-2 py-0.5 rounded-sm bg-critical/20 text-critical text-[10px] font-bold">
                  LIVE
                </span>
              }
            >
              <div className="space-y-5">
                <FeedItem
                  tone="critical"
                  time="14:22:04 // SOS"
                  title="Flash Flood · Sector G-9"
                  body="12 victims identified via thermal scan."
                />
                <FeedItem
                  tone="warning"
                  time="14:18:12 // OPS"
                  title="St. Jude Medical · 95% Cap"
                  body="Rerouting incoming to Northridge."
                />
                <FeedItem
                  tone="tracking"
                  time="14:10:45 // DEPLOY"
                  title="Air Rescue Alpha"
                  body="3 rotary assets en route, LZ secured."
                />
                <FeedItem
                  tone="resolved"
                  time="13:54:00 // CLEAR"
                  title="Structure Fire Extinguished"
                  body="Unit-7 reports zero casualties."
                />
              </div>
            </Panel>

            <div className="bg-tracking/10 border border-tracking/20 rounded-lg p-5">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-tracking/20 rounded text-tracking">
                  <div className="size-3.5 border-2 border-current rounded-full border-t-transparent animate-spin" />
                </div>
                <div>
                  <div className="text-[10px] font-mono uppercase tracking-widest text-tracking font-bold mb-1">
                    AI Recommendation
                  </div>
                  <p className="text-xs text-foreground leading-snug mb-2">
                    Dispatch reserve unit to Sub-Sector Delta — surge model predicts 78% probability
                    of secondary flooding within 45 minutes.
                  </p>
                  <button className="text-[10px] font-mono uppercase tracking-widest text-tracking hover:underline">
                    Acknowledge & Dispatch →
                  </button>
                </div>
              </div>
            </div>

            <Panel title="Hospital Occupancy">
              <div className="space-y-3">
                {[
                  { name: "St. Jude Medical", cap: 95, tone: "critical" as const },
                  { name: "Northridge General", cap: 78, tone: "warning" as const },
                  { name: "Coastal Trauma", cap: 62, tone: "tracking" as const },
                  { name: "Riverside Clinic", cap: 41, tone: "resolved" as const },
                ].map((h) => (
                  <div key={h.name} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>{h.name}</span>
                      <span className="font-mono text-muted-foreground">{h.cap}%</span>
                    </div>
                    <ProgressBar value={h.cap} tone={h.tone} />
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedItem({
  tone,
  time,
  title,
  body,
}: {
  tone: "critical" | "warning" | "resolved" | "tracking";
  time: string;
  title: string;
  body: string;
}) {
  const tones = {
    critical: { dot: "bg-critical", border: "border-critical/30" },
    warning: { dot: "bg-warning", border: "border-white/10" },
    resolved: { dot: "bg-resolved", border: "border-white/10" },
    tracking: { dot: "bg-tracking", border: "border-white/10" },
  } as const;
  const t = tones[tone];
  return (
    <div className={`relative pl-5 border-l ${t.border}`}>
      <div className={`absolute left-[-4.5px] top-1 size-2 rounded-full ${t.dot}`} />
      <div className="text-[10px] font-mono text-muted-foreground mb-0.5">{time}</div>
      <div className="text-sm font-bold mb-0.5">{title}</div>
      <p className="text-xs text-muted-foreground leading-snug">{body}</p>
    </div>
  );
}

function TacticalSvg() {
  return (
    <svg viewBox="0 0 800 450" className="absolute inset-0 w-full h-full">
      <defs>
        <radialGradient id="critGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.645 0.22 25)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="oklch(0.645 0.22 25)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="warnGlow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {[0.15, 0.3, 0.45, 0.6, 0.75].map((r) => (
        <circle
          key={r}
          cx="400"
          cy="225"
          r={r * 220}
          fill="none"
          stroke="oklch(0.7 0.16 245)"
          strokeOpacity="0.08"
        />
      ))}
      <circle cx="240" cy="160" r="100" fill="url(#critGlow2)" />
      <circle cx="560" cy="300" r="80" fill="url(#warnGlow2)" />
      <circle cx="620" cy="120" r="60" fill="url(#warnGlow2)" />
      <path
        d="M 80 380 Q 250 280 400 225 T 720 140"
        fill="none"
        stroke="oklch(0.7 0.16 245)"
        strokeOpacity="0.5"
        strokeWidth="1.5"
        strokeDasharray="4 4"
      />
      {[
        { x: 250, y: 165, t: "critical" },
        { x: 565, y: 305, t: "warning" },
        { x: 615, y: 125, t: "warning" },
        { x: 400, y: 225, t: "tracking" },
        { x: 150, y: 350, t: "resolved" },
        { x: 700, y: 180, t: "tracking" },
      ].map((p, i) => {
        const c = {
          critical: "oklch(0.645 0.22 25)",
          warning: "oklch(0.78 0.16 75)",
          resolved: "oklch(0.72 0.17 155)",
          tracking: "oklch(0.7 0.16 245)",
        }[p.t as "critical"];
        return (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill={c} />
            <circle cx={p.x} cy={p.y} r="4" fill="none" stroke={c} strokeOpacity="0.6">
              <animate attributeName="r" from="4" to="18" dur="2s" repeatCount="indefinite" />
              <animate
                attributeName="opacity"
                from="0.7"
                to="0"
                dur="2s"
                repeatCount="indefinite"
              />
            </circle>
          </g>
        );
      })}
    </svg>
  );
}
