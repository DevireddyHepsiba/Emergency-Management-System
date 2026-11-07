import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import * as api from "@/services/api";

export function MyReports() {
  const [reports, setReports] = useState<api.EmergencyReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    try { setError(null); setReports(await api.getUserEmergencies(localStorage.getItem("userId") || "")); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not load your reports"); }
    finally { setLoading(false); }
  }

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => window.clearInterval(timer);
  }, []);

  return <div className="space-y-5">
    <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">My emergency reports</h1><p className="mt-1 text-gray-600">A report being received does not mean a team has been dispatched.</p></div><Button variant="outline" onClick={() => void refresh()}>Refresh</Button></div>
    {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
    {loading ? <Card className="p-6 text-center">Loading your reports…</Card> : reports.length === 0 ? <Card className="p-6 text-center text-gray-600">You have not submitted a report while signed in.</Card> : reports.map((report) => <Card key={report.id} className="p-5">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-xs text-gray-500">Tracking ID: {report.id}</p><h2 className="mt-1 text-lg font-semibold">{report.emergencyType} · {report.priority || "Awaiting triage"}</h2><p className="mt-1 text-sm text-gray-600">{report.description || "No description provided"}</p><p className="mt-2 text-sm text-gray-500">{report.createdAt ? new Date(report.createdAt).toLocaleString() : "Time unavailable"} · {report.latitude}, {report.longitude}</p></div><span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">{report.status || "REPORTED"}</span></div>
      {!!report.statusHistory?.length && <div className="mt-4 border-t pt-3"><p className="mb-2 text-sm font-medium">Updates</p><ol className="space-y-2">{report.statusHistory.map((entry, index) => <li key={`${entry.status}-${entry.changedAt}-${index}`} className="text-sm"><span className="font-medium">{entry.status.replaceAll("_", " ")}</span><span className="text-gray-500"> · {new Date(entry.changedAt).toLocaleString()}</span>{entry.note && <span className="block text-gray-600">{entry.note}</span>}</li>)}</ol></div>}
    </Card>)}
  </div>;
}
