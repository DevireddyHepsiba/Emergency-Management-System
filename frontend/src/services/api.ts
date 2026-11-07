/**
 * Comprehensive API Service for Sentinelos
 * Connects to all backend REST endpoints
 * Complete type safety with TypeScript
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// ============ TYPES & INTERFACES ============

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  hospitalId?: string;
  message: string;
}

export interface RegisterResponse {
  email: string;
  name: string;
  role: string;
  message: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: "VOLUNTEER" | "CITIZEN";
  latitude?: number;
  longitude?: number;
}

export interface EmergencyReport {
  id?: string;
  userId?: string;
  fullName: string;
  mobileNumber: string;
  emergencyType: "MEDICAL" | "FIRE" | "FLOOD" | "ACCIDENT" | "EARTHQUAKE" | "OTHER";
  description?: string;
  latitude: number;
  longitude: number;
  victims?: number;
  hasMedicalEmergency?: boolean;
  mediaUrls?: string[];
  status?: "REPORTED" | "TRIAGED" | "DISPATCHED" | "ON_SCENE" | "TRANSPORTING" | "ARRIVED" | "RESOLVED" | "CANCELLED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  createdAt?: string;
  updatedAt?: string;
  requiredServices?: string[];
  requiredBedType?: string;
  ambulanceCapability?: string;
  needsAmbulance?: boolean;
  triageNotes?: string;
  statusHistory?: { status: string; changedBy: string; note: string; changedAt: string }[];
}

export interface Hospital {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
  services?: string[];
  cardiacBedsAvailable?: number;
  capacityUpdatedAt?: string;
  latitude: number;
  longitude: number;
  bedsAvailable?: number;
  icuAvailable?: number;
  ambulances?: number;
  status?: "ACTIVE" | "ALERT_RECEIVED" | "PREPARING" | "PATIENT_RECEIVED" | "TREATMENT_STARTED";
  distanceKm?: number;
}

export interface VolunteerTask {
  id?: string;
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  required?: number;
  assigned?: string[];
  status?: "TASK_CREATED" | "VOLUNTEER_ASSIGNED" | "ON_FIELD" | "TASK_COMPLETED";
  priority?: number;
  emergencyId?: string;
  createdAt?: string;
}

export interface VolunteerAccount {
  id: string;
  name: string;
  email: string;
}

export interface RescueMission {
  id?: string;
  missionCode?: string;
  emergencyId: string;
  ambulanceId?: string;
  assignedVehicle?: string;
  teamAccepted?: boolean;
  hospitalAccepted?: boolean;
  teamAcceptedBy?: string;
  hospitalAcceptedBy?: string;
  requiredBedType?: string;
  title: string;
  description?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  victims?: number;
  missionType?: string;
  assignedTeam?: string;
  hospitalId?: string;
  responders?: string[];
  distance?: number;
  eta?: number;
  status?: "OFFERED" | "DECLINED" | "ACCEPTED" | "EN_ROUTE" | "REACHED" | "TRANSPORTING" | "ARRIVED" | "COMPLETED";
  priority?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AdminStats {
  activeEmergencies: number;
  totalVolunteers: number;
  activeRescueMissions: number;
  totalHospitals: number;
  availableBeds: number;
  activeVolunteers: number;
  volunteersOnMission: number;
  suppliesInStock: number;
  servicesUp: number;
  servicesDown: number;
  triageAccuracy?: number;
  sosProcessed?: number;
  duplicatesKilled?: number;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  hospitalId?: string;
}

export interface TriageRequest {
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  requiredServices: string[];
  requiredBedType: "GENERAL" | "ICU" | "CARDIAC" | "NONE";
  needsAmbulance: boolean;
  ambulanceCapability?: string;
  notes?: string;
}

export interface AmbulanceRecommendation {
  id: string;
  callSign: string;
  type: string;
  capabilities: string[];
  status: string;
  hospitalId?: string;
  latitude: number;
  longitude: number;
  distanceKm: number;
  locationUpdatedAt?: string;
  updatedAt?: string;
}

export interface DispatchRecommendations {
  emergencyId: string;
  hospitals: Hospital[];
  ambulances: AmbulanceRecommendation[];
  notice: string;
}

export interface CreateDispatchRequest {
  emergencyId: string;
  hospitalId?: string;
  ambulanceId?: string;
}

export interface AmbulanceUnit extends AmbulanceRecommendation {}

// ============ AUTHENTICATION APIs ============

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error(`Login failed: ${response.statusText}`);
  }
  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("userId", data.userId);
  localStorage.setItem("userRole", data.role);
  if (data.hospitalId) localStorage.setItem("hospitalId", data.hospitalId); else localStorage.removeItem("hospitalId");
  localStorage.setItem("userEmail", data.email);
  return data;
}

export async function register(userData: RegisterRequest): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error(`Registration failed: ${response.statusText}`);
  }
  return response.json();
}

export function logout(): void {
  localStorage.removeItem("token");
}

export function getToken(): string | null {
  return localStorage.getItem("token");
}

// Helper to add auth header
function getHeaders(): HeadersInit {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

// ============ EMERGENCY APIs ============

export async function reportEmergency(emergency: EmergencyReport): Promise<EmergencyReport> {
  const response = await fetch(`${API_BASE_URL}/emergency/report`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(emergency),
  });
  if (!response.ok) {
    throw new Error(`Emergency report failed: ${response.statusText}`);
  }
  return response.json();
}

export async function getAllEmergencies(): Promise<EmergencyReport[]> {
  const response = await fetch(`${API_BASE_URL}/emergency/all`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch emergencies: ${response.statusText}`);
  }
  return response.json();
}

export async function getEmergency(emergencyId: string): Promise<EmergencyReport> {
  const response = await fetch(`${API_BASE_URL}/emergency/${emergencyId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch emergency: ${response.statusText}`);
  }
  return response.json();
}

export async function triageEmergency(emergencyId: string, triage: TriageRequest): Promise<EmergencyReport> {
  const response = await fetch(`${API_BASE_URL}/emergency/${emergencyId}/triage`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(triage) });
  if (!response.ok) throw new Error(`Triage could not be saved: ${response.statusText}`);
  return response.json();
}

export async function getDispatchRecommendations(emergencyId: string): Promise<DispatchRecommendations> {
  const response = await fetch(`${API_BASE_URL}/emergency/${emergencyId}/recommendations`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not match response resources: ${response.statusText}`);
  return response.json();
}

export async function getUserEmergencies(userId: string): Promise<EmergencyReport[]> {
  const response = await fetch(`${API_BASE_URL}/emergency/user/my-reports`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch user emergencies: ${response.statusText}`);
  }
  return response.json();
}

export async function acknowledgeEmergency(emergencyId: string): Promise<EmergencyReport> {
  const response = await fetch(`${API_BASE_URL}/emergency/${emergencyId}/acknowledge`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to acknowledge emergency: ${response.statusText}`);
  }
  return response.json();
}

export async function updateEmergencyStatus(
  emergencyId: string,
  status: string
): Promise<EmergencyReport> {
  const response = await fetch(`${API_BASE_URL}/emergency/${emergencyId}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to update emergency status: ${response.statusText}`);
  }
  return response.json();
}

// ============ HOSPITAL APIs ============

export async function addHospital(hospital: Hospital): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/add`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(hospital),
  });
  if (!response.ok) {
    throw new Error(`Failed to add hospital: ${response.statusText}`);
  }
  return response.json();
}

export async function updateHospitalLocation(hospitalId: string, latitude: number, longitude: number): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}/location?latitude=${latitude}&longitude=${longitude}`, { method: "PUT", headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not update hospital location: ${response.statusText}`);
  return response.json();
}
export async function updateHospitalServices(hospitalId: string, services: string[]): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}/services`, { method: "PUT", headers: getHeaders(), body: JSON.stringify(services) });
  if (!response.ok) throw new Error(`Could not update hospital services: ${response.statusText}`);
  return response.json();
}

export async function getAmbulances(): Promise<AmbulanceUnit[]> {
  const response = await fetch(`${API_BASE_URL}/hospital/ambulances`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not load ambulance units: ${response.statusText}`);
  return response.json();
}

export async function addAmbulance(ambulance: Omit<AmbulanceUnit, "id" | "status" | "distanceKm" | "updatedAt" | "locationUpdatedAt">): Promise<AmbulanceUnit> {
  const response = await fetch(`${API_BASE_URL}/hospital/ambulances`, { method: "POST", headers: getHeaders(), body: JSON.stringify(ambulance) });
  if (!response.ok) throw new Error(`Could not add ambulance unit: ${response.statusText}`);
  return response.json();
}

export async function updateAmbulanceStatus(ambulanceId: string, status: string): Promise<AmbulanceUnit> {
  const response = await fetch(`${API_BASE_URL}/hospital/ambulances/${ambulanceId}/status?status=${encodeURIComponent(status)}`, { method: "PUT", headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not update ambulance status: ${response.statusText}`);
  return response.json();
}

export async function updateAmbulanceLocation(ambulanceId: string, latitude: number, longitude: number): Promise<AmbulanceUnit> {
  const response = await fetch(`${API_BASE_URL}/hospital/ambulances/${ambulanceId}/location?latitude=${latitude}&longitude=${longitude}`, { method: "PUT", headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not update ambulance location: ${response.statusText}`);
  return response.json();
}

export async function getAllHospitals(): Promise<Hospital[]> {
  const response = await fetch(`${API_BASE_URL}/hospital/all`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch hospitals: ${response.statusText}`);
  }
  return response.json();
}

export async function getHospital(hospitalId: string): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch hospital: ${response.statusText}`);
  }
  return response.json();
}

export async function findNearestHospital(
  latitude: number,
  longitude: number
): Promise<Hospital> {
  const response = await fetch(
    `${API_BASE_URL}/hospital/nearest?latitude=${latitude}&longitude=${longitude}`,
    { headers: getHeaders() }
  );
  if (!response.ok) {
    throw new Error(`Failed to find nearest hospital: ${response.statusText}`);
  }
  return response.json();
}

export async function updateHospitalStatus(
  hospitalId: string,
  status: string
): Promise<Hospital> {
  const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to update hospital status: ${response.statusText}`);
  }
  return response.json();
}

export async function updateHospitalResources(
  hospitalId: string,
  beds: number,
  icu: number,
  cardiac: number,
  ambulances: number
): Promise<Hospital> {
  const response = await fetch(
    `${API_BASE_URL}/hospital/${hospitalId}/resources?beds=${beds}&icu=${icu}&cardiac=${cardiac}&ambulances=${ambulances}`,
    {
      method: "PUT",
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update hospital resources: ${response.statusText}`);
  }
  return response.json();
}

// ============ VOLUNTEER TASK APIs ============

export async function createVolunteerTask(task: VolunteerTask): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(task),
  });
  if (!response.ok) {
    throw new Error(`Failed to create volunteer task: ${response.statusText}`);
  }
  return response.json();
}

export async function getVolunteerTask(taskId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch volunteer task: ${response.statusText}`);
  }
  return response.json();
}

export async function getAllVolunteerTasks(): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/all`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch volunteer tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function getVolunteerAccounts(): Promise<VolunteerAccount[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/volunteers`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Failed to fetch volunteer accounts: ${response.statusText}`);
  return response.json();
}

export async function getVolunteerTasksByStatus(status: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/status/${status}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch volunteer tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function getVolunteerTasksByEmergency(emergencyId: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/emergency/${emergencyId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch emergency volunteer tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function getVolunteerTasksByLocation(location: string): Promise<VolunteerTask[]> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/location/${location}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch location volunteer tasks: ${response.statusText}`);
  }
  return response.json();
}

export async function assignVolunteerToTask(taskId: string, volunteerId: string): Promise<VolunteerTask> {
  const response = await fetch(
    `${API_BASE_URL}/volunteer/task/${taskId}/assign/${volunteerId}`,
    {
      method: "PUT",
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to assign volunteer: ${response.statusText}`);
  }
  return response.json();
}

export async function updateVolunteerTaskStatus(
  taskId: string,
  status: string
): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/status?status=${status}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to update task status: ${response.statusText}`);
  }
  return response.json();
}

export async function completeVolunteerTask(taskId: string): Promise<VolunteerTask> {
  const response = await fetch(`${API_BASE_URL}/volunteer/task/${taskId}/complete`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to complete task: ${response.statusText}`);
  }
  return response.json();
}

// ============ RESCUE MISSION APIs ============

export async function createRescueMission(mission: CreateDispatchRequest): Promise<RescueMission> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/create`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(mission),
  });
  if (!response.ok) {
    let detail = "";
    try {
      const body = await response.json() as { error?: string; message?: string };
      detail = body.error || body.message || "";
    } catch {
      detail = await response.text().catch(() => "");
    }
    throw new Error(`Failed to create response offer (${response.status})${detail ? `: ${detail}` : `: ${response.statusText || "check backend logs"}`}`);
  }
  return response.json();
}

export async function recordMissionResponse(missionId: string, side: "team" | "hospital", accepted: boolean): Promise<RescueMission> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/${missionId}/${side}-response?accepted=${accepted}`, { method: "POST", headers: getHeaders() });
  if (!response.ok) throw new Error(`Could not record ${side} decision: ${response.statusText}`);
  return response.json();
}

export async function getActiveMissions(): Promise<RescueMission[]> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/active`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch active missions: ${response.statusText}`);
  }
  return response.json();
}

export async function getMissionsByStatus(status: string): Promise<RescueMission[]> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/status/${status}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch missions by status: ${response.statusText}`);
  }
  return response.json();
}

export async function getRescueMission(missionId: string): Promise<RescueMission> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/${missionId}`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch rescue mission: ${response.statusText}`);
  }
  return response.json();
}

export async function updateRescueMissionStatus(
  missionId: string,
  status: string
): Promise<RescueMission> {
  const response = await fetch(
    `${API_BASE_URL}/rescue/mission/${missionId}/status?status=${status}`,
    {
      method: "PUT",
      headers: getHeaders(),
    }
  );
  if (!response.ok) {
    throw new Error(`Failed to update mission status: ${response.statusText}`);
  }
  return response.json();
}

export async function updateMissionETA(missionId: string, eta: number): Promise<RescueMission> {
  const response = await fetch(`${API_BASE_URL}/rescue/mission/${missionId}/eta?eta=${eta}`, {
    method: "PUT",
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to update mission ETA: ${response.statusText}`);
  }
  return response.json();
}

// ============ ADMIN DASHBOARD APIs ============

export async function getAdminStats(): Promise<AdminStats> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch admin stats: ${response.statusText}`);
  }
  return response.json();
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/users`, { headers: getHeaders() });
  if (!response.ok) throw new Error(`Failed to fetch users: ${response.statusText}`);
  return response.json();
}

export async function assignHospitalToUser(userId: string, hospitalId: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/users/${userId}/hospital?hospitalId=${encodeURIComponent(hospitalId)}`, { method: "PUT", headers: getHeaders() });
  if (!response.ok) throw new Error(`Failed to assign hospital: ${response.statusText}`);
  return response.json();
}
export async function updateUserRole(userId: string, role: string): Promise<AdminUser> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/users/${userId}/role?role=${encodeURIComponent(role)}`, { method: "PUT", headers: getHeaders() });
  if (!response.ok) throw new Error(`Failed to update user role: ${response.statusText}`);
  return response.json();
}

export async function getVolunteersDashboard(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/volunteers`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch volunteers dashboard: ${response.statusText}`);
  }
  return response.json();
}

export async function getSuppliesDashboard(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/supplies`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch supplies dashboard: ${response.statusText}`);
  }
  return response.json();
}

export async function getAIMetrics(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/ai/metrics`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch AI metrics: ${response.statusText}`);
  }
  return response.json();
}

export async function getSystemHealth(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard/health`, {
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch system health: ${response.statusText}`);
  }
  return response.json();
}

// ============ EXPORT DEFAULT ============

export default {
  // Auth
  login,
  register,
  logout,
  getToken,
  // Emergency
  reportEmergency,
  getAllEmergencies,
  getEmergency,
  getUserEmergencies,
  acknowledgeEmergency,
  updateEmergencyStatus,
  // Hospital
  addHospital,
  getAllHospitals,
  getHospital,
  findNearestHospital,
  updateHospitalStatus,
  updateHospitalResources,
  // Volunteer
  createVolunteerTask,
  getVolunteerTask,
  getAllVolunteerTasks,
  getVolunteerTasksByStatus,
  getVolunteerTasksByEmergency,
  getVolunteerTasksByLocation,
  assignVolunteerToTask,
  updateVolunteerTaskStatus,
  completeVolunteerTask,
  // Rescue
  createRescueMission,
  getActiveMissions,
  getMissionsByStatus,
  getRescueMission,
  updateRescueMissionStatus,
  updateMissionETA,
  // Admin
  getAdminStats,
  getVolunteersDashboard,
  getSuppliesDashboard,
  getAIMetrics,
  getSystemHealth,
};
