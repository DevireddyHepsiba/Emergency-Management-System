import { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as api from "@/services/api";
import { LocationPickerMap } from "@/components/LocationPickerMap";

interface Hospital {
  id?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  bedsAvailable?: number;
  icuAvailable?: number;
  cardiacBedsAvailable?: number;
  services?: string[];
  ambulances?: number;
  status?: string;
  distanceKm?: number;
}

export function HospitalManagement() {
  const userRole = localStorage.getItem("userRole") || "CITIZEN";
  const hospitalId = localStorage.getItem("hospitalId");
  const canAddHospital = userRole === "ADMIN";
  const canManageHospitals = userRole === "ADMIN" || (userRole === "HOSPITAL" && !!hospitalId);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [ambulances, setAmbulances] = useState<api.AmbulanceUnit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState<{
    id: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [ambulanceLocation, setAmbulanceLocation] = useState({ latitude: 0, longitude: 0 });
  const [editingAmbulanceLocation, setEditingAmbulanceLocation] = useState<{
    id: string;
    latitude: number;
    longitude: number;
  } | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
    phone: "",
    latitude: "",
    longitude: "",
    bedsAvailable: "0",
    icuAvailable: "0",
    cardiacBedsAvailable: "0",
    ambulances: "0",
    services: "",
  });

  const fetchHospitals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllHospitals();
      setHospitals(
        userRole === "HOSPITAL" ? data.filter((hospital) => hospital.id === hospitalId) : data,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hospitals");
    } finally {
      setLoading(false);
    }
  }, [hospitalId, userRole]);

  const fetchAmbulances = useCallback(async () => {
    try {
      const units = await api.getAmbulances();
      setAmbulances(
        userRole === "HOSPITAL" ? units.filter((unit) => unit.hospitalId === hospitalId) : units,
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load ambulance fleet");
    }
  }, [hospitalId, userRole]);

  const getUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  useEffect(() => {
    void fetchHospitals();
    if (["ADMIN", "HOSPITAL", "RESCUE_TEAM"].includes(userRole)) void fetchAmbulances();
    getUserLocation();
  }, [fetchAmbulances, fetchHospitals, getUserLocation, userRole]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const findNearest = async () => {
    if (!userLocation) {
      alert("Please enable location services");
      return;
    }

    try {
      const nearest = await api.findNearestHospital(userLocation.lat, userLocation.lon);
      setHospitals([nearest, ...hospitals.filter((h) => h.id !== nearest.id)]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to find nearest hospital");
    }
  };

  async function addAmbulance(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (ambulanceLocation.latitude === 0 && ambulanceLocation.longitude === 0) {
      setError("Click the map to choose the ambulance's current location before registering it.");
      return;
    }
    // Keep a stable reference while the API request is pending.
    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    try {
      await api.addAmbulance({
        callSign: String(data.get("callSign")),
        type: String(data.get("type")),
        capabilities: String(data.get("capabilities"))
          .split(",")
          .map((x) => x.trim().toUpperCase())
          .filter(Boolean),
        hospitalId: String(data.get("hospitalId") || "") || undefined,
        latitude: Number(data.get("latitude")),
        longitude: Number(data.get("longitude")),
      });
      formElement.reset();
      await fetchAmbulances();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not register ambulance");
    }
  }

  function updateAmbulanceGps(id: string) {
    navigator.geolocation?.getCurrentPosition(
      async (position) => {
        try {
          await api.updateAmbulanceLocation(
            id,
            position.coords.latitude,
            position.coords.longitude,
          );
          await fetchAmbulances();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not update GPS location");
        }
      },
      () => setError("Location permission was denied or unavailable."),
      { enableHighAccuracy: true, timeout: 10000 },
    );
  }

  async function saveAmbulanceMapLocation(id: string) {
    const location = editingAmbulanceLocation;
    if (!location || location.id !== id) return;
    try {
      await api.updateAmbulanceLocation(id, location.latitude, location.longitude);
      setEditingAmbulanceLocation(null);
      await fetchAmbulances();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update ambulance location");
    }
  }

  const editHospitalServices = async (hospital: Hospital) => {
    if (!hospital.id) return;
    const input = window.prompt(
      "Enter services this hospital currently provides, separated by commas",
      hospital.services?.join(", ") || "TRAUMA, SURGERY",
    );
    if (input === null) return;
    const services = input
      .split(",")
      .map((value) => value.trim().toUpperCase())
      .filter(Boolean);
    try {
      await api.updateHospitalServices(hospital.id, services);
      await fetchHospitals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hospital services");
    }
  };
  const addHospital = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.latitude || !form.longitude) {
      setError("Click the map to choose the hospital location before saving.");
      return;
    }
    try {
      setError(null);
      const services = form.services
        .split(",")
        .map((x) => x.trim().toUpperCase())
        .filter(Boolean);
      const saved = await api.addHospital({
        name: form.name,
        address: form.address,
        phone: form.phone,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        bedsAvailable: Number(form.bedsAvailable),
        icuAvailable: Number(form.icuAvailable),
        cardiacBedsAvailable: Number(form.cardiacBedsAvailable),
        ambulances: Number(form.ambulances),
        services,
      });
      if (saved.id && services.length) await api.updateHospitalServices(saved.id, services);
      setForm({
        name: "",
        address: "",
        phone: "",
        latitude: "",
        longitude: "",
        bedsAvailable: "0",
        icuAvailable: "0",
        cardiacBedsAvailable: "0",
        ambulances: "0",
        services: "",
      });
      setShowForm(false);
      await fetchHospitals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add hospital");
    }
  };

  const updateStatus = async (hospital: Hospital, status: string) => {
    if (!hospital.id) return;
    try {
      await api.updateHospitalStatus(hospital.id, status);
      await fetchHospitals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hospital status");
    }
  };

  const editResources = async (hospital: Hospital) => {
    if (!hospital.id) return;
    const input = window.prompt(
      "Enter general beds, ICU beds, cardiac beds, and ambulances, separated by commas",
      `${hospital.bedsAvailable ?? 0}, ${hospital.icuAvailable ?? 0}, ${hospital.cardiacBedsAvailable ?? 0}, ${hospital.ambulances ?? 0}`,
    );
    if (!input) return;
    const [beds, icu, cardiac, ambulances] = input.split(",").map((value) => Number(value.trim()));
    if ([beds, icu, cardiac, ambulances].some((value) => !Number.isInteger(value) || value < 0)) {
      setError("Enter four non-negative whole numbers: general, ICU, cardiac beds, ambulances.");
      return;
    }
    try {
      await api.updateHospitalResources(hospital.id, beds, icu, cardiac, ambulances);
      await fetchHospitals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hospital resources");
    }
  };

  const editHospitalLocation = async (hospital: Hospital) => {
    if (!hospital.id) return;
    setEditingLocation({
      id: hospital.id,
      latitude: hospital.latitude,
      longitude: hospital.longitude,
    });
  };

  const saveHospitalLocation = async () => {
    if (!editingLocation) return;
    try {
      await api.updateHospitalLocation(
        editingLocation.id,
        editingLocation.latitude,
        editingLocation.longitude,
      );
      setEditingLocation(null);
      await fetchHospitals();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update hospital location");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-800";
      case "ALERT_RECEIVED":
        return "bg-yellow-100 text-yellow-800";
      case "PREPARING":
        return "bg-orange-100 text-orange-800";
      case "PATIENT_RECEIVED":
        return "bg-blue-100 text-blue-800";
      case "TREATMENT_STARTED":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🏥 Hospital Management</h1>
        <div className="space-x-2">
          {canAddHospital && (
            <Button onClick={() => setShowForm((shown) => !shown)}>
              {showForm ? "Cancel" : "Add hospital"}
            </Button>
          )}
          <Button onClick={findNearest} variant="outline">
            📍 Find Nearest
          </Button>
          <Button onClick={fetchHospitals} disabled={loading}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {userRole === "HOSPITAL" && !hospitalId && (
        <Alert className="border-amber-300 bg-amber-50">
          <AlertDescription>
            Your account is not linked to a hospital yet. Ask the Admin to assign your facility in
            Dashboard → User access.
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {["ADMIN", "HOSPITAL", "RESCUE_TEAM"].includes(userRole) && (
        <Card className="mt-6 p-5">
          <h2 className="text-xl font-bold">Ambulance fleet</h2>
          <p className="mb-4 text-sm text-gray-600">
            Fresh GPS location and capability tags are used to recommend the closest suitable unit.
          </p>
          {canManageHospitals && (
            <form onSubmit={addAmbulance} className="mb-4 grid gap-3 md:grid-cols-3">
              <Input name="callSign" required placeholder="Call sign (AMB-12)" />
              <Input name="type" required placeholder="Type (BASIC, ADVANCED)" />
              <Input name="capabilities" placeholder="Capabilities: TRAUMA, CARDIAC" />
              {userRole === "HOSPITAL" ? (
                <input name="hospitalId" type="hidden" value={hospitalId || ""} />
              ) : (
                <select name="hospitalId" className="rounded border p-2">
                  <option value="">Home hospital (optional)</option>
                  {hospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              )}
              <div className="md:col-span-3">
                <LocationPickerMap
                  latitude={ambulanceLocation.latitude}
                  longitude={ambulanceLocation.longitude}
                  onSelect={(latitude, longitude) => setAmbulanceLocation({ latitude, longitude })}
                />
              </div>
              <input type="hidden" name="latitude" value={ambulanceLocation.latitude} />
              <input type="hidden" name="longitude" value={ambulanceLocation.longitude} />
              <Button type="submit" className="md:col-span-3">
                Register ambulance at selected map point
              </Button>
            </form>
          )}
          {userRole === "RESCUE_TEAM" && (
            <p className="mb-3 text-sm text-gray-600">
              Fleet is view-only here. Ambulances must be marked AVAILABLE and have a location saved
              in the last 15 minutes to appear in dispatcher matching.
            </p>
          )}
          {ambulances.length === 0 ? (
            <p className="text-sm text-gray-500">No fleet units registered.</p>
          ) : (
            <div className="divide-y">
              {ambulances.map((unit) => (
                <div
                  key={unit.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <strong>{unit.callSign}</strong> · {unit.type} · {unit.status}
                    <p className="text-xs text-gray-500">
                      {unit.capabilities.join(", ") || "No capability tags"} · GPS:{" "}
                      {unit.locationUpdatedAt
                        ? new Date(unit.locationUpdatedAt).toLocaleString()
                        : "Never updated"}
                    </p>
                    {editingAmbulanceLocation?.id === unit.id && (
                      <div className="mt-3 w-full space-y-2">
                        <LocationPickerMap
                          latitude={editingAmbulanceLocation.latitude}
                          longitude={editingAmbulanceLocation.longitude}
                          onSelect={(latitude, longitude) =>
                            setEditingAmbulanceLocation((current) =>
                              current ? { ...current, latitude, longitude } : current,
                            )
                          }
                        />
                        <div className="flex gap-2">
                          <Button size="sm" onClick={() => void saveAmbulanceMapLocation(unit.id)}>
                            Save map location
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingAmbulanceLocation(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {canManageHospitals && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setEditingAmbulanceLocation({
                            id: unit.id,
                            latitude: unit.latitude,
                            longitude: unit.longitude,
                          })
                        }
                      >
                        Update map location
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateAmbulanceGps(unit.id)}
                      >
                        Use this device GPS
                      </Button>
                      <Select
                        value={unit.status}
                        onValueChange={(status) =>
                          void api
                            .updateAmbulanceStatus(unit.id, status)
                            .then(fetchAmbulances)
                            .catch((err) => setError(err.message))
                        }
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {["AVAILABLE", "OUT_OF_SERVICE"].map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {showForm && canAddHospital && (
        <Card className="p-6">
          <form onSubmit={addHospital} className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="hospital-name">Hospital name</Label>
              <Input
                id="hospital-name"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hospital-address">Address</Label>
              <Input
                id="hospital-address"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="hospital-phone">Phone</Label>
              <Input
                id="hospital-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="md:col-span-2">
              <Label>Hospital location</Label>
              <LocationPickerMap
                latitude={Number(form.latitude)}
                longitude={Number(form.longitude)}
                onSelect={(latitude, longitude) =>
                  setForm((current) => ({
                    ...current,
                    latitude: String(latitude),
                    longitude: String(longitude),
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <div>
                <Label htmlFor="hospital-beds">General beds</Label>
                <Input
                  id="hospital-beds"
                  type="number"
                  min="0"
                  value={form.bedsAvailable}
                  onChange={(e) => setForm({ ...form, bedsAvailable: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hospital-icu">ICU beds</Label>
                <Input
                  id="hospital-icu"
                  type="number"
                  min="0"
                  value={form.icuAvailable}
                  onChange={(e) => setForm({ ...form, icuAvailable: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hospital-cardiac">Cardiac beds</Label>
                <Input
                  id="hospital-cardiac"
                  type="number"
                  min="0"
                  value={form.cardiacBedsAvailable}
                  onChange={(e) => setForm({ ...form, cardiacBedsAvailable: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="hospital-ambulances">Ambulances</Label>
                <Input
                  id="hospital-ambulances"
                  type="number"
                  min="0"
                  value={form.ambulances}
                  onChange={(e) => setForm({ ...form, ambulances: e.target.value })}
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="hospital-services">Services (comma separated)</Label>
              <Input
                id="hospital-services"
                placeholder="TRAUMA, CARDIAC, PEDIATRIC"
                value={form.services}
                onChange={(e) => setForm({ ...form, services: e.target.value })}
              />
            </div>
            <Button type="submit" className="md:col-span-2">
              Save hospital
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Loading hospitals...</p>
        </Card>
      ) : hospitals.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No hospitals found</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {hospitals.map((hospital) => {
            const distance =
              hospital.distanceKm != null
                ? hospital.distanceKm.toFixed(2)
                : userLocation &&
                    Number.isFinite(hospital.latitude) &&
                    Number.isFinite(hospital.longitude)
                  ? calculateDistance(
                      userLocation.lat,
                      userLocation.lon,
                      hospital.latitude,
                      hospital.longitude,
                    ).toFixed(2)
                  : "—";
            const locationDraft = editingLocation?.id === hospital.id ? editingLocation : null;

            return (
              <Card key={hospital.id} className="p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{hospital.name}</h3>
                  <span
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(hospital.status)}`}
                  >
                    {hospital.status || "ACTIVE"}
                  </span>
                </div>

                {hospital.address && (
                  <p className="text-sm text-gray-600 mb-3">📍 {hospital.address}</p>
                )}

                <div className="grid grid-cols-2 gap-3 mb-4 md:grid-cols-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Cardiac</p>
                    <p className="text-2xl font-bold text-rose-600">
                      {hospital.cardiacBedsAvailable ?? 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Beds</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {hospital.bedsAvailable ?? "—"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">ICU</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {hospital.icuAvailable ?? "—"}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Ambulances</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {hospital.ambulances ?? "—"}
                    </p>
                  </div>
                </div>
                <p className="mb-3 text-xs text-gray-600">
                  Services: {hospital.services?.join(", ") || "Not listed"}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                  <span className="text-gray-600">Distance: {distance} km</span>
                  {canManageHospitals && (
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void editHospitalLocation(hospital)}
                      >
                        Update location
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void editHospitalServices(hospital)}
                      >
                        Update services
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => void editResources(hospital)}
                      >
                        Update resources
                      </Button>
                    </div>
                  )}
                </div>
                {locationDraft && (
                  <div className="mt-4 space-y-3 rounded-lg border p-3">
                    <p className="font-medium">Choose this hospital location on the map</p>
                    <LocationPickerMap
                      latitude={locationDraft.latitude}
                      longitude={locationDraft.longitude}
                      onSelect={(latitude, longitude) =>
                        setEditingLocation((current) =>
                          current ? { ...current, latitude, longitude } : current,
                        )
                      }
                    />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => void saveHospitalLocation()}>
                        Save map location
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingLocation(null)}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}
                {canManageHospitals && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-xs text-gray-500">Status</span>
                    <Select
                      value={hospital.status || "ACTIVE"}
                      onValueChange={(value) => void updateStatus(hospital, value)}
                    >
                      <SelectTrigger className="h-8">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          "ACTIVE",
                          "ALERT_RECEIVED",
                          "PREPARING",
                          "PATIENT_RECEIVED",
                          "TREATMENT_STARTED",
                        ].map((status) => (
                          <SelectItem key={status} value={status}>
                            {status.replaceAll("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
