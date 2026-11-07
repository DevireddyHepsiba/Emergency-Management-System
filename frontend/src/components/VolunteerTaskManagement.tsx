import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as api from "@/services/api";

const statuses = ["ALL", "TASK_CREATED", "VOLUNTEER_ASSIGNED", "ON_FIELD", "TASK_COMPLETED"];

export function VolunteerTaskManagement() {
  const userRole = localStorage.getItem("userRole") || "CITIZEN";
  const currentUserId = localStorage.getItem("userId");
  const canCreateTask = ["ADMIN", "NGO"].includes(userRole);
  const canAdvanceTasks = ["ADMIN", "NGO", "VOLUNTEER"].includes(userRole);
  const [tasks, setTasks] = useState<api.VolunteerTask[]>([]);
  const [volunteers, setVolunteers] = useState<api.VolunteerAccount[]>([]);
  const [selectedVolunteers, setSelectedVolunteers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", location: "", emergencyId: "", required: "1", priority: "3" });

  useEffect(() => { void fetchTasks(); if (canCreateTask) void fetchVolunteers(); }, [canCreateTask]);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      setTasks(await api.getAllVolunteerTasks());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load volunteer tasks");
    } finally {
      setLoading(false);
    }
  }

  async function fetchVolunteers() {
    try {
      setVolunteers(await api.getVolunteerAccounts());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load volunteer accounts");
    }
  }

  async function assignVolunteer(taskId: string) {
    const volunteerId = selectedVolunteers[taskId];
    if (!volunteerId) { setError("Choose a volunteer before assigning the task."); return; }
    try {
      setError(null);
      await api.assignVolunteerToTask(taskId, volunteerId);
      setSelectedVolunteers((current) => ({ ...current, [taskId]: "" }));
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not assign volunteer");
    }
  }

  async function createTask(event: React.FormEvent) {
    event.preventDefault();
    try {
      setError(null);
      await api.createVolunteerTask({
        title: form.title,
        description: form.description,
        location: form.location,
        emergencyId: form.emergencyId || undefined,
        required: Number(form.required),
        priority: Number(form.priority),
      });
      setForm({ title: "", description: "", location: "", emergencyId: "", required: "1", priority: "3" });
      setShowForm(false);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create task");
    }
  }

  async function advanceTask(taskId: string) {
    const task = tasks.find((item) => item.id === taskId);
    if (!task) return;
    const nextStatus = task.status === "TASK_CREATED" ? "VOLUNTEER_ASSIGNED"
      : task.status === "VOLUNTEER_ASSIGNED" ? "ON_FIELD" : "TASK_COMPLETED";
    try {
      setError(null);
      await api.updateVolunteerTaskStatus(taskId, nextStatus);
      await fetchTasks();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update task");
    }
  }

  const visibleTasks = tasks.filter((task) =>
    (filterStatus === "ALL" || task.status === filterStatus)
    && (userRole !== "VOLUNTEER" || (!!currentUserId && !!task.assigned?.includes(currentUserId)))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-3xl font-bold">Volunteer Tasks</h1><p className="mt-1 text-gray-600">Create and move tasks through their response workflow.</p></div>
        <div className="flex gap-2">{canCreateTask && <Button onClick={() => setShowForm((shown) => !shown)}>{showForm ? "Cancel" : "New task"}</Button>}<Button variant="outline" onClick={() => void fetchTasks()} disabled={loading}>Refresh</Button></div>
      </div>
      {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
      {showForm && canCreateTask && <Card className="p-6"><form onSubmit={createTask} className="grid gap-4 md:grid-cols-2">
        <div><Label htmlFor="task-title">Task title</Label><Input id="task-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
        <div><Label htmlFor="task-location">Location</Label><Input id="task-location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} /></div>
        <div><Label htmlFor="task-description">Description</Label><Textarea id="task-description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        <div className="space-y-3"><div><Label htmlFor="task-emergency">Related emergency ID (optional)</Label><Input id="task-emergency" value={form.emergencyId} onChange={(e) => setForm({ ...form, emergencyId: e.target.value })} /></div><div className="grid grid-cols-2 gap-3"><div><Label htmlFor="task-required">Volunteers needed</Label><Input id="task-required" type="number" min="1" value={form.required} onChange={(e) => setForm({ ...form, required: e.target.value })} /></div><div><Label htmlFor="task-priority">Priority (1 highest)</Label><Input id="task-priority" type="number" min="1" max="5" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} /></div></div></div>
        <Button type="submit" className="md:col-span-2">Create volunteer task</Button>
      </form></Card>}
      <div className="flex flex-wrap gap-2">{statuses.map((status) => <Button key={status} variant={filterStatus === status ? "default" : "outline"} onClick={() => setFilterStatus(status)}>{status.replaceAll("_", " ")}</Button>)}</div>
      {loading ? <Card className="p-6 text-center">Loading tasks…</Card> : visibleTasks.length === 0 ? <Card className="p-6 text-center text-gray-500">No tasks in this status yet.</Card> : <div className="space-y-3">{visibleTasks.map((task) => <Card key={task.id} className="p-5">
        <div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="text-lg font-semibold">{task.title}</h2>{task.description && <p className="mt-1 text-gray-600">{task.description}</p>}{task.location && <p className="mt-2 text-sm text-gray-500">📍 {task.location}</p>}{task.emergencyId && <p className="mt-1 text-sm text-gray-500">Emergency: {task.emergencyId}</p>}{!!task.assigned?.length && <p className="mt-1 text-sm text-gray-500">Assigned to: {task.assigned.map((id) => volunteers.find((volunteer) => volunteer.id === id)?.name || id.slice(0, 8)).join(", ")}</p>}</div><div className="text-right text-sm"><p className="font-medium">{task.status?.replaceAll("_", " ") || "TASK CREATED"}</p><p className="text-gray-500">Priority {task.priority ?? 3} · {task.assigned?.length ?? 0}/{task.required ?? 1} assigned</p></div></div>
        {canCreateTask && task.id && task.status === "TASK_CREATED" && <div className="mt-4 flex flex-wrap items-end gap-2"><div className="w-72"><Label>Assign a volunteer</Label><Select value={selectedVolunteers[task.id] || ""} onValueChange={(value) => setSelectedVolunteers((current) => ({ ...current, [task.id!]: value }))}><SelectTrigger><SelectValue placeholder="Choose volunteer" /></SelectTrigger><SelectContent>{volunteers.filter((volunteer) => !task.assigned?.includes(volunteer.id)).map((volunteer) => <SelectItem key={volunteer.id} value={volunteer.id}>{volunteer.name} · {volunteer.email}</SelectItem>)}</SelectContent></Select></div><Button size="sm" onClick={() => void assignVolunteer(task.id!)} disabled={!selectedVolunteers[task.id]}>Assign ({task.assigned?.length ?? 0}/{task.required ?? 1})</Button>{volunteers.length === 0 && <p className="text-sm text-gray-500">No volunteer accounts registered yet.</p>}</div>}
        {canAdvanceTasks && task.id && task.status !== "TASK_COMPLETED" && task.status !== "TASK_CREATED" && <Button className="mt-4" size="sm" onClick={() => void advanceTask(task.id!)}>{task.status === "VOLUNTEER_ASSIGNED" ? "Start task" : "Complete task"}</Button>}
      </Card>)}</div>}
    </div>
  );
}
