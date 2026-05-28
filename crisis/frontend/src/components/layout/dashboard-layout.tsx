import { Link } from "react-router-dom";
import { Bell, Siren } from "lucide-react";
import type { ReactNode } from "react";
import { AppSidebar, MobileSidebarNav } from "./app-sidebar";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-navy-950">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-white/5 bg-navy-950/80 backdrop-blur flex items-center justify-between px-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-critical/10 border border-critical/20">
              <span className="size-1.5 rounded-full bg-critical animate-pulse-critical" />
              <span className="text-[10px] font-mono font-bold text-critical uppercase tracking-wider">
                3 Critical
              </span>
            </div>
            <span className="hidden sm:inline text-[10px] font-mono text-muted-foreground uppercase">
              Region 4-Delta · Cyclone Class III
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-white/5 relative">
              <Bell className="size-4" />
              <span className="absolute top-1.5 right-1.5 size-1.5 bg-critical rounded-full" />
            </button>
            <Link
              to="/sos"
              className="px-3 py-1.5 bg-critical text-white text-xs font-bold uppercase tracking-widest rounded-sm hover:brightness-110 transition-all inline-flex items-center gap-1.5"
            >
              <Siren className="size-3" />
              SOS
            </Link>
            <div className="h-7 w-7 rounded-full bg-tracking/20 border border-tracking/30 grid place-items-center text-[10px] font-bold text-tracking">
              CC
            </div>
          </div>
        </header>
        <MobileSidebarNav />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
