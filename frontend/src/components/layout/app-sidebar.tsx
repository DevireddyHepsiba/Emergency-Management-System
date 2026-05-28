import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Brain,
  HeartPulse,
  LayoutDashboard,
  ShieldAlert,
  Siren,
  Users,
} from "lucide-react";

const items = [
  { title: "Command", url: "/dashboard", icon: LayoutDashboard },
  { title: "Citizen SOS", url: "/sos", icon: Siren },
  { title: "Rescue Team", url: "/rescue", icon: ShieldAlert },
  { title: "Hospital Ops", url: "/hospital", icon: HeartPulse },
  { title: "Volunteer / NGO", url: "/volunteer", icon: Users },
  { title: "AI Intelligence", url: "/ai", icon: Brain },
  { title: "Super Admin", url: "/admin", icon: Activity },
];

export function AppSidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-white/5 bg-navy-900/40">
      <div className="h-14 flex items-center px-5 border-b border-white/5">
        <Link to="/" className="font-mono font-bold tracking-tighter text-base">
          SENTINEL<span className="text-critical">.</span>OS
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4 mb-2 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Operations
        </div>
        <nav className="space-y-0.5 px-2">
          {items.map((item) => {
            const active = pathname === item.url;
            return (
              <Link
                key={item.url}
                to={item.url}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-tracking/15 text-foreground border-l-2 border-tracking pl-[10px]"
                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                }`}
              >
                <item.icon className="size-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-4 border-t border-white/5">
        <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-resolved">
          <span className="size-1.5 rounded-full bg-resolved animate-pulse-critical" />
          Systems Nominal
        </div>
        <div className="mt-1 text-[10px] font-mono text-muted-foreground">Kafka · 1.2k evt/s</div>
      </div>
    </aside>
  );
}

export function MobileSidebarNav() {
  const { pathname } = useLocation();
  return (
    <div className="md:hidden border-b border-white/5 bg-navy-900/40 overflow-x-auto">
      <div className="flex gap-1 px-3 py-2 min-w-max">
        {items.map((item) => {
          const active = pathname === item.url;
          return (
            <Link
              key={item.url}
              to={item.url}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap ${
                active
                  ? "bg-tracking/15 text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="size-3.5" />
              {item.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
