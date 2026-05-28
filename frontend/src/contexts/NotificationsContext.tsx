import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  startMockEventSource,
  stopMockEventSource,
  EventPayload,
} from "../services/mockEventSource";

export type Role = "rescue" | "hospital" | "admin" | "volunteer" | "ngo";

export type Notification = {
  id: string;
  event: EventPayload;
  roles: Role[];
  receivedAt: string;
  read?: boolean;
};

type Subscriber = (notifications: Notification[]) => void;

type NotificationsContextValue = {
  notifications: Notification[];
  subscribe: (role: Role, cb: Subscriber) => () => void;
  ack: (id: string) => void;
};

const NotificationsContext = createContext<NotificationsContextValue | null>(null);

function decideRolesForEvent(e: EventPayload): Role[] {
  // basic rule set that mirrors the enterprise flow described by the user
  const roles = new Set<Role>();
  const name = (e.event || "").toString().toUpperCase();

  if (name.includes("MEDICAL") || name.includes("INJURED") || e.severity === "HIGH") {
    roles.add("rescue");
    roles.add("hospital");
    roles.add("admin");
    // volunteers may be relevant for medical emergencies but optional
    if (e.includeVolunteers) roles.add("volunteer");
    return Array.from(roles);
  }

  if (name.includes("RESOURCE_SUPPORT") || name.includes("FOOD") || name.includes("SHELTER")) {
    roles.add("volunteer");
    roles.add("admin");
    if (e.multipleTeams) roles.add("ngo");
    return Array.from(roles);
  }

  // default rescue notification for SOS-type events
  roles.add("rescue");
  roles.add("admin");
  if (e.includeVolunteers) roles.add("volunteer");
  return Array.from(roles);
}

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const subs = useRef<Map<Role, Set<Subscriber>>>(new Map());

  useEffect(() => {
    function onEvent(e: EventPayload) {
      const roles = decideRolesForEvent(e);
      const n: Notification = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        event: e,
        roles,
        receivedAt: new Date().toISOString(),
      };
      setNotifications((prev) => {
        const next = [n, ...prev];
        // notify subscribers for each role
        roles.forEach((r) => {
          const set = subs.current.get(r);
          if (set) set.forEach((cb) => cb(next));
        });
        return next;
      });
    }

    startMockEventSource(onEvent);
    return () => stopMockEventSource();
  }, []);

  function subscribe(role: Role, cb: Subscriber) {
    let set = subs.current.get(role);
    if (!set) {
      set = new Set();
      subs.current.set(role, set);
    }
    set.add(cb);
    // immediately call with current notifications filtered for this role
    cb(notifications.filter((n) => n.roles.includes(role)));
    return () => set && set.delete(cb);
  }

  function ack(id: string) {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }

  return (
    <NotificationsContext.Provider value={{ notifications, subscribe, ack }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotificationsContext() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error("useNotificationsContext must be used inside NotificationsProvider");
  return ctx;
}

export function useRoleNotifications(role: Role) {
  const ctx = useNotificationsContext();
  const [list, setList] = useState<Notification[]>(() => ctx.notifications.filter((n) => n.roles.includes(role)));

  useEffect(() => {
    return ctx.subscribe(role, setList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  return { list, ack: ctx.ack };
}

export default NotificationsProvider;
