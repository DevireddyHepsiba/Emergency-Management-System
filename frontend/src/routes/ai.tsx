import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Panel } from "@/components/dashboard/primitives";
import * as api from "@/services/api";

type Metrics = {
  triageAccuracy?: number;
  sosProcessed?: number;
  duplicatesKilled?: number;
};

export function AIPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getAIMetrics()
      .then((data) => setMetrics(data && Object.keys(data).length ? data : null))
      .catch((reason: unknown) => setError(reason instanceof Error ? reason.message : "Could not load metrics"));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6 p-6">
        <div><p className="text-xs uppercase tracking-widest text-muted-foreground">Triage and reporting</p><h1 className="text-3xl font-bold">AI and analytics</h1></div>
        <Panel title="Current implementation">
          <p className="text-sm text-muted-foreground">Emergency priority and duplicate checks use basic rules. No external AI model, forecasting service, or translation service is connected.</p>
        </Panel>
        <Panel title="Recorded metrics">
          {error ? <p className="text-sm text-red-600">{error}</p> : !metrics ? <p className="text-sm text-muted-foreground">No AI metrics have been recorded yet.</p> : <div className="grid gap-4 sm:grid-cols-3">
            <div><p className="text-xs text-muted-foreground">Triage accuracy</p><p className="text-2xl font-semibold">{metrics.triageAccuracy == null ? "—" : `${metrics.triageAccuracy}%`}</p></div>
            <div><p className="text-xs text-muted-foreground">SOS processed</p><p className="text-2xl font-semibold">{metrics.sosProcessed?.toLocaleString() ?? "—"}</p></div>
            <div><p className="text-xs text-muted-foreground">Duplicates detected</p><p className="text-2xl font-semibold">{metrics.duplicatesKilled?.toLocaleString() ?? "—"}</p></div>
          </div>}
        </Panel>
      </div>
    </DashboardLayout>
  );
}
