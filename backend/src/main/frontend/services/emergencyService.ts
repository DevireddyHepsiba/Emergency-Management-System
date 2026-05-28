// Frontend TypeScript Service - Updated to use Backend APIs

export type Hospital = {
  id: string;
  name: string;
  bedsAvailable: number;
  icuAvailable: number;
  ambulances: number;
  distanceKm?: number;
  status?: string;
  latitude?: number;
  longitude?: number;
};

export type HospitalStatus = "ALERT_RECEIVED" | "PREPARING" | "PATIENT_RECEIVED" | "TREATMENT_STARTED";

export type VolunteerTask = {
  id: string;
  title: string;
  location?: string;
  required?: number;
  assigned?: string[];
  status: "TASK_CREATED" | "VOLUNTEER_ASSIGNED" | "ON_FIELD" | "TASK_COMPLETED";
  description?: string;
  priority?: number;
  emergencyId?: string;
};

export type EventPayload = {
  event: string;
  severity?: "LOW" | "MEDIUM" | "HIGH";
  injured?: number;
  location?: string;
  includeVolunteers?: boolean;
  multipleTeams?: boolean;
  [k: string]: any;
};

const API_BASE_URL = "http://localhost:8080/api";

// ============ HOSPITAL APIs ============

export async function findNearestHospital(latitude: number, longitude: number): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/nearest?latitude=${latitude}&longitude=${longitude}`);
  if (!response.ok) throw new Error("Failed to find nearest hospital");
  return response.json();
}

export async function getAllHospitals(): Promise<Hospital[]> {
  const response = await fetch(`${API_BASE_URL}/hospital/all`);
  if (!response.ok) throw new Error("Failed to fetch hospitals");
  return response.json();
}

export async function getHospitalById(hospitalId: string): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}`);
  if (!response.ok) throw new Error("Failed to fetch hospital");
  return response.json();
}

export async function addHospital(hospital: Partial<Hospital>): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/add`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hospital),
  });
  if (!response.ok) throw new Error("Failed to add hospital");
  return response.json();
}

export async function updateHospitalStatus(hospitalId: string, status: HospitalStatus): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}/status?status=${status}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to update hospital status");
  return response.json();
}

export async function updateHospitalResources(
  hospitalId: string,
  beds: number,
  icu: number,
  ambulances: number
): Promise<Hospital> {
  const response = await fetch(
    `${API_BASE_URL}/hospital/${hospitalId}/resources?beds=${beds}&icu=${icu}&ambulances=${ambulances}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    }
  );
  if (!response.ok) throw new Error("Failed to update hospital resources");
  return response.json();
}

export function startHospitalFlow(hospitalId: string, onUpdate: (status: HospitalStatus, detail?: any) => void) {
  const statuses: HospitalStatus[] = ["ALERT_RECEIVED", "PREPARING", "PATIENT_RECEIVED", "TREATMENT_STARTED"];
  const timers: number[] = [];
  let currentIndex = 0;

  const updateStatus = async () => {
    if (currentIndex < statuses.length) {
      const status = statuses[currentIndex];
      onUpdate(status);
      try {
        await updateHospitalStatus(hospitalId, status);
      } catch (error) {
        console.error("Failed to update hospital status:", error);
      }
      currentIndex++;
      timers.push(window.setTimeout(updateStatus, 5000));
    }
  };

  timers.push(window.setTimeout(updateStatus, 1000));

  return () => timers.forEach((t) => window.clearTimeout(t));
}

// ============ VOLUNTEER TASK APIs ============

export async function createVolunteerTask(data: Partial<VolunteerTask>): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create volunteer task");
  return response.json();
}

export async function getVolunteerTaskById(taskId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}`);
  if (!response.ok) throw new Error("Failed to fetch volunteer task");
  return response.json();
}

export async function getAllVolunteerTasks(): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/all`);
  if (!response.ok) throw new Error("Failed to fetch volunteer tasks");
  return response.json();
}

export async function getVolunteerTasksByStatus(status: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/status/${status}`);
  if (!response.ok) throw new Error("Failed to fetch volunteer tasks");
  return response.json();
}

export async function getVolunteerTasksByEmergency(emergencyId: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/emergency/${emergencyId}`);
  if (!response.ok) throw new Error("Failed to fetch volunteer tasks");
  return response.json();
}

export async function getVolunteerTasksByLocation(location: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/location/${location}`);
  if (!response.ok) throw new Error("Failed to fetch volunteer tasks");
  return response.json();
}

export async function assignVolunteer(taskId: string, volunteerId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/assign/${volunteerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to assign volunteer");
  return response.json();
}

export async function advanceTask(taskId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/advance`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to advance task");
  return response.json();
}

export async function updateTaskStatus(taskId: string, status: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/status?status=${status}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to update task status");
  return response.json();
}

export async function completeTask(taskId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/complete`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
  });
  if (!response.ok) throw new Error("Failed to complete task");
  return response.json();
}

// ============ EMERGENCY EVENT STREAMING ============

let _interval: number | null = null;

export function startMockEventSource(onEvent: (e: EventPayload) => void) {
  if (_interval) return;

  const samples: EventPayload[] = [
    {
      event: "SOS_FLOOD",
      severity: "MEDIUM",
      location: "Sector 9",
      includeVolunteers: true,
      details: "House flooding, need boat rescue",
    },
    {
      event: "MEDICAL_EMERGENCY",
      severity: "HIGH",
      injured: 2,
      location: "Madhapur",
      includeVolunteers: false,
    },
    {
      event: "RESOURCE_SUPPORT",
      severity: "LOW",
      type: "FOOD",
      location: "Relief Camp A",
      multipleTeams: false,
    },
    {
      event: "BUILDING_COLLAPSE",
      severity: "HIGH",
      injured: 5,
      location: "Old Market",
      includeVolunteers: true,
    },
  ];

  let i = 0;
  _interval = window.setInterval(() => {
    const sample = samples[i % samples.length];
    onEvent({ ...sample, timestamp: Date.now() });
    i += 1;
  }, 5000);
}

export function stopMockEventSource() {
  if (_interval) {
    window.clearInterval(_interval);
    _interval = null;
  }
}

// ============ DASHBOARD STATS ============

export async function getDashboardStats() {
  try {
    const hospitals = await getAllHospitals();
    const tasks = await getAllVolunteerTasks();

    const stats = {
      activeEmergencies: tasks.filter((t) => t.status !== "TASK_COMPLETED").length,
      teamsDeployed: tasks.filter((t) => t.status === "ON_FIELD").length,
      ambulances: hospitals.reduce((acc, h) => acc + (h.ambulances || 0), 0),
      hospitalCapacity: Math.round((hospitals.filter((h) => h.bedsAvailable > 0).length / (hospitals.length || 1)) * 100),
      volunteersTasks: tasks.length,
    };

    return stats;
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return null;
  }
}

