import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import * as api from "@/services/api";

interface RescueMission {
  id?: string;
  emergencyId: string;
  status?: "PENDING" | "DISPATCHED" | "IN_PROGRESS" | "COMPLETED" | "FAILED";
  createdAt?: string;
  estimatedArrival?: string;
  notes?: string;
  teamsInvolved?: number;
  volunteersAssigned?: number;
}

export function RescueMissionManagement() {
  const [missions, setMissions] = useState<RescueMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    emergencyId: "",
    notes: "",
  });

  useEffect(() => {
    fetchActiveMissions();
  }, []);

  const fetchActiveMissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getActiveRescueMissions();
      setMissions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch missions");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMission = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRescueMission({
        emergencyId: formData.emergencyId,
        notes: formData.notes,
      } as any);
      setFormData({ emergencyId: "", notes: "" });
      setShowForm(false);
      await fetchActiveMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create mission");
    }
  };

  const handleUpdateStatus = async (missionId: string, newStatus: string) => {
    try {
      await api.updateRescueMissionStatus(missionId, newStatus);
      await fetchActiveMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update mission");
    }
  };

  const handleUpdateETA = async (missionId: string, minutes: number) => {
    try {
      await api.updateRescueMissionETA(missionId, minutes);
      await fetchActiveMissions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update ETA");
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "DISPATCHED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "FAILED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">🚑 Rescue Mission Management</h1>
        <div className="space-x-2">
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? "✖ Cancel" : "➕ New Mission"}
          </Button>
          <Button onClick={fetchActiveMissions} disabled={loading}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Create Mission Form */}
      {showForm && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h2 className="text-xl font-bold mb-4">Create New Rescue Mission</h2>
          <form onSubmit={handleCreateMission} className="space-y-4">
            <div>
              <Label htmlFor="emergencyId">Emergency ID *</Label>
              <Input
                id="emergencyId"
                value={formData.emergencyId}
                onChange={(e) => setFormData({ ...formData, emergencyId: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="notes">Mission Notes</Label>
              <Textarea
                id="notes"
                placeholder="Describe the mission objectives..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Create Mission
            </Button>
          </form>
        </Card>
      )}

      {/* Missions List */}
      {loading ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Loading rescue missions...</p>
        </Card>
      ) : missions.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No active rescue missions</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {missions.map((mission) => (
            <Card key={mission.id} className="p-6 border-l-4 border-orange-500 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold">Mission #{mission.id?.slice(0, 8)}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Emergency ID: {mission.emergencyId}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(mission.status)}`}>
                  {mission.status || "PENDING"}
                </span>
              </div>

              {mission.notes && (
                <p className="text-sm text-gray-700 mb-3 bg-white p-2 rounded">
                  📝 {mission.notes}
                </p>
              )}

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Teams</p>
                  <p className="text-xl font-bold">{mission.teamsInvolved || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Volunteers</p>
                  <p className="text-xl font-bold">{mission.volunteersAssigned || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">ETA</p>
                  <p className="text-xl font-bold">
                    {mission.estimatedArrival ? new Date(mission.estimatedArrival).getMinutes() : "—"} min
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {mission.status === "PENDING" && (
                  <Button size="sm" onClick={() => handleUpdateStatus(mission.id!, "DISPATCHED")}>
                    Dispatch
                  </Button>
                )}
                {mission.status === "DISPATCHED" && (
                  <Button size="sm" onClick={() => handleUpdateStatus(mission.id!, "IN_PROGRESS")}>
                    Start Mission
                  </Button>
                )}
                {mission.status === "IN_PROGRESS" && (
                  <Button size="sm" onClick={() => handleUpdateStatus(mission.id!, "COMPLETED")}>
                    Complete
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    const eta = prompt("Enter new ETA (minutes):", "30");
                    if (eta) {
                      handleUpdateETA(mission.id!, parseInt(eta));
                    }
                  }}
                >
                  Update ETA
                </Button>
                <Button size="sm" variant="ghost">
                  View Details
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
