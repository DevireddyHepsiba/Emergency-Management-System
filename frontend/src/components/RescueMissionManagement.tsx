import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as api from "@/services/api";

const nextStatus: Record<string, string> = { ACCEPTED: "EN_ROUTE", EN_ROUTE: "REACHED", REACHED: "TRANSPORTING", TRANSPORTING: "ARRIVED", ARRIVED: "COMPLETED" };

export function RescueMissionManagement() {
  const [missions, setMissions] = useState<api.RescueMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const role = localStorage.getItem("userRole") || "CITIZEN";

  useEffect(() => { void fetchMissions(); }, []);

  async function fetchMissions() {
    try {
      setLoading(true);
      setError(null);
      setMissions(await api.getActiveMissions());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load rescue missions");
    } finally {
      setLoading(false);
    }
  }

  async function moveMission(missionId: string, status: string) {
    try {
      setError(null);
      await api.updateRescueMissionStatus(missionId, status);
      await fetchMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update mission");
    }
  }

  async function respond(missionId: string, side: "team" | "hospital", accepted: boolean) {
    try { setError(null); await api.recordMissionResponse(missionId, side, accepted); await fetchMissions(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not record acceptance"); }
  }

  async function changeEta(missionId: string) {
    const raw = window.prompt("ETA in minutes");
    if (raw === null) return;
    const eta = Number(raw);
    if (!Number.isFinite(eta) || eta < 0) { setError("Enter a valid ETA in minutes."); return; }
    try { await api.updateMissionETA(missionId, eta); await fetchMissions(); }
    catch (err) { setError(err instanceof Error ? err.message : "Could not update ETA"); }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><h1 className="text-3xl font-bold">Response offers and missions</h1><p className="mt-1 text-gray-600">Every mission links to a reporter incident. Acceptances are recorded before dispatch; status updates feed the reporter tracking history.</p></div><div className="flex gap-2"><Button variant="outline" onClick={() => void fetchMissions()} disabled={loading}>Refresh</Button></div></div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {loading ? <Card className="p-6 text-center">Loading missions…</Card> : missions.length === 0 ? <Card className="p-6 text-center text-gray-500">No active missions.</Card> : <div className="space-y-4">{missions.map((mission) => <Card key={mission.id} className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{mission.missionCode || `Mission ${mission.id?.slice(0, 8)}`}: {mission.title}</h2>{mission.location && <p className="mt-1 text-sm text-gray-600">📍 {mission.location}</p>}{mission.description && <p className="mt-2 text-gray-600">{mission.description}</p>}</div><span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-semibold text-orange-800">{mission.status}</span></div>
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600"><span>Incident: {mission.emergencyId}</span><span>Priority: {mission.priority || "—"}</span><span>Type: {mission.missionType || "—"}</span><span>Ambulance: {mission.assignedVehicle || mission.assignedTeam || "None"}</span><span>Hospital: {mission.hospitalId || "Not required"}</span><span>ETA: {mission.eta == null ? "—" : `${mission.eta} min`}</span><span>Distance: {mission.distance == null ? "—" : `${mission.distance} km`}</span></div>
        {mission.status === "OFFERED" && <p className="mt-3 text-sm">Ambulance/team: {mission.teamAccepted ? "Accepted" : "Awaiting response"} · Hospital: {mission.hospitalAccepted ? "Accepted" : "Awaiting response"}</p>}
        <div className="mt-4 flex flex-wrap gap-2">{mission.id && mission.status === "OFFERED" && role === "RESCUE_TEAM" && mission.ambulanceId && <><Button size="sm" onClick={() => void respond(mission.id!, "team", true)}>Record team acceptance</Button><Button size="sm" variant="outline" onClick={() => void respond(mission.id!, "team", false)}>Record team decline</Button></>}{mission.id && mission.status === "OFFERED" && role === "HOSPITAL" && mission.hospitalId && <><Button size="sm" onClick={() => void respond(mission.id!, "hospital", true)}>Record hospital acceptance</Button><Button size="sm" variant="outline" onClick={() => void respond(mission.id!, "hospital", false)}>Record hospital decline</Button></>}{mission.id && nextStatus[mission.status || ""] && role === "RESCUE_TEAM" && <Button size="sm" onClick={() => void moveMission(mission.id!, nextStatus[mission.status || ""])}>{nextStatus[mission.status || ""].replaceAll("_", " ")}</Button>}{mission.id && nextStatus[mission.status || ""] && role === "RESCUE_TEAM" && <Button size="sm" variant="outline" onClick={() => void changeEta(mission.id!)}>Update ETA</Button>}</div>
      </Card>)}</div>}
    </div>
  );
}
