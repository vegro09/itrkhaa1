import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Lang = "ar" | "en";
export type Habit = { id: string; label: string; locked: boolean };
export type Rating = "excellent" | "good" | "struggling" | "relapsed";
export type Attempt = { startedAt: number; endedAt: number };

export type AppState = {
  lang: Lang;
  theme: "light" | "dark";
  authenticated: boolean;
  authType: "anonymous" | "email" | null;
  username: string;
  userPin: string;
  userEmail: string;
  onboarded: boolean;
  gender: "male" | "female" | null;
  age: string;
  target: string | null;
  duration: string | null;
  frequency: number;
  triggers: string[];
  preEmotions: string[];
  postEmotions: string[];
  damage: string[];
  attempts: string | null;
  motivation: string | null;
  habits: Habit[];
  nickname: string;
  tone: "empathetic" | "scientific" | "strict";
  hakeemTone: "empathetic" | "scientific" | "strict";
  hakeemLength: "short" | "medium" | "detailed";
  pledgeSignature: string | null;
  pledgeReasons: string;
  pledgeImpacts: string;
  pledgeGoals: string;
  pledgeEmergencyPlan: string;
  timePerSession: number;
  sessionsPerWeek: number;
  lives: number;
  xp: number;
  startedAt: number;
  /** ISO date -> number of habits completed that day */
  history: Record<string, number>;
  /** ISO date -> self rating for that day */
  ratings: Record<string, Rating>;
  /** past 3-strike cycles */
  attemptsLog: Attempt[];
  /** ISO date of the last claimed daily check-in */
  lastCheckIn: string | null;
  /** habit ids completed today */
  todayDone: string[];
  todayKey: string;
};

export const todayISO = (d: Date = new Date()) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

export const defaultState: AppState = {
  lang: "ar",
  theme: "light",
  authenticated: false,
  authType: null,
  username: "",
  userPin: "",
  userEmail: "",
  onboarded: false,
  gender: null,
  age: "",
  target: null,
  duration: null,
  frequency: 3,
  triggers: [],
  preEmotions: [],
  postEmotions: [],
  damage: [],
  attempts: null,
  motivation: null,
  habits: [],
  nickname: "",
  tone: "empathetic",
  hakeemTone: "empathetic",
  hakeemLength: "medium",
  pledgeSignature: null,
  pledgeReasons: "",
  pledgeImpacts: "",
  pledgeGoals: "",
  pledgeEmergencyPlan: "",
  timePerSession: 0,
  sessionsPerWeek: 3,
  lives: 3,
  xp: 0,
  startedAt: Date.now(),
  history: {},
  ratings: {},
  attemptsLog: [],
  lastCheckIn: null,

  todayDone: [],
  todayKey: todayISO(),
};

const KEY = "leave-it:v1";

type Ctx = {
  state: AppState;
  ready: boolean;
  set: (patch: Partial<AppState>) => void;
  reset: () => void;
};

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = { ...defaultState, ...(JSON.parse(raw) as Partial<AppState>) };
        if (parsed.todayKey !== todayISO()) {
          parsed.todayKey = todayISO();
          parsed.todayDone = [];
        }
        setState(parsed);
      }
    } catch {
      /* ignore corrupted storage */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(KEY, JSON.stringify(state));
  }, [state, ready]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.documentElement.classList.toggle("dark", state.theme === "dark");
  }, [state.lang, state.theme]);

  const value = useMemo<Ctx>(
    () => ({
      state,
      ready,
      set: (patch) => setState((s) => ({ ...s, ...patch })),
      reset: () => setState({ ...defaultState, startedAt: Date.now() }),
    }),
    [state, ready],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
