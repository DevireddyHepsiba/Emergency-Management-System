import { lazy, Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as api from "@/services/api";
const OperationsMap = lazy(() =>
  import("@/components/OperationsMap").then((module) => ({ default: module.OperationsMap })),
);

function Metric({ label, value, icon }: { label: string; value: number | string; icon: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-gray-600">{label}</p>
      <div className="mt-2 flex items-center justify-between">
        <strong className="text-3xl">{value}</strong>
        <span className="text-2xl" aria-hidden="true">
          {icon}
        </span>
      </div>
    </Card>
  );
}

export function AdminDashboard() {
  const [stats, setStats] = useState<api.AdminStats | null>(null);
  const [reports, setReports] = useState<api.EmergencyReport[]>([]);
  const [users, setUsers] = useState<api.AdminUser[]>([]);
  const [hospitals, setHospitals] = useState<api.Hospital[]>([]);
  const [recommendations, setRecommendations] = useState<
    Record<string, api.DispatchRecommendations>
  >({});
  const [selectedHospital, setSelectedHospital] = useState<Record<string, string>>({});
  const [selectedAmbulance, setSelectedAmbulance] = useState<Record<string, string>>({});
  const [triage, setTriage] = useState<Record<string, api.TriageRequest>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const role = localStorage.getItem("userRole") || "CITIZEN";
  const canSeeMetrics = role === "ADMIN";
  const canReviewReports = role === "DISPATCHER";
  const canAccessOperationsMap = ["ADMIN", "DISPATCHER", "RESCUE_TEAM", "HOSPITAL"].includes(role);
  const canUpdateReports = role === "DISPATCHER";

  const refresh = useCallback(async () => {
    try {
      setError(null);
      if (canSeeMetrics) {
        const [dashboardStats, accountList, hospitalList] = await Promise.all([
          api.getAdminStats(),
          api.getAdminUsers(),
          api.getAllHospitals(),
        ]);
        setStats(dashboardStats);
        setUsers(accountList);
        setHospitals(hospitalList);
      }
      if (canReviewReports) setReports(await api.getAllEmergencies());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load response data");
    } finally {
      setLoading(false);
    }
  }, [canReviewReports, canSeeMetrics]);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  function defaultTriage(report: api.EmergencyReport): api.TriageRequest {
    return (
      triage[report.id!] || {
        priority: report.priority || "HIGH",
        requiredServices: [],
        requiredBedType: "GENERAL",
        needsAmbulance: true,
        ambulanceCapability: "BASIC",
        notes: "",
      }
    );
  }

  async function saveTriage(report: api.EmergencyReport) {
    try {
      setError(null);
      await api.triageEmergency(report.id!, defaultTriage(report));
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save triage");
    }
  }

  async function loadRecommendations(id: string) {
    try {
      const result = await api.getDispatchRecommendations(id);
      setRecommendations((current) => ({ ...current, [id]: result }));
      if (result.hospitals[0]?.id)
        setSelectedHospital((current) => ({ ...current, [id]: result.hospitals[0].id! }));
      if (result.ambulances[0]?.id)
        setSelectedAmbulance((current) => ({ ...current, [id]: result.ambulances[0].id }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load resource recommendations");
    }
  }

  async function createDispatch(id: string, report: api.EmergencyReport) {
    try {
      setError(null);
      const request: api.CreateDispatchRequest = { emergencyId: id };
      if (report.requiredBedType !== "NONE") request.hospitalId = selectedHospital[id];
      if (report.needsAmbulance) request.ambulanceId = selectedAmbulance[id];
      await api.createRescueMission(request);
      setRecommendations((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create response offer");
    }
  }

  async function assignHospital(userId: string, hospitalId: string) {
    try {
      setError(null);
      const updated = await api.assignHospitalToUser(userId, hospitalId);
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign hospital account");
    }
  }

  async function changeUserRole(userId: string, role: string) {
    try {
      setError(null);
      const updated = await api.updateUserRole(userId, role);
      setUsers((current) => current.map((user) => (user.id === userId ? updated : user)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not change account role");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium uppercase tracking-wide text-red-700">
            SentinelOS response desk
          </p>
          <h1 className="mt-1 text-3xl font-bold">
            {canSeeMetrics ? "Emergency overview" : "Welcome to Sentinelos"}
          </h1>
          <p className="mt-1 text-gray-600">
            {canSeeMetrics
              ? "Current counts come from the API and MongoDB records."
              : `Signed in as ${role.replaceAll("_", " ")}. Report an emergency or open the tools available to your role.`}
          </p>
        </div>
        <Button variant="outline" onClick={() => void refresh()} disabled={loading}>
          {loading ? "Loading…" : "Refresh"}
        </Button>
      </div>
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {canSeeMetrics && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric label="Open emergencies" value={stats?.activeEmergencies ?? "—"} icon="🚨" />
          <Metric
            label="Active rescue missions"
            value={stats?.activeRescueMissions ?? "—"}
            icon="🚑"
          />
          <Metric label="Volunteer accounts" value={stats?.totalVolunteers ?? "—"} icon="👥" />
          <Metric label="Available beds" value={stats?.availableBeds ?? "—"} icon="🛏️" />
          <Metric label="Hospitals" value={stats?.totalHospitals ?? "—"} icon="🏥" />
          <Metric label="Supply records" value={stats?.suppliesInStock ?? "—"} icon="📦" />
        </div>
      )}
      {canAccessOperationsMap && (
        <Suspense
          fallback={
            <div
              className="page-skeleton map-skeleton"
              role="status"
              aria-label="Loading operations map"
            >
              <span />
            </div>
          }
        >
          <OperationsMap />
        </Suspense>
      )}
      {canSeeMetrics && (
        <Card className="p-5">
          <div className="mb-4">
            <h2 className="text-xl font-bold">User access</h2>
            <p className="text-sm text-gray-600">
              Public sign-up is limited to citizens and volunteers. Assign operational roles here.
            </p>
          </div>
          {users.length === 0 ? (
            <p className="text-sm text-gray-500">No user accounts yet.</p>
          ) : (
            <div className="divide-y">
              {users.map((user) => (
                <div
                  key={user.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                  <Select
                    value={user.role}
                    onValueChange={(role) => void changeUserRole(user.id, role)}
                  >
                    <SelectTrigger className="w-52">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "ADMIN",
                        "DISPATCHER",
                        "RESCUE_TEAM",
                        "HOSPITAL",
                        "VOLUNTEER",
                        "NGO",
                        "CITIZEN",
                      ].map((role) => (
                        <SelectItem key={role} value={role}>
                          {role.replaceAll("_", " ")}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {user.role === "HOSPITAL" && (
                    <Select
                      value={user.hospitalId || "UNASSIGNED"}
                      onValueChange={(hospitalId) => void assignHospital(user.id, hospitalId)}
                    >
                      <SelectTrigger className="w-64">
                        <SelectValue placeholder="Link a hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNASSIGNED">No hospital linked</SelectItem>
                        {hospitals.map((hospital) => (
                          <SelectItem key={hospital.id} value={hospital.id!}>
                            {hospital.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
      {canReviewReports && (
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Incident dispatch desk</h2>
              <p className="text-sm text-gray-600">
                Review the report, triage its needs, then select capability-matched responders and
                hospitals. Creating an offer does not mean it was accepted or dispatched.
              </p>
            </div>
            <Button onClick={() => navigate("/report-emergency")}>Report an emergency</Button>
          </div>
          {loading ? (
            <p className="py-6 text-center text-gray-500">Loading reports…</p>
          ) : reports.length === 0 ? (
            <p className="py-6 text-center text-gray-500">No emergency reports yet.</p>
          ) : (
            <div className="divide-y">
              {reports.map((report) => {
                const draft = defaultTriage(report);
                const options = recommendations[report.id || ""];
                const hasHospital =
                  report.requiredBedType === "NONE" ||
                  (!!selectedHospital[report.id || ""] &&
                    !!options?.hospitals.some(
                      (hospital) => hospital.id === selectedHospital[report.id || ""],
                    ));
                const hasAmbulance =
                  !report.needsAmbulance ||
                  (!!selectedAmbulance[report.id || ""] &&
                    !!options?.ambulances.some(
                      (ambulance) => ambulance.id === selectedAmbulance[report.id || ""],
                    ));
                const canCreateOffer = hasHospital && hasAmbulance;
                const setDraft = (patch: Partial<api.TriageRequest>) =>
                  report.id &&
                  setTriage((current) => ({ ...current, [report.id!]: { ...draft, ...patch } }));
                return (
                  <div key={report.id} className="space-y-4 py-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-[220px] flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <strong>{report.emergencyType}</strong>
                          <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800">
                            {report.priority || "UNRATED"}
                          </span>
                          <span className="rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold">
                            {report.status || "REPORTED"}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-600">
                          {report.description || "No description provided"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {report.fullName} · {report.mobileNumber} ·{" "}
                          {report.createdAt
                            ? new Date(report.createdAt).toLocaleString()
                            : "Time unavailable"}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          Location: {report.latitude}, {report.longitude} · ID: {report.id}
                        </p>
                      </div>
                    </div>
                    {canUpdateReports && report.id && report.status === "REPORTED" && (
                      <div className="grid gap-4 rounded-xl border border-white/15 bg-slate-800 p-5 md:grid-cols-2">
                        <div className="md:col-span-2">
                          <h3 className="text-base font-semibold text-white">
                            Triage this incident
                          </h3>
                          <p className="mt-1 text-sm text-slate-300">
                            Choose the clinical priority and resources needed. These details help
                            find an appropriate hospital and ambulance.
                          </p>
                        </div>
                        <label className="text-sm font-medium text-slate-100">
                          Priority
                          <select
                            className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            value={draft.priority}
                            onChange={(e) =>
                              setDraft({
                                priority: e.target.value as api.TriageRequest["priority"],
                              })
                            }
                          >
                            {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-sm font-medium text-slate-100">
                          Required services{" "}
                          <span className="font-normal text-slate-300">(comma separated)</span>
                          <input
                            className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            placeholder="e.g. TRAUMA, SURGERY"
                            value={draft.requiredServices.join(", ")}
                            onChange={(e) =>
                              setDraft({
                                requiredServices: e.target.value
                                  .split(",")
                                  .map((x) => x.trim().toUpperCase())
                                  .filter(Boolean),
                              })
                            }
                          />
                        </label>
                        <label className="text-sm font-medium text-slate-100">
                          Bed type needed
                          <select
                            className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            value={draft.requiredBedType}
                            onChange={(e) =>
                              setDraft({
                                requiredBedType: e.target
                                  .value as api.TriageRequest["requiredBedType"],
                              })
                            }
                          >
                            {["GENERAL", "ICU", "CARDIAC", "NONE"].map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-sm font-medium text-slate-100">
                          Ambulance capability
                          <select
                            className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            value={
                              draft.needsAmbulance ? draft.ambulanceCapability || "BASIC" : "NONE"
                            }
                            onChange={(e) =>
                              setDraft({
                                needsAmbulance: e.target.value !== "NONE",
                                ambulanceCapability:
                                  e.target.value === "NONE" ? undefined : e.target.value,
                              })
                            }
                          >
                            {["NONE", "BASIC", "ADVANCED", "TRAUMA", "CARDIAC"].map((v) => (
                              <option key={v}>{v}</option>
                            ))}
                          </select>
                        </label>
                        <label className="text-sm font-medium text-slate-100 md:col-span-2">
                          Triage notes{" "}
                          <span className="font-normal text-slate-300">
                            (relevant details for responders)
                          </span>
                          <textarea
                            className="mt-1.5 min-h-24 w-full resize-y rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                            placeholder="Add concise notes about the reported needs"
                            value={draft.notes || ""}
                            onChange={(e) => setDraft({ notes: e.target.value })}
                          />
                        </label>
                        <Button
                          className="min-h-11 whitespace-normal text-center leading-5 md:col-span-2"
                          onClick={() => void saveTriage(report)}
                        >
                          Save triage &amp; find matching resources
                        </Button>
                      </div>
                    )}
                    {canUpdateReports && report.id && report.status === "TRIAGED" && (
                      <div className="space-y-4 rounded-xl border border-white/15 bg-slate-800 p-5">
                        <div>
                          <h3 className="text-base font-semibold text-white">
                            Match response resources
                          </h3>
                          <p className="mt-1 text-sm text-slate-300">
                            Review nearby hospitals and ambulances that fit the triage requirements.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            size="sm"
                            variant="outline"
                            className="min-h-10 border-slate-500 bg-slate-900 text-white hover:bg-slate-700 hover:text-white"
                            onClick={() => void loadRecommendations(report.id!)}
                          >
                            Find suitable hospitals and ambulances
                          </Button>
                          {options && (
                            <Button
                              size="sm"
                              className="min-h-10"
                              disabled={!canCreateOffer}
                              onClick={() => void createDispatch(report.id!, report)}
                            >
                              Create response offer
                            </Button>
                          )}
                        </div>
                        {options && (
                          <>
                            <p className="rounded-md border border-amber-400/30 bg-amber-950/40 p-3 text-sm text-amber-100">
                              {options.notice}
                            </p>
                            {!canCreateOffer && (
                              <p className="text-sm font-medium text-red-200">
                                Select every required resource from the matching lists before
                                creating an offer.
                              </p>
                            )}
                            <div className="grid gap-4 md:grid-cols-2">
                              <label className="text-sm font-medium text-slate-100">
                                Hospital referral
                                <select
                                  className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                  value={selectedHospital[report.id] || ""}
                                  onChange={(e) =>
                                    setSelectedHospital((s) => ({
                                      ...s,
                                      [report.id!]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Select suitable hospital</option>
                                  {options.hospitals.map((h) => (
                                    <option key={h.id} value={h.id}>
                                      {h.name} · {h.distanceKm?.toFixed(1)} km · general{" "}
                                      {h.bedsAvailable ?? 0}, ICU {h.icuAvailable ?? 0}, cardiac{" "}
                                      {h.cardiacBedsAvailable ?? 0}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <label className="text-sm font-medium text-slate-100">
                                Ambulance
                                <select
                                  className="mt-1.5 min-h-11 w-full rounded-md border border-slate-500 bg-slate-950 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                  value={selectedAmbulance[report.id] || ""}
                                  onChange={(e) =>
                                    setSelectedAmbulance((s) => ({
                                      ...s,
                                      [report.id!]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Select available ambulance</option>
                                  {options.ambulances.map((a) => (
                                    <option key={a.id} value={a.id}>
                                      {a.callSign} · {a.type} · {a.distanceKm.toFixed(1)} km
                                    </option>
                                  ))}
                                </select>
                              </label>
                            </div>
                            <p className="text-sm text-slate-300">
                              Recommendations use reported coordinates and straight-line distance.
                              Confirm capacity and acceptance with the hospital and response team.
                            </p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
      <div className="flex flex-wrap gap-2">
        {role === "ADMIN" && (
          <>
            <Button variant="outline" onClick={() => navigate("/hospitals")}>
              Hospitals & ambulance fleet
            </Button>
            <Button variant="outline" onClick={() => navigate("/rescue-missions")}>
              Response offers
            </Button>
            <Button variant="outline" onClick={() => navigate("/volunteer-tasks")}>
              Volunteer tasks
            </Button>
          </>
        )}
        {role === "DISPATCHER" && (
          <>
            <Button variant="outline" onClick={() => navigate("/hospitals")}>
              Hospital locations & capacity
            </Button>
            <Button variant="outline" onClick={() => navigate("/rescue-missions")}>
              Response offers
            </Button>
          </>
        )}
        {role === "RESCUE_TEAM" && (
          <>
            <Button variant="outline" onClick={() => navigate("/rescue-missions")}>
              My response offers
            </Button>
            <Button variant="outline" onClick={() => navigate("/hospitals")}>
              Hospital locations
            </Button>
          </>
        )}
        {role === "HOSPITAL" && (
          <>
            <Button variant="outline" onClick={() => navigate("/hospitals")}>
              Manage hospital capacity
            </Button>
            <Button variant="outline" onClick={() => navigate("/rescue-missions")}>
              Hospital referrals
            </Button>
          </>
        )}
        {["VOLUNTEER", "NGO"].includes(role) && (
          <Button variant="outline" onClick={() => navigate("/volunteer-tasks")}>
            Volunteer tasks
          </Button>
        )}
        {role === "CITIZEN" && (
          <>
            <Button variant="outline" onClick={() => navigate("/my-reports")}>
              My reports
            </Button>
            <Button variant="outline" onClick={() => navigate("/hospitals")}>
              Hospitals
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
