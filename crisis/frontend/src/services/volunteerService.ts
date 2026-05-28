export type VolunteerTask = {
  id: string;
  title: string;
  location?: string;
  required?: number;
  assigned?: string[];
  status: "TASK_CREATED" | "VOLUNTEER_ASSIGNED" | "ON_FIELD" | "TASK_COMPLETED";
};

export function createVolunteerTask(data: Partial<VolunteerTask>): VolunteerTask {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    title: data.title || "Support Task",
    location: data.location,
    required: data.required || 1,
    assigned: data.assigned || [],
    status: "TASK_CREATED",
  };
}

export function advanceTask(task: VolunteerTask): VolunteerTask {
  const next: VolunteerTask = { ...task };
  if (task.status === "TASK_CREATED") next.status = "VOLUNTEER_ASSIGNED";
  else if (task.status === "VOLUNTEER_ASSIGNED") next.status = "ON_FIELD";
  else if (task.status === "ON_FIELD") next.status = "TASK_COMPLETED";
  return next;
}
