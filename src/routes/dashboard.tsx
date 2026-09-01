import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ChevronDown,
  Lock,
  Plus,
  Sparkles,
  X,
  ShieldAlert,
  CheckSquare,
  Square,
  AlertTriangle,
} from "lucide-react";
import { useApp, todayISO, type Rating } from "@/lib/app-state";
import { useT } from "@/lib/i18n";
import { PixelHeart } from "@/components/visuals";
import { waethDeck, pick } from "@/lib/content";
import { PledgeDocument } from "@/components/pledge-document";
import { PanicSOS } from "@/components/panic-sos";
import { SettingsBar } from "@/components/settings-bar";
import { RecoveryTracker } from "@/components/recovery-tracker";
import { DailyWisdom } from "@/components/DailyWisdom";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Leave It" },
      {
        name: "description",
        content:
          "Your recovery timer, daily check-in, habits, hearts and a daily Wa'eth reflection.",
      },
      { property: "og:title", content: "Dashboard — Leave It" },
      { property: "og:description", content: "Track your streak, habits and hearts every day." },
    ],
  }),
  component: Dashboard,
});

function useElapsed(from: number) {
  const [now, setNow] = useState(from);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const ms = Math.max(0, now - from);
  const s = Math.floor(ms / 1000);
  return {
    d: Math.floor(s / 86400),
    h: Math.floor((s % 86400) / 3600),
    m: Math.floor((s % 3600) / 60),
    s: s % 60,
  };
}

const pad = (n: number, len = 2) => String(n).padStart(len, "0");

const RATING_COLORS: Record<Rating, string> = {
  excellent: "#2E7D32",
  good: "#D4A373",
  struggling: "#E67E22",
  relapsed: "#810100",
};

/** Sharp geometric hazard accents framing the circular relapse button. */
function HazardRing() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 200"
      className="pointer-events-none absolute inset-0 h-full w-full text-cherry/35"
    >
      <polygon
        points="100,14 160,40 186,100 160,160 100,186 40,160 14,100 40,40"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      />
      <polygon
        points="100,26 152,48 174,100 152,152 100,174 48,152 26,100 48,48"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeDasharray="6 7"
      />
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={i}
          x1="100"
          y1="4"
          x2="100"
          y2="16"
          stroke="currentColor"
          strokeWidth="1.2"
          transform={`rotate(${i * 45} 100 100)`}
        />
      ))}
    </svg>
  );
}

function Dashboard() {
  const { state, set, ready } = useApp();
  const tr = useT(state.lang);
  const navigate = useNavigate();
  const time = useElapsed(state.startedAt);
  const [sheet, setSheet] = useState(false);
  const [modal, setModal] = useState(false);
  const [oathModal, setOathModal] = useState(false);
  const [oathAgreed, setOathAgreed] = useState(false);
  const [sosModal, setSosModal] = useState(false);
  const [xpBurst, setXpBurst] = useState<string | null>(null);
  const [newHabit, setNewHabit] = useState("");

  useEffect(() => {
    if (ready && !state.onboarded) navigate({ to: "/" });
  }, [ready, state.onboarded, navigate]);

  const waeth = waethDeck[new Date().getDate() % waethDeck.length]!;

  const level = Math.floor(state.xp / 100) + 1;
  const levelXp = state.xp % 100;
  const today = todayISO();
  const checkedIn = state.lastCheckIn === today;
  const rating = state.ratings[today] ?? null;

  useEffect(() => {
    try {
      const stored = localStorage.getItem("today_rating_entry");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.date === today && parsed?.value && !state.ratings[today]) {
          set({ ratings: { ...state.ratings, [today]: parsed.value as Rating } });
        }
      }
    } catch {
      /* ignore */
    }
  }, [today]);

  const toggleHabit = (id: string) => {
    const done = state.todayDone.includes(id);
    const todayDone = done ? state.todayDone.filter((x) => x !== id) : [...state.todayDone, id];
    set({
      todayDone,
      todayKey: today,
      xp: Math.max(0, state.xp + (done ? -10 : 10)),
      history: { ...state.history, [today]: todayDone.length },
    });
    if (!done) {
      setXpBurst(id);
      setTimeout(() => setXpBurst(null), 900);
    }
  };

  const claimCheckIn = () => {
    if (checkedIn) return;
    setOathModal(true);
  };

  const confirmOathCheckIn = () => {
    if (!oathAgreed) return;
    set({ lastCheckIn: today, xp: state.xp + 50 });
    setXpBurst("checkin");
    setOathModal(false);
    setOathAgreed(false);
    setTimeout(() => setXpBurst(null), 900);
  };

  const addHabit = () => {
    const label = newHabit.trim();
    if (!label) return;
    set({ habits: [...state.habits, { id: crypto.randomUUID(), label, locked: false }] });
    setNewHabit("");
  };

  const lastStrike = state.lives <= 1;

  const relapse = () => {
    const ratings = { ...state.ratings, [today]: "relapsed" as Rating };
    try {
      localStorage.setItem(
        "today_rating_entry",
        JSON.stringify({ date: today, value: "relapsed", updatedAt: Date.now() })
      );
    } catch {
      /* ignore */
    }
    if (lastStrike) {
      // Third strike: snapshot the attempt, restart the cycle with full hearts.
      set({
        ratings,
        attemptsLog: [...state.attemptsLog, { startedAt: state.startedAt, endedAt: Date.now() }],
        lives: 3,
        startedAt: Date.now(),
        xp: 0,
        todayDone: [],
        todayKey: today,
      });
    } else {
      set({ ratings, lives: Math.max(0, state.lives - 1) }); // timer keeps running
    }
    setModal(false);
  };

  const rate = (value: Rating) => {
    set({ ratings: { ...state.ratings, [today]: value } });
    try {
      localStorage.setItem(
        "today_rating_entry",
        JSON.stringify({ date: today, value, updatedAt: Date.now() })
      );
    } catch {
      /* ignore */
    }
    if (value === "relapsed") {
      setModal(true);
    }
  };

  const ratingOptions: [Rating, string][] = [
    ["excellent", tr("rExcellent")],
    ["good", tr("rGood")],
    ["struggling", tr("rStruggling")],
    ["relapsed", tr("rRelapsed")],
  ];

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-36 pt-8">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs text-noir/45">{tr("greeting")}</p>
          <h1 className="font-display text-xl font-semibold text-maroon">
            {state.nickname || tr("appName")}
          </h1>
        </div>
        <div className="flex items-center gap-1.5" aria-label={tr("livesLeft")}>
          {[0, 1, 2].map((i) => (
            <PixelHeart key={i} filled={i < state.lives} size={26} />
          ))}
        </div>
      </header>

      {/* Hero Recovery Tracker - Conditional Render based on state.trackerType */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-6"
      >
        {state.trackerType === "classic" ? (
          <div className="bento relative overflow-hidden p-7">
            <div aria-hidden className="pointer-events-none absolute -end-16 -top-16 opacity-[0.07]">
              <svg width="220" height="220" viewBox="0 0 220 220" fill="none">
                <circle cx="120" cy="100" r="90" stroke="var(--maroon)" strokeWidth="1.5" />
                <circle cx="150" cy="130" r="70" stroke="var(--cherry-red)" strokeWidth="1.5" />
                <circle cx="100" cy="70" r="45" stroke="var(--maroon)" strokeWidth="1.5" />
              </svg>
            </div>
            <p className="text-xs uppercase tracking-[0.2em] text-noir/45">{tr("streak")}</p>
            <div className="mt-5 flex items-end justify-between gap-2">
              {(
                [
                  [pad(time.d, 3), tr("days")],
                  [pad(time.h), tr("hours")],
                  [pad(time.m), tr("minutes")],
                  [pad(time.s), tr("seconds")],
                ] as const
              ).map(([v, label], i) => (
                <div key={label} className="flex items-end gap-2">
                  <div className="text-center">
                    <div className="font-mono text-4xl font-semibold tabular-nums text-maroon sm:text-5xl">
                      {v}
                    </div>
                    <div className="mt-1 text-[10px] uppercase tracking-widest text-noir/40">
                      {label}
                    </div>
                  </div>
                  {i < 3 && <span className="pb-6 font-mono text-3xl text-cherry/30">:</span>}
                </div>
              ))}
            </div>
            {/* XP progress inside the timer card */}
            <div className="mt-7 border-t border-noir/10 pt-5">
              <div className="flex items-center justify-between text-xs text-noir/45">
                <span>
                  {tr("level")} <span className="font-mono text-cherry">{level}</span>
                </span>
                <span className="font-mono">
                  {state.xp} {tr("xp")}
                </span>
              </div>
              <div
                className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-noir/10"
                role="progressbar"
                aria-valuenow={levelXp}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <motion.div
                  className="h-full rounded-full bg-cherry"
                  animate={{ width: `${levelXp}%` }}
                  transition={{ type: "spring", stiffness: 200, damping: 28 }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-noir/40">
                <span>{state.target}</span>
                <span className="font-mono">
                  {100 - levelXp} {tr("xp")} {tr("toNextLevel")}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <RecoveryTracker
            days={time.d}
            hours={time.h}
            minutes={time.m}
            targetDays={90}
          />
        )}
      </motion.section>

      {/* Daily check-in & Emergency SOS */}
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="relative">
          <button
            onClick={claimCheckIn}
            disabled={checkedIn}
            className={`w-full flex items-center justify-center gap-2 rounded-full px-5 py-4 text-sm font-bold transition-all ${
              checkedIn
                ? "border border-noir/10 bg-card/60 text-noir/40 cursor-not-allowed"
                : "glow-pill bg-cherry text-cotton shadow-[var(--shadow-float)]"
            }`}
          >
            {checkedIn ? tr("checkedIn") : tr("oathButtonLabel")}
            {!checkedIn && <span className="font-mono text-xs opacity-80">{tr("checkInXp")}</span>}
          </button>
          <AnimatePresence>
            {xpBurst === "checkin" && (
              <motion.span
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: 1, y: -30 }}
                exit={{ opacity: 0 }}
                className="pointer-events-none absolute inset-x-0 -top-6 text-center font-mono text-sm font-semibold text-cherry"
              >
                +50 XP
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => setSosModal(true)}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-cherry/80 bg-cherry/10 px-5 py-4 text-sm font-bold text-cherry transition-all hover:bg-cherry hover:text-cotton shadow-sm"
        >
          <ShieldAlert size={18} />
          {tr("sosButton")}
        </button>
      </div>

      {/* Interlocking cards: Wa'eth / relapse housing / daily rating */}
      {/* Dynamic Daily Wisdom (الواعظ) */}
      {!sosModal && (
        <section className="mt-5">
          <DailyWisdom />
        </section>
      )}

      {/* Daily rating & Relapse trigger */}
      {!sosModal && (
        <section className="mt-5">
          <div className="bento p-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-[0.2em] font-bold text-noir/50">
                {tr("rateDay")}
              </p>
              <button
                onClick={() => setModal(true)}
                className="rounded-full bg-cherry/10 border border-cherry/20 px-3.5 py-1 text-xs font-bold text-cherry hover:bg-cherry hover:text-cotton transition-all active:scale-95 shadow-sm cursor-pointer"
              >
                {tr("relapse")}
              </button>
            </div>
            <div className="flex items-center justify-center gap-1.5 w-full max-w-sm mx-auto my-2 p-1">
              {ratingOptions.map(([key, label]) => {
                const isSelected = rating === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => rate(key)}
                    className={`flex-1 aspect-square min-h-[44px] rounded-xl flex items-center justify-center text-white text-xs font-bold transition-all duration-200 border-none outline-none cursor-pointer ${
                      isSelected
                        ? "scale-105 ring-2 ring-white shadow-lg z-10 opacity-100"
                        : "opacity-80 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: RATING_COLORS[key] }}
                  >
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Habits */}
      <section className="mt-5">
        <h2 className="mb-3 px-1 text-sm font-medium text-noir/50">{tr("dailyHabits")}</h2>
        <div className="flex flex-col gap-3">
          {state.habits.map((h) => {
            const done = state.todayDone.includes(h.id);
            return (
              <button
                key={h.id}
                onClick={() => toggleHabit(h.id)}
                className="bento relative flex w-full items-center justify-between gap-3 p-5 text-start"
              >
                <span className="flex min-w-0 items-center gap-2.5">
                  {h.locked && (
                    <Lock size={13} className="shrink-0 text-noir/30" aria-label={tr("locked")} />
                  )}
                  <span
                    className={`truncate text-sm transition-all ${
                      done ? "text-noir/35 line-through" : "text-maroon"
                    }`}
                  >
                    {h.label}
                  </span>
                </span>
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all ${
                    done ? "border-cherry bg-cherry" : "border-noir/15"
                  }`}
                >
                  {done && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="h-2 w-2 rounded-full bg-cotton"
                    />
                  )}
                </span>
                <AnimatePresence>
                  {xpBurst === h.id && (
                    <motion.span
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 1, y: -28 }}
                      exit={{ opacity: 0 }}
                      className="pointer-events-none absolute end-14 top-4 font-mono text-sm font-semibold text-cherry"
                    >
                      +10 XP
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            );
          })}
        </div>

        {/* Add habit */}
        <div className="mt-3 flex gap-2">
          <input
            value={newHabit}
            onChange={(e) => setNewHabit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
            placeholder={tr("habitPh")}
            aria-label={tr("addHabit")}
            className="min-w-0 flex-1 rounded-full border border-noir/10 bg-card/70 px-5 py-3.5 text-sm text-maroon outline-none focus:border-cherry"
          />
          <button
            type="button"
            onClick={addHabit}
            disabled={!newHabit.trim()}
            className="flex h-12 shrink-0 items-center gap-2 rounded-full bg-cherry px-5 text-sm font-medium text-cotton disabled:opacity-40"
          >
            <Plus size={16} />
            {tr("addHabit")}
          </button>
        </div>
      </section>

      {/* Settings Section */}
      <section className="mt-5">
        <SettingsBar defaultExpanded={false} />
      </section>

      {/* Wa'eth bottom sheet */}
      <AnimatePresence>
        {sheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSheet(false)}
              className="fixed inset-0 z-50 bg-noir/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="fixed inset-x-0 bottom-0 z-50 mx-auto max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-t-[32px] border border-noir/10 bg-card p-7 pb-12"
            >
              <div className="mx-auto mb-6 h-1.5 w-12 rounded-full bg-noir/15" />
              <div className="flex items-start justify-between">
                <p className="text-xs uppercase tracking-[0.2em] text-cherry">{tr("waeth")}</p>
                <button onClick={() => setSheet(false)} aria-label={tr("cancel")}>
                  <X size={18} className="text-noir/40" />
                </button>
              </div>
              <p className="mt-4 font-display text-xl leading-relaxed text-maroon">
                {pick(waeth.short, state.lang)}
              </p>
              <p className="mt-5 text-sm leading-loose text-noir/70">
                {pick(waeth.long, state.lang)}
              </p>
              <p className="mt-6 text-xs text-noir/45">{pick(waeth.source, state.lang)}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Relapse modal */}
      <AnimatePresence>
        {modal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-noir/40 px-6 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm rounded-[32px] border border-noir/10 bg-card p-7 text-center"
            >
              <h3 className="font-display text-xl text-maroon">
                {lastStrike ? tr("resetTitle") : tr("relapseTitle")}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-noir/60">
                {lastStrike ? tr("resetBody") : tr("relapseBody")}
              </p>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setModal(false)}
                  className="rounded-full border border-noir/15 py-3.5 text-sm text-maroon"
                >
                  {tr("cancel")}
                </button>
                <button
                  onClick={relapse}
                  className="rounded-full bg-cherry py-3.5 text-sm text-cotton"
                >
                  {lastStrike ? tr("resetConfirm") : tr("confirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mandatory Oath Modal */}
      <AnimatePresence>
        {oathModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-noir/50 px-5 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.92, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-[32px] border border-noir/10 bg-card p-7 text-start space-y-5 shadow-2xl"
            >
              <div className="flex items-center gap-3 border-b border-noir/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cherry/10 text-cherry">
                  <CheckSquare size={22} />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-maroon">{tr("oathTitle")}</h3>
                  <p className="text-xs text-noir/50">{tr("oathSub")}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-cherry/20 bg-cherry/5 p-4 text-center">
                <p className="font-thamanya text-sm font-bold leading-relaxed text-maroon dark:text-[#EDEBDE]">
                  {tr("oathText")}
                </p>
              </div>

              <label
                onClick={() => setOathAgreed(!oathAgreed)}
                className="flex items-start gap-3 cursor-pointer rounded-xl p-3 border border-noir/10 bg-card/50 hover:border-cherry/30"
              >
                <div className="mt-0.5 text-cherry shrink-0">
                  {oathAgreed ? (
                    <CheckSquare size={20} />
                  ) : (
                    <Square size={20} className="text-noir/30" />
                  )}
                </div>
                <span className="text-xs leading-relaxed text-maroon font-medium">
                  {tr("oathCheckbox")}
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setOathModal(false);
                    setOathAgreed(false);
                  }}
                  className="rounded-full border border-noir/15 py-3 text-sm font-semibold text-maroon hover:bg-noir/5"
                >
                  {tr("cancel")}
                </button>
                <button
                  onClick={confirmOathCheckIn}
                  disabled={!oathAgreed}
                  className="rounded-full bg-cherry py-3 text-sm font-semibold text-cotton shadow-[var(--shadow-float)] disabled:opacity-30 disabled:cursor-not-allowed transition-all hover:bg-maroon"
                >
                  {tr("oathConfirm")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full-Screen Emergency SOS Multi-Step Wizard ("زر الفزعة") */}
      <PanicSOS
        isOpen={sosModal}
        onClose={() => setSosModal(false)}
        pledgeText={state.pledgeText}
        escapePlan={state.pledgeEscapePlan}
        signatureDataUrl={state.pledgeSignature}
        nickname={state.nickname}
      />
    </main>
  );
}
