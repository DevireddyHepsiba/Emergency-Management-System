import { Link } from "react-router-dom";
import { useState } from "react";
import { Brain, HeartPulse, ShieldAlert, Siren, Users, Building2 } from "lucide-react";

const roles = [
  { id: "admin", title: "Admin", icon: Brain, desc: "Full control plane access" },
  { id: "rescue", title: "Rescue Team", icon: ShieldAlert, desc: "Mission ops & dispatch" },
  { id: "hospital", title: "Hospital", icon: HeartPulse, desc: "Capacity & triage feed" },
  { id: "volunteer", title: "Volunteer", icon: Users, desc: "Field assignments" },
  { id: "ngo", title: "NGO", icon: Building2, desc: "Resources & logistics" },
  { id: "citizen", title: "Citizen", icon: Siren, desc: "Report & track SOS" },
];

export function LoginPage() {
  const [role, setRole] = useState("admin");
  return (
    <div className="min-h-screen bg-navy-950 grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between p-12 border-r border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40" />
        <div className="absolute top-0 left-0 w-full h-0.5 bg-tracking/20 animate-scanline" />
        <Link to="/" className="font-mono font-bold tracking-tighter text-xl relative">
          SENTINEL<span className="text-critical">.</span>OS
        </Link>
        <div className="relative">
          <div className="text-[10px] font-mono text-critical uppercase tracking-widest mb-3">
            // Secure Channel · TLS 1.3 · FedRAMP
          </div>
          <h2 className="text-4xl font-extrabold tracking-tighter mb-4 max-w-md text-balance">
            Authenticate to the command layer.
          </h2>
          <p className="text-muted-foreground text-sm max-w-sm">
            Role-based access to the live disaster response grid. All sessions are encrypted,
            audited, and time-bound.
          </p>
        </div>
        <div className="relative text-[10px] font-mono text-muted-foreground uppercase">
          © 2026 Sentinel Protocol
        </div>
      </div>

      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="font-mono font-bold tracking-tighter text-xl">
              SENTINEL<span className="text-critical">.</span>OS
            </Link>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tighter mb-2">Sign in to command</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Select your role to begin authentication.
          </p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map((r) => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`p-3 rounded-md border text-left transition-all ${
                  role === r.id
                    ? "border-tracking bg-tracking/10"
                    : "border-white/10 hover:border-white/20"
                }`}
              >
                <r.icon
                  className={`size-4 mb-2 ${role === r.id ? "text-tracking" : "text-muted-foreground"}`}
                />
                <div className="text-xs font-bold">{r.title}</div>
                <div className="text-[10px] text-muted-foreground line-clamp-1">{r.desc}</div>
              </button>
            ))}
          </div>

          <form className="space-y-4 bg-navy-900 border border-white/5 rounded-lg p-6">
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                Operator ID / Email
              </label>
              <input
                className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking"
                placeholder="operator@agency.gov"
              />
            </div>
            <div>
              <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block mb-2">
                Passphrase
              </label>
              <input
                type="password"
                className="w-full bg-navy-950 border border-white/10 rounded-md px-3 py-2.5 text-sm focus:outline-none focus:border-tracking"
                placeholder="••••••••••••"
              />
            </div>
            <Link
              to="/dashboard"
              className="block text-center w-full px-4 py-3 bg-critical text-white text-xs font-bold uppercase tracking-widest rounded-md hover:brightness-110 transition-all"
            >
              Authenticate
            </Link>
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/5" />
              <span className="text-[10px] font-mono text-muted-foreground uppercase">or</span>
              <div className="flex-1 h-px bg-white/5" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                className="px-3 py-2.5 border border-white/10 rounded-md text-xs font-bold hover:bg-white/5"
              >
                Google
              </button>
              <button
                type="button"
                className="px-3 py-2.5 border border-white/10 rounded-md text-xs font-bold hover:bg-white/5"
              >
                SSO
              </button>
            </div>
          </form>

          <div className="mt-4 flex justify-between text-xs text-muted-foreground">
            <a href="#" className="hover:text-foreground">
              Forgot passphrase?
            </a>
            <a href="#" className="hover:text-foreground">
              Request access →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
