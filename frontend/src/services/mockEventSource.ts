export type EventPayload = {
  event: string;
  severity?: "LOW" | "MEDIUM" | "HIGH";
  injured?: number;
  location?: string;
  includeVolunteers?: boolean;
  multipleTeams?: boolean;
  [k: string]: any;
};

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
