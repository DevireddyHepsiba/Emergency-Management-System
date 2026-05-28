import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import * as api from "@/services/api";

interface VolunteerTask {
  id?: string;
  description: string;
  assignedVolunteer?: string;
  status?: "PENDING" | "ASSIGNED" | "IN_PROGRESS" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  volunteerId?: string;
}

export function VolunteerTaskManagement() {
  const [tasks, setTasks] = useState<VolunteerTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getAllVolunteerTasks();
      setTasks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusUpdate = async (taskId: string, newStatus: string) => {
    try {
      await api.updateVolunteerTaskStatus(taskId, newStatus);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task");
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-800";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800";
      case "LOW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "PENDING":
        return "bg-gray-100 text-gray-800";
      case "ASSIGNED":
        return "bg-blue-100 text-blue-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filterStatus === "ALL") return true;
    return task.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">👥 Volunteer Task Management</h1>
        <Button onClick={fetchTasks} disabled={loading}>
          🔄 Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2">
        {["ALL", "PENDING", "ASSIGNED", "IN_PROGRESS", "COMPLETED"].map((status) => (
          <Button
            key={status}
            variant={filterStatus === status ? "default" : "outline"}
            onClick={() => setFilterStatus(status)}
          >
            {status}
          </Button>
        ))}
      </div>

      {loading ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">Loading tasks...</p>
        </Card>
      ) : filteredTasks.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">No tasks found</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="p-6 hover:shadow-lg transition">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-lg font-semibold">{task.description}</p>
                  {task.assignedVolunteer && (
                    <p className="text-sm text-gray-600 mt-1">
                      👤 Assigned to: {task.assignedVolunteer}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(task.priority)}`}>
                    {task.priority || "MEDIUM"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(task.status)}`}>
                    {task.status || "PENDING"}
                  </span>
                </div>
              </div>

              {task.dueDate && (
                <p className="text-sm text-gray-500 mb-4">
                  📅 Due: {new Date(task.dueDate).toLocaleDateString()}
                </p>
              )}

              <div className="flex gap-2">
                {task.status !== "COMPLETED" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      handleTaskStatusUpdate(
                        task.id!,
                        task.status === "PENDING"
                          ? "ASSIGNED"
                          : task.status === "ASSIGNED"
                          ? "IN_PROGRESS"
                          : "COMPLETED"
                      )
                    }
                  >
                    {task.status === "PENDING"
                      ? "Assign"
                      : task.status === "ASSIGNED"
                      ? "Start"
                      : "Complete"}
                  </Button>
                )}
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
