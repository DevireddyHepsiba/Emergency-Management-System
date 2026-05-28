import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Panel, SeverityBadge, Sparkline, StatCard } from "@/components/dashboard/primitives";

const users = [
  { name: "Cmdr. R. Vasquez", role: "Admin", status: "Online", tone: "resolved" as const },
  { name: "Dr. M. Khan", role: "Hospital", status: "Online", tone: "resolved" as const },
  { name: "Unit-7 Lead", role: "Rescue", status: "Mission", tone: "warning" as const },
  { name: "NGO-Aid Alliance", role: "NGO", status: "Online", tone: "resolved" as const },
  { name: "Field-22", role: "Volunteer", status: "Idle", tone: "tracking" as const },
];

const services = [
  { name: "kafka-broker-01", uptime: "99.99%", tone: "resolved" as const },
  { name: "kafka-broker-02", uptime: "99.97%", tone: "resolved" as const },
  { name: "sos-ingest-svc", uptime: "99.95%", tone: "resolved" as const },
  { name: "ai-triage-gw", uptime: "98.20%", tone: "warning" as const },
  { name: "geo-router", uptime: "99.99%", tone: "resolved" as const },
  { name: "notify-broadcast", uptime: "94.10%", tone: "critical" as const },
];

export function AdminPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
            // System Control
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">Super Admin Console</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Total Users" value="14,820" />
          <StatCard label="Kafka Throughput" value="1.2k/s" tone="tracking" />
          <StatCard label="API p95" value="84ms" tone="resolved" />
          <StatCard label="Active Alerts" value="3" tone="critical" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Panel title="Service Health" className="col-span-12 lg:col-span-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {services.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center justify-between p-3 bg-navy-950 border border-white/5 rounded font-mono"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`size-1.5 rounded-full ${
                        s.tone === "resolved"
                          ? "bg-resolved"
                          : s.tone === "warning"
                            ? "bg-warning"
                            : "bg-critical"
                      } animate-pulse-critical`}
                    />
                    <span className="text-xs">{s.name}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{s.uptime}</span>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Event Stream (1h)" className="col-span-12 lg:col-span-4">
            <Sparkline
              data={[400, 520, 480, 600, 720, 680, 820, 900, 1020, 1180, 1240, 1200]}
              tone="tracking"
            />
            <div className="mt-3 text-[10px] font-mono text-muted-foreground">
              Topics: sos.in · units.tracking · ai.predict · notify.broadcast
            </div>
          </Panel>
        </div>

        <Panel title="User & Role Management">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  <th className="text-left py-2 px-3">User</th>
                  <th className="text-left py-2 px-3">Role</th>
                  <th className="text-left py-2 px-3">Status</th>
                  <th className="text-right py-2 px-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.name} className="border-t border-white/5">
                    <td className="py-3 px-3 font-medium">{u.name}</td>
                    <td className="py-3 px-3 text-muted-foreground">{u.role}</td>
                    <td className="py-3 px-3">
                      <SeverityBadge tone={u.tone} label={u.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button className="text-[10px] font-mono uppercase text-tracking hover:underline">
                        Manage →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
