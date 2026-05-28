import { Link } from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  Ambulance,
  Brain,
  Building2,
  Cpu,
  Globe2,
  HeartPulse,
  Radio,
  Satellite,
  ShieldAlert,
  Siren,
  Users,
  Waves,
  Flame,
  Wind,
} from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-navy-950 text-foreground selection:bg-tracking/30">
      <SiteNav />
      <Hero />
      <TelemetryStrip />
      <DashboardPreview />
      <CapabilitiesSection />
      <ModulesSection />
      <ImpactBand />
      <SiteFooter />
    </div>
  );
}

function SiteNav() {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-navy-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="font-mono font-bold tracking-tighter text-lg">
            SENTINEL<span className="text-critical">.</span>OS
          </Link>
          <div className="hidden md:flex gap-6 text-sm font-medium text-muted-foreground">
            <a href="#operations" className="hover:text-foreground transition-colors">
              Operations
            </a>
            <a href="#modules" className="hover:text-foreground transition-colors">
              Modules
            </a>
            <a href="#intelligence" className="hover:text-foreground transition-colors">
              Intelligence
            </a>
            <a href="#impact" className="hover:text-foreground transition-colors">
              Impact
            </a>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          <Link
            to="/login"
            className="hidden sm:inline-flex px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 border border-white/10 text-foreground text-xs font-bold uppercase tracking-widest rounded-sm hover:bg-white/5 transition-all"
          >
            Dashboard
          </Link>
          <Link
            to="/sos"
            className="px-4 py-2 bg-critical text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all inline-flex items-center gap-2"
          >
            <Siren className="size-3.5" />
            Report Emergency
          </Link>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <header className="relative pt-24 pb-16 px-6 max-w-7xl mx-auto">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-critical/10 border border-critical/20 mb-8">
        <span className="size-1.5 rounded-full bg-critical animate-pulse-critical" />
        <span className="text-[10px] font-mono font-bold text-critical uppercase tracking-wider">
          Active Alert · Region 4-Delta · Cyclone Class III
        </span>
      </div>
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-8 text-balance leading-[0.9]">
        COORDINA&shy;TION AT THE SPEED OF <span className="text-muted-foreground">CRISIS.</span>
      </h1>
      <p className="max-w-2xl text-lg sm:text-xl text-muted-foreground leading-relaxed text-pretty">
        Next-generation disaster response powered by distributed intelligence. We integrate citizen
        SOS, field telemetry, AI severity modeling, and multi-agency logistics into a single unified
        command layer — for floods, fires, earthquakes, and cyclones.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link
          to="/sos"
          className="px-5 py-3 bg-critical text-white text-sm font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all inline-flex items-center gap-2"
        >
          <Siren className="size-4" /> Report Emergency
        </Link>
        <Link
          to="/volunteer"
          className="px-5 py-3 border border-white/15 text-foreground text-sm font-bold uppercase tracking-widest rounded-sm hover:bg-white/5 transition-all"
        >
          Join as Volunteer
        </Link>
        <Link
          to="/dashboard"
          className="px-5 py-3 text-muted-foreground hover:text-foreground text-sm font-bold uppercase tracking-widest rounded-sm transition-all"
        >
          Open Dashboard →
        </Link>
      </div>
    </header>
  );
}

function TelemetryStrip() {
  const stats = [
    { label: "Active Emergencies", value: "142", tone: "text-critical" },
    { label: "Teams Deployed", value: "891", suffix: "/1.2k" },
    { label: "Medical Capacity", value: "84%", tone: "text-warning" },
    { label: "Est. Lives Saved", value: "12,402", tone: "text-resolved" },
  ];
  return (
    <div className="border-y border-white/5 bg-navy-900/50" id="operations">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {stats.map((s) => (
          <div key={s.label} className="p-6">
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-1">
              {s.label}
            </div>
            <div className={`text-3xl font-mono font-bold ${s.tone ?? ""}`}>
              {s.value}
              {s.suffix && <span className="text-sm text-muted-foreground ml-1">{s.suffix}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardPreview() {
  return (
    <section className="p-6 max-w-[1600px] mx-auto py-16" id="intelligence">
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 bg-navy-900 rounded-lg border border-white/5 overflow-hidden relative min-h-[600px]">
          <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />
          <div className="absolute top-0 left-0 w-full h-0.5 bg-tracking/30 animate-scanline" />

          <TacticalMap />

          <div className="absolute bottom-6 left-6 right-6 flex gap-4">
            <div className="flex-1 p-4 rounded-md bg-navy-950/90 border border-white/10 backdrop-blur-sm">
              <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
                Resource Density
              </div>
              <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-tracking w-[65%]" />
              </div>
            </div>
            <div className="flex-1 p-4 rounded-md bg-navy-950/90 border border-white/10 backdrop-blur-sm">
              <div className="text-[10px] font-mono text-muted-foreground uppercase mb-2">
                Severity Gradient
              </div>
              <div className="h-1.5 w-full bg-gradient-to-r from-resolved via-warning to-critical rounded-full" />
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-navy-900 rounded-lg border border-white/5 p-6 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-mono text-sm font-bold uppercase tracking-wider">
                Intelligence Feed
              </h3>
              <span className="px-2 py-0.5 rounded-sm bg-critical/20 text-critical text-[10px] font-bold">
                LIVE
              </span>
            </div>
            <div className="space-y-6">
              <TimelineItem
                tone="critical"
                time="14:22:04 // SOS RECV"
                title="Flash Flood: Sector G-9"
                body="AI Detect: 12 potential victims identified via satellite thermal scan."
              />
              <TimelineItem
                tone="warning"
                time="14:18:12 // LOGISTICS"
                title="Hospital Capacity Alert"
                body="St. Jude Medical Center reaching 95% occupancy. Rerouting incoming."
              />
              <TimelineItem
                tone="tracking"
                time="14:10:45 // DEPLOYMENT"
                title="Air Rescue Alpha Launched"
                body="3 rotary assets en route to primary LZ in coastal district."
              />
              <TimelineItem
                tone="resolved"
                time="13:54:00 // RESOLVED"
                title="Structure Fire Extinguished"
                body="Site secured by Unit-7. Zero casualties confirmed."
              />
            </div>
          </div>

          <div className="bg-tracking/10 border border-tracking/20 rounded-lg p-6">
            <div className="flex gap-4 items-start">
              <div className="p-2 bg-tracking/20 rounded text-tracking">
                <div className="size-4 border-2 border-current rounded-full border-t-transparent animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-tracking mb-1 uppercase tracking-tighter">
                  AI Analysis in Progress
                </h4>
                <p className="text-xs text-muted-foreground leading-snug">
                  Predicting secondary surge risks based on current rainfall telemetry.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TacticalMap() {
  // SVG tactical map mock — concentric grid, hazard zones, pulsing markers.
  return (
    <div className="relative w-full h-full min-h-[600px]">
      <svg viewBox="0 0 800 600" className="absolute inset-0 w-full h-full">
        <defs>
          <radialGradient id="critGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.645 0.22 25)" stopOpacity="0.6" />
            <stop offset="100%" stopColor="oklch(0.645 0.22 25)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="warnGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* concentric grid lines */}
        {[0.2, 0.35, 0.5, 0.65, 0.8].map((r) => (
          <circle
            key={r}
            cx="400"
            cy="300"
            r={r * 300}
            fill="none"
            stroke="oklch(0.7 0.16 245)"
            strokeOpacity="0.08"
            strokeWidth="1"
          />
        ))}
        {/* radial axis */}
        {[0, 45, 90, 135].map((deg) => (
          <line
            key={deg}
            x1="400"
            y1="300"
            x2={400 + 240 * Math.cos((deg * Math.PI) / 180)}
            y2={300 + 240 * Math.sin((deg * Math.PI) / 180)}
            stroke="oklch(0.7 0.16 245)"
            strokeOpacity="0.08"
          />
        ))}
        {/* hazard zones */}
        <circle cx="280" cy="220" r="90" fill="url(#critGlow)" />
        <circle cx="540" cy="380" r="70" fill="url(#warnGlow)" />
        <circle cx="620" cy="180" r="50" fill="url(#warnGlow)" />
        {/* route */}
        <path
          d="M 120 480 Q 280 350 400 300 T 680 200"
          fill="none"
          stroke="oklch(0.7 0.16 245)"
          strokeOpacity="0.5"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />
      </svg>

      {/* Pulsing markers */}
      <PulseMarker top="35%" left="32%" tone="critical" />
      <PulseMarker top="62%" left="65%" tone="warning" />
      <PulseMarker top="28%" left="76%" tone="warning" />
      <PulseMarker top="50%" left="50%" tone="tracking" />
      <PulseMarker top="78%" left="18%" tone="resolved" />

      <div className="absolute top-4 left-4 text-[10px] font-mono uppercase tracking-[0.15em] text-muted-foreground">
        Tactical Engine · Live Feed
      </div>
      <div className="absolute top-4 right-4 text-[10px] font-mono uppercase tracking-[0.15em] text-tracking">
        ◉ STREAMING · 1.2k events/s
      </div>
    </div>
  );
}

function PulseMarker({
  top,
  left,
  tone,
}: {
  top: string;
  left: string;
  tone: "critical" | "warning" | "resolved" | "tracking";
}) {
  const color = {
    critical: "bg-critical text-critical",
    warning: "bg-warning text-warning",
    resolved: "bg-resolved text-resolved",
    tracking: "bg-tracking text-tracking",
  }[tone];
  const [bg] = color.split(" ");
  return (
    <div className="absolute" style={{ top, left }}>
      <div className="relative">
        <div className={`size-2.5 ${bg} rounded-full relative z-10`} />
        <div
          className={`absolute inset-0 ${bg} rounded-full animate-ping-ring`}
          style={{ opacity: 0.6 }}
        />
      </div>
    </div>
  );
}

function TimelineItem({
  tone,
  time,
  title,
  body,
}: {
  tone: "critical" | "warning" | "resolved" | "tracking";
  time: string;
  title: string;
  body: string;
}) {
  const tones = {
    critical: { dot: "bg-critical", border: "border-critical/30" },
    warning: { dot: "bg-warning", border: "border-white/10" },
    resolved: { dot: "bg-resolved", border: "border-white/10" },
    tracking: { dot: "bg-tracking", border: "border-white/10" },
  } as const;
  const t = tones[tone];
  return (
    <div className={`relative pl-6 border-l ${t.border}`}>
      <div className={`absolute -left-[4.5px] top-1 size-2 rounded-full ${t.dot}`} />
      <div className="text-[10px] font-mono text-muted-foreground mb-1">{time}</div>
      <div className="text-sm font-bold mb-1">{title}</div>
      <p className="text-xs text-muted-foreground">{body}</p>
    </div>
  );
}

function CapabilitiesSection() {
  const items = [
    {
      icon: Brain,
      title: "AI Severity Modeling",
      body: "Multimodal models triage incoming SOS, predict surge zones, and auto-summarize chaos into ranked actions.",
    },
    {
      icon: Satellite,
      title: "Field Telemetry Mesh",
      body: "Unified ingest from satellites, IoT sensors, weather grids, and rescue team beacons via Kafka streams.",
    },
    {
      icon: Globe2,
      title: "Auto Translation",
      body: "Real-time language detection across SOS reports. No victim is left unheard because of language barriers.",
    },
    {
      icon: Cpu,
      title: "Duplicate Detection",
      body: "Clustering eliminates noise — one incident, one mission, one truth across all field reporters.",
    },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-24">
      <div className="flex flex-col md:flex-row gap-12 md:items-end justify-between mb-12">
        <div className="max-w-2xl">
          <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-3">
            // Intelligence Layer
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-balance">
            Models that read the disaster before humans can.
          </h2>
        </div>
        <p className="max-w-md text-muted-foreground text-pretty">
          Every signal flows through a layered AI pipeline — severity, prediction, deduplication,
          translation — before reaching the controller's screen.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/5 border border-white/5 rounded-lg overflow-hidden">
        {items.map((it) => (
          <div key={it.title} className="bg-navy-950 p-6 group hover:bg-navy-900 transition-colors">
            <it.icon className="size-5 text-tracking mb-6" />
            <h3 className="text-base font-bold mb-2">{it.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ModulesSection() {
  const modules = [
    {
      icon: Siren,
      title: "Citizen SOS",
      desc: "One-tap reporting with GPS, media, AI urgency.",
      to: "/sos",
    },
    {
      icon: ShieldAlert,
      title: "Rescue Team",
      desc: "Missions, route optimization, live status.",
      to: "/rescue",
    },
    {
      icon: HeartPulse,
      title: "Hospital Ops",
      desc: "Bed availability, ICU, incoming alerts.",
      to: "/hospital",
    },
    {
      icon: Users,
      title: "Volunteer & NGO",
      desc: "Assignments, donations, resource flow.",
      to: "/volunteer",
    },
    {
      icon: Brain,
      title: "AI Intelligence",
      desc: "Predictions, summaries, recommendations.",
      to: "/ai",
    },
    {
      icon: Activity,
      title: "Super Admin",
      desc: "Users, events, Kafka, system health.",
      to: "/admin",
    },
  ];
  return (
    <section className="max-w-7xl mx-auto px-6 py-24" id="modules">
      <div className="text-[10px] font-mono text-tracking uppercase tracking-widest mb-3">
        // Operational Modules
      </div>
      <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-12 max-w-2xl text-balance">
        Six surfaces. One coordinated response.
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((m) => (
          <Link
            key={m.title}
            to={m.to}
            className="group p-6 bg-navy-900 border border-white/5 rounded-lg hover:border-tracking/40 transition-all"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="p-2 bg-navy-950 border border-white/5 rounded">
                <m.icon className="size-5 text-tracking" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground group-hover:text-tracking transition-colors">
                OPEN →
              </span>
            </div>
            <h3 className="text-lg font-bold mb-1">{m.title}</h3>
            <p className="text-sm text-muted-foreground">{m.desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ImpactBand() {
  const disasters = [
    { icon: Waves, label: "Floods" },
    { icon: Flame, label: "Wildfires" },
    { icon: AlertTriangle, label: "Earthquakes" },
    { icon: Wind, label: "Cyclones" },
    { icon: Ambulance, label: "Mass Casualty" },
    { icon: Building2, label: "Structural Collapse" },
    { icon: Radio, label: "Blackouts" },
  ];
  return (
    <section className="border-y border-white/5 bg-navy-900/30 py-10 overflow-hidden" id="impact">
      <div className="flex gap-16 animate-marquee whitespace-nowrap">
        {[...disasters, ...disasters].map((d, i) => (
          <div key={i} className="flex items-center gap-3 text-muted-foreground">
            <d.icon className="size-5" />
            <span className="text-sm font-mono uppercase tracking-widest">{d.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
        <div className="max-w-xs">
          <div className="font-mono font-bold tracking-tighter text-xl mb-4">
            SENTINEL<span className="text-critical">.</span>OS
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Standardizing global disaster coordination through open data protocols and autonomous
            intelligence layers.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-16">
          <div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-4">
              Security
            </div>
            <ul className="text-sm space-y-2">
              <li className="text-muted-foreground">FedRAMP High</li>
              <li className="text-muted-foreground">SOC2 Type II</li>
              <li className="text-muted-foreground">GDPR Critical</li>
            </ul>
          </div>
          <div>
            <div className="text-[10px] font-mono text-muted-foreground uppercase mb-4">
              Protocol
            </div>
            <ul className="text-sm space-y-2">
              <li className="text-muted-foreground">OpenTelemetry</li>
              <li className="text-muted-foreground">Satellite API</li>
              <li className="text-muted-foreground">Field Connect</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-mono text-muted-foreground uppercase">
        <span>© 2026 Sentinel Protocol</span>
        <span>Terminal encrypted · Secure channel active</span>
      </div>
    </footer>
  );
}
