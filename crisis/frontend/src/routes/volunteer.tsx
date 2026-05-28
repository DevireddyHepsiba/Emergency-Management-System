import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Panel, SeverityBadge, StatCard } from "@/components/dashboard/primitives";
import { MapPin, Package } from "lucide-react";

const zones = [
  {
    name: "Coastal District",
    distance: "2.3 km",
    need: "Water · Blankets",
    tone: "critical" as const,
  },
  {
    name: "Northridge Shelter",
    distance: "5.8 km",
    need: "Food · Medical",
    tone: "warning" as const,
  },
  { name: "Sector G-9 Relief", distance: "8.1 km", need: "Volunteers", tone: "warning" as const },
  { name: "Riverside Camp", distance: "12.0 km", need: "Hygiene Kits", tone: "tracking" as const },
];

const donations = [
  { item: "Drinking Water (5L)", filled: 1240, target: 2000 },
  { item: "Blankets", filled: 480, target: 800 },
  { item: "Medical Kits", filled: 92, target: 150 },
  { item: "Ready-to-eat Meals", filled: 3200, target: 5000 },
];

export function VolunteerPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
            // Community Response
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Volunteer & NGO Hub</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Active Volunteers" value="2,840" tone="tracking" />
          <StatCard label="Open Assignments" value="184" tone="warning" />
          <StatCard label="Donations (24h)" value="$48k" tone="resolved" />
          <StatCard label="Supply Trucks" value="42" tone="tracking" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Panel title="Nearby Disaster Zones" className="col-span-12 lg:col-span-7">
            <div className="space-y-2">
              {zones.map((z) => (
                <div
                  key={z.name}
                  className="p-4 bg-navy-950 border border-white/5 rounded flex items-center justify-between hover:border-tracking/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <MapPin className="size-4 text-tracking mt-0.5" />
                    <div>
                      <div className="font-bold text-sm">{z.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {z.distance} · Needs: {z.need}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <SeverityBadge tone={z.tone} label="Volunteer" />
                    <button className="text-[10px] font-mono uppercase text-tracking hover:underline">
                      Assign →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Donation Pipeline" className="col-span-12 lg:col-span-5">
            <div className="space-y-4">
              {donations.map((d) => {
                const pct = Math.round((d.filled / d.target) * 100);
                return (
                  <div key={d.item}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="flex items-center gap-2">
                        <Package className="size-3.5 text-muted-foreground" />
                        {d.item}
                      </span>
                      <span className="font-mono text-muted-foreground">
                        {d.filled}/{d.target}
                      </span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-resolved" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
              <button className="w-full mt-2 px-4 py-3 bg-tracking text-white text-xs font-bold uppercase tracking-widest rounded hover:brightness-110">
                Open Donation Portal
              </button>
            </div>
          </Panel>
        </div>
      </div>
    </DashboardLayout>
  );
}
