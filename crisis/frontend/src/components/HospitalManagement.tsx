import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as api from "@/services/api";

interface Hospital {
  id?: string;
  name: string;
  address?: string;
  latitude: number;
  longitude: number;
  bedsAvailable?: number;
  icuAvailable?: number;
  ambulances?: number;
  status?: string;
  distanceKm?: number;
}

export function HospitalManagement() {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    fetchHospitals();
    getUserLocation();
  }, []);

  const fetchHospitals = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllHospitals();
      setHospitals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch hospitals");
    } finally {
      setLoading(false);
    }
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  };

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
          <Button onClick={findNearest} variant="outline">
            📍 Find Nearest
          </Button>
          <Button onClick={fetchHospitals} disabled={loading}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
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
            const distance = userLocation
              ? calculateDistance(
                  userLocation.lat,
                  userLocation.lon,
                  hospital.latitude,
                  hospital.longitude
                ).toFixed(2)
              : "—";

            return (
              <Card key={hospital.id} className="p-6 hover:shadow-lg transition">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-bold">{hospital.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(hospital.status)}`}>
                    {hospital.status || "ACTIVE"}
                  </span>
                </div>

                {hospital.address && (
                  <p className="text-sm text-gray-600 mb-3">📍 {hospital.address}</p>
                )}

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Beds</p>
                    <p className="text-2xl font-bold text-blue-600">{hospital.bedsAvailable || "—"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">ICU</p>
                    <p className="text-2xl font-bold text-purple-600">{hospital.icuAvailable || "—"}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Ambulances</p>
                    <p className="text-2xl font-bold text-orange-600">{hospital.ambulances || "—"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Distance: {distance} km</span>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
