import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import * as api from "@/services/api";

export function EmergencyReportForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emergencyType: "MEDICAL",
    description: "",
    latitude: 0,
    longitude: 0,
    victims: 1,
    hasMedicalEmergency: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  // Get user's current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          }));
        },
        (error) => {
          setGeoError(`Location error: ${error.message}`);
        }
      );
    } else {
      setGeoError("Geolocation not supported");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await api.reportEmergency({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        emergencyType: formData.emergencyType as any,
        description: formData.description,
        latitude: formData.latitude,
        longitude: formData.longitude,
        victims: formData.victims,
        hasMedicalEmergency: formData.hasMedicalEmergency,
      });

      setSuccess(true);
      setFormData({
        fullName: "",
        mobileNumber: "",
        emergencyType: "MEDICAL",
        description: "",
        latitude: formData.latitude,
        longitude: formData.longitude,
        victims: 1,
        hasMedicalEmergency: false,
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to report emergency");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <h2 className="text-2xl font-bold text-red-600 mb-6">🆘 Report Emergency</h2>

      {geoError && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{geoError}</AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-4 border-green-200 bg-green-50">
          <AlertDescription className="text-green-800">
            ✅ Emergency reported successfully! Rescue teams are being notified.
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
          </div>

          <div>
            <Label htmlFor="mobileNumber">Mobile Number (10+ digits) *</Label>
            <Input
              id="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emergencyType">Emergency Type *</Label>
            <Select value={formData.emergencyType} onValueChange={(val) => setFormData({ ...formData, emergencyType: val })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MEDICAL">🏥 Medical</SelectItem>
                <SelectItem value="FIRE">🔥 Fire</SelectItem>
                <SelectItem value="ACCIDENT">🚗 Accident</SelectItem>
                <SelectItem value="FLOOD">💧 Flood</SelectItem>
                <SelectItem value="EARTHQUAKE">🌍 Earthquake</SelectItem>
                <SelectItem value="OTHER">❓ Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="victims">Number of Victims</Label>
            <Input
              id="victims"
              type="number"
              min="1"
              value={formData.victims}
              onChange={(e) => setFormData({ ...formData, victims: parseInt(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe the emergency situation..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.0001"
              value={formData.latitude}
              onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            />
          </div>

          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.0001"
              value={formData.longitude}
              onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="medical"
            type="checkbox"
            checked={formData.hasMedicalEmergency}
            onChange={(e) => setFormData({ ...formData, hasMedicalEmergency: e.target.checked })}
            className="w-4 h-4"
          />
          <Label htmlFor="medical" className="cursor-pointer">
            Has medical emergency
          </Label>
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-lg py-6"
        >
          {loading ? "Reporting..." : "🚨 Report Emergency"}
        </Button>
      </form>
    </Card>
  );
}
