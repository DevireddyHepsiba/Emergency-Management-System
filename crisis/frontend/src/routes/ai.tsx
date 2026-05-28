import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Panel, Sparkline, StatCard } from "@/components/dashboard/primitives";
import { Brain, Languages, Sparkles, TrendingUp } from "lucide-react";

export function AIPage() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-1">
            // Neural Layer
          </div>
          <h1 className="text-3xl font-extrabold tracking-tighter">AI Intelligence</h1>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatCard label="Triage Accuracy" value="99.1%" tone="resolved" />
          <StatCard label="SOS Processed" value="48,210" tone="tracking" />
          <StatCard label="Duplicates Killed" value="9,820" tone="warning" />
          <StatCard label="Translations" value="32 lang" tone="tracking" />
        </div>

        <div className="grid grid-cols-12 gap-6">
          <Panel
            title="Severity Prediction · 6h horizon"
            className="col-span-12 lg:col-span-8"
            action={<span className="text-[10px] font-mono text-tracking">MODEL v4.2</span>}
          >
            <Sparkline
              data={[20, 28, 35, 32, 45, 52, 48, 60, 72, 85, 92, 88, 95, 110, 105]}
              tone="critical"
            />
            <div className="flex justify-between mt-3 text-[10px] font-mono text-muted-foreground">
              <span>NOW</span>
              <span>+1h</span>
              <span>+2h</span>
              <span>+3h</span>
              <span className="text-critical">PEAK +4h</span>
              <span>+5h</span>
              <span>+6h</span>
            </div>
          </Panel>

          <Panel title="Active Models" className="col-span-12 lg:col-span-4">
            <div className="space-y-3">
              {[
                { icon: Brain, name: "Urgency Triage", load: "82%", tone: "text-tracking" },
                { icon: TrendingUp, name: "Surge Forecast", load: "64%", tone: "text-warning" },
                { icon: Languages, name: "Multilingual NLP", load: "48%", tone: "text-resolved" },
                { icon: Sparkles, name: "Dedup Clustering", load: "91%", tone: "text-critical" },
              ].map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-3 p-3 bg-navy-950 border border-white/5 rounded"
                >
                  <m.icon className={`size-4 ${m.tone}`} />
                  <div className="flex-1">
                    <div className="text-sm font-bold">{m.name}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">
                      GPU load {m.load}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        <Panel title="AI Recommendations">
          <div className="space-y-3">
            {[
              {
                tone: "critical",
                title: "Reroute Convoy Alpha",
                body: "Predicted bridge failure in Sector G-9 within 18 min. Suggest east bypass via Route 7.",
              },
              {
                tone: "warning",
                title: "Pre-position Aid Trucks",
                body: "Demand model flags Northridge shelter — capacity will exceed 95% in 2 hours.",
              },
              {
                tone: "tracking",
                title: "Translation Batch Ready",
                body: "47 SOS reports auto-translated from Tagalog → English for Operator desk.",
              },
            ].map((r) => {
              const tones = {
                critical: "border-critical/30 text-critical",
                warning: "border-warning/30 text-warning",
                tracking: "border-tracking/30 text-tracking",
              } as const;
              const cls = tones[r.tone as keyof typeof tones];
              return (
                <div
                  key={r.title}
                  className={`p-4 bg-navy-950 border rounded-md ${cls.split(" ")[0]}`}
                >
                  <div
                    className={`text-[10px] font-mono uppercase tracking-widest font-bold mb-1 ${cls.split(" ")[1]}`}
                  >
                    AI · {r.tone}
                  </div>
                  <div className="text-sm font-bold mb-1">{r.title}</div>
                  <p className="text-xs text-muted-foreground">{r.body}</p>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </DashboardLayout>
  );
}
