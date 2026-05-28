import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Panel, SeverityBadge, StatCard } from "@/components/dashboard/primitives";
import { Navigation, Route as RouteIcon, Timer } from "lucide-react";

const missions = [
  {
    id: "M-8291",
    title: "Flash Flood Extraction",
    loc: "Sector G-9 · Bridge St",
    status: "En Route",
    tone: "warning" as const,
    eta: "4 min",
    victims: 12,
  },
  {
    id: "M-8290",
    title: "Building Collapse Search",
    loc: "Sector B-2 · 14th Ave",
    status: "Assigned",
    tone: "critical" as const,
    eta: "9 min",
    victims: 5,
  },
  {
    id: "M-8278",
    title: "Wildfire Perimeter",
    loc: "North Ridge · Sector R-4",
    status: "Reached",
    tone: "tracking" as const,
    eta: "—",
    victims: 0,
  },
  {
    id: "M-8265",
    title: "Evacuation Convoy",
    loc: "Coastal District",
    status: "Completed",
    tone: "resolved" as const,
    eta: "—",
    victims: 240,
  },
];

export function RescuePage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
            // Field Operations
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Rescue Missions</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Active Missions" value="42" tone="critical" />
          <StatCard label="Avg ETA" value="6.4m" tone="warning" />
          <StatCard label="Completed Today" value="128" tone="resolved" />
          <StatCard label="Units Available" value="312" tone="tracking" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {missions.map((m) => (
            <div
              key={m.id}
              className="bg-navy-900 border border-white/5 rounded-lg p-5 hover:border-tracking/30 transition-all"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-mono text-muted-foreground">{m.id}</span>
                <SeverityBadge tone={m.tone} label={m.status} />
              </div>
              <h3 className="text-base font-bold mb-1">{m.title}</h3>
              <p className="text-xs text-muted-foreground mb-4">{m.loc}</p>
              <div className="flex justify-between text-[11px] font-mono mb-4 pt-3 border-t border-white/5">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <Timer className="size-3" /> ETA {m.eta}
                </span>
                <span className="text-muted-foreground">{m.victims} victims</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button className="px-3 py-2 bg-tracking/10 text-tracking text-[10px] font-bold uppercase tracking-widest rounded inline-flex items-center justify-center gap-1.5">
                  <Navigation className="size-3" /> Route
                </button>
                <button className="px-3 py-2 bg-white/5 text-foreground text-[10px] font-bold uppercase tracking-widest rounded">
                  Update
                </button>
              </div>
            </div>
          ))}
        </div>

        <Panel title="Optimized Route — Mission M-8291">
          <div className="relative aspect-[21/9] bg-navy-950 rounded-md overflow-hidden border border-white/5 grid-bg">
            <svg viewBox="0 0 800 350" className="absolute inset-0 w-full h-full">
              <path
                d="M 50 300 L 200 220 L 320 240 L 450 150 L 600 180 L 750 80"
                fill="none"
                stroke="oklch(0.7 0.16 245)"
                strokeWidth="3"
                strokeDasharray="6 4"
              />
              <circle cx="50" cy="300" r="6" fill="oklch(0.72 0.17 155)" />
              <circle cx="750" cy="80" r="8" fill="oklch(0.645 0.22 25)">
                <animate attributeName="r" from="8" to="14" dur="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
            <div className="absolute bottom-4 left-4 text-[10px] font-mono uppercase text-muted-foreground">
              ETA · 4 min · Distance · 2.1 km · Traffic-aware routing engaged
            </div>
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
