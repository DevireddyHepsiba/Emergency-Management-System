import { DashboardLayout } from "@/components/layout/dashboard-layout";
import {
  BarChart,
  Panel,
  ProgressBar,
  SeverityBadge,
  StatCard,
} from "@/components/dashboard/primitives";

const incoming = [
  { id: "P-4012", type: "Trauma — Crush Injury", eta: "2 min", tone: "critical" as const },
  { id: "P-4011", type: "Respiratory", eta: "4 min", tone: "warning" as const },
  { id: "P-4010", type: "Pediatric Burn", eta: "6 min", tone: "critical" as const },
  { id: "P-4009", type: "Cardiac Arrest", eta: "8 min", tone: "critical" as const },
  { id: "P-4008", type: "Fracture", eta: "12 min", tone: "warning" as const },
];

export function HospitalPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
            // Medical Capacity
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Hospital Operations</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Available Beds" value="1,042" tone="tracking" />
          <StatCard label="ICU Free" value="38" delta="of 120" tone="warning" />
          <StatCard label="Incoming" value="12" delta="next 15m" tone="critical" />
          <StatCard label="Surgery Cap." value="68%" tone="warning" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <Panel title="Department Occupancy">
              <div className="space-y-3">
                {[
                  { name: "Emergency Room", cap: 92, tone: "critical" as const },
                  { name: "ICU", cap: 84, tone: "warning" as const },
                  { name: "Trauma Bay", cap: 76, tone: "warning" as const },
                  { name: "Surgery", cap: 68, tone: "warning" as const },
                  { name: "General Ward", cap: 54, tone: "tracking" as const },
                  { name: "Pediatrics", cap: 32, tone: "resolved" as const },
                ].map((h) => (
                  <div key={h.name} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{h.name}</span>
                      <span className="font-mono text-muted-foreground">{h.cap}%</span>
                    </div>
                    <ProgressBar value={h.cap} tone={h.tone} />
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Patient Queue (last 24h)">
              <BarChart
                tone="tracking"
                data={[
                  { label: "Trauma", value: 84 },
                  { label: "Resp", value: 52 },
                  { label: "Cardiac", value: 38 },
                  { label: "Burn", value: 22 },
                  { label: "Other", value: 64 },
                ]}
              />
            </Panel>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <Panel
              title="Incoming Patients"
              action={<span className="text-[10px] font-mono text-critical">LIVE</span>}
            >
              <div className="space-y-3">
                {incoming.map((p) => (
                  <div
                    key={p.id}
                    className="p-3 bg-navy-950 border border-white/5 rounded flex justify-between items-center"
                  >
                    <div>
                      <div className="text-[10px] font-mono text-muted-foreground">{p.id}</div>
                      <div className="text-sm font-bold">{p.type}</div>
                    </div>
                    <div className="text-right">
                      <SeverityBadge tone={p.tone} label={p.eta} />
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
