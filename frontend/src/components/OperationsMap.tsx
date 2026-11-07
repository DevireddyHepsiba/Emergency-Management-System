import { useCallback, useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Popup, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as api from "@/services/api";

type Point = { latitude: number; longitude: number };

function MapViewport({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 1) map.setView([points[0].latitude, points[0].longitude], 13);
    else if (points.length > 1) map.fitBounds(points.map((point) => [point.latitude, point.longitude] as [number, number]), { padding: [36, 36], maxZoom: 13 });
  }, [map, points]);
  return null;
}

function isValidPoint(point: Point) {
  return Number.isFinite(point.latitude) && Number.isFinite(point.longitude) && Math.abs(point.latitude) <= 90 && Math.abs(point.longitude) <= 180;
}

function freshnessLabel(updatedAt?: string) {
  if (!updatedAt) return "Location time unavailable";
  const minutes = Math.max(0, Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60000));
  return minutes < 1 ? "Location updated just now" : `Location updated ${minutes} min ago`;
}

export function OperationsMap() {
  const [reports, setReports] = useState<api.EmergencyReport[]>([]);
  const [hospitals, setHospitals] = useState<api.Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<api.AmbulanceUnit[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [reportData, hospitalData, ambulanceData] = await Promise.all([
        api.getAllEmergencies(), api.getAllHospitals(), api.getAmbulances(),
      ]);
      setReports(reportData);
      setHospitals(hospitalData);
      setAmbulances(ambulanceData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load map locations");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => void refresh(), 30000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const points = useMemo(() => [
    ...reports.filter((report) => report.status !== "RESOLVED" && report.status !== "CANCELLED").map((report) => ({ latitude: report.latitude, longitude: report.longitude })),
    ...hospitals.map((hospital) => ({ latitude: hospital.latitude, longitude: hospital.longitude })),
    ...ambulances.map((ambulance) => ({ latitude: ambulance.latitude, longitude: ambulance.longitude })),
  ].filter(isValidPoint), [reports, hospitals, ambulances]);
  const center: [number, number] = points.length ? [points[0].latitude, points[0].longitude] : [16.54, 81.49];

  return <Card className="overflow-hidden p-5">
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="text-xl font-bold">Live operations map</h2><p className="mt-1 text-sm text-slate-300">Incidents, hospitals, and each ambulance’s last reported GPS location.</p></div>
      <Button variant="outline" onClick={() => void refresh()} disabled={loading}>{loading ? "Loading…" : "Refresh map"}</Button>
    </div>
    {error && <p role="alert" className="mb-3 rounded-md border border-red-400/40 bg-red-950/40 p-3 text-sm text-red-100">{error}</p>}
    <div className="mb-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-200"><span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-red-500"/>Open incident</span><span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-blue-500"/>Hospital</span><span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-emerald-500"/>Available ambulance with recent location</span><span><i className="mr-2 inline-block h-3 w-3 rounded-full bg-slate-500"/>Unavailable or stale location</span></div>
    <MapContainer center={center} zoom={6} scrollWheelZoom className="h-[480px] w-full rounded-lg border border-slate-600">
      <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapViewport points={points} />
      {reports.filter((report) => report.status !== "RESOLVED" && report.status !== "CANCELLED" && isValidPoint(report)).map((report) => <CircleMarker key={`incident-${report.id}`} center={[report.latitude, report.longitude]} radius={9} pathOptions={{ color: "#fff", weight: 2, fillColor: "#ef4444", fillOpacity: 0.95 }}><Popup><strong>{report.emergencyType} · {report.priority || "UNRATED"}</strong><br/>Status: {report.status || "REPORTED"}<br/>{report.description || "No report details"}<br/>Reported location</Popup></CircleMarker>)}
      {hospitals.filter(isValidPoint).map((hospital) => <CircleMarker key={`hospital-${hospital.id}`} center={[hospital.latitude, hospital.longitude]} radius={8} pathOptions={{ color: "#fff", weight: 2, fillColor: "#3b82f6", fillOpacity: 0.95 }}><Popup><strong>🏥 {hospital.name}</strong><br/>{hospital.address || "Address not listed"}<br/>Status: {hospital.status || "ACTIVE"}<br/>Beds: {hospital.bedsAvailable ?? "—"} · ICU: {hospital.icuAvailable ?? "—"}<br/>Services: {hospital.services?.join(", ") || "Not listed"}</Popup></CircleMarker>)}
      {ambulances.filter(isValidPoint).map((ambulance) => {
        const fresh = !!ambulance.locationUpdatedAt && Date.now() - new Date(ambulance.locationUpdatedAt).getTime() <= 15 * 60 * 1000;
        const available = ambulance.status === "AVAILABLE" && fresh;
        return <CircleMarker key={`ambulance-${ambulance.id}`} center={[ambulance.latitude, ambulance.longitude]} radius={8} pathOptions={{ color: "#fff", weight: 2, fillColor: available ? "#10b981" : "#64748b", fillOpacity: 0.95 }}><Popup><strong>🚑 {ambulance.callSign}</strong><br/>Type: {ambulance.type}<br/>Status: {ambulance.status}<br/>Capabilities: {ambulance.capabilities?.join(", ") || "Not listed"}<br/>{freshnessLabel(ambulance.locationUpdatedAt)}<br/><em>This is the last saved location, not live tracking.</em></Popup></CircleMarker>;
      })}
    </MapContainer>
    <p className="mt-3 text-xs text-slate-300">Map refreshes every 30 seconds. Ambulance pins show the last location saved by a responder or dispatcher; continuous GPS tracking is not enabled.</p>
  </Card>;
}
