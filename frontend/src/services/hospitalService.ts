export type Hospital = {
  id: string;
  name: string;
  bedsAvailable: number;
  icuAvailable: number;
  ambulances: number;
  distanceKm?: number;
};

export type HospitalStatus = "ALERT_RECEIVED" | "PREPARING" | "PATIENT_RECEIVED" | "TREATMENT_STARTED";

export function findNearestHospital(location?: string): Hospital {
  // static sample list — replace with real API integration
  const list: Hospital[] = [
    { id: "1", name: "Apollo", bedsAvailable: 2, icuAvailable: 0, ambulances: 1, distanceKm: 12 },
    { id: "2", name: "Yashoda", bedsAvailable: 10, icuAvailable: 2, ambulances: 3, distanceKm: 5 },
    { id: "3", name: "Care", bedsAvailable: 1, icuAvailable: 0, ambulances: 0, distanceKm: 20 },
  ];
  // choose the hospital with most beds available (simple heuristic)
  return list.reduce((best, h) => (h.bedsAvailable > best.bedsAvailable ? h : best), list[0]);
}

export function startHospitalFlow(onUpdate: (status: HospitalStatus, detail?: any) => void) {
  // simulate the hospital lifecycle
  onUpdate("ALERT_RECEIVED");
  const timers: number[] = [];

  timers.push(
    window.setTimeout(() => {
      onUpdate("PREPARING");
    }, 5000),
  );

  timers.push(
    window.setTimeout(() => {
      onUpdate("PATIENT_RECEIVED");
    }, 10000),
  );

  timers.push(
    window.setTimeout(() => {
      onUpdate("TREATMENT_STARTED");
    }, 15000),
  );

  return () => timers.forEach((t) => window.clearTimeout(t));
}
