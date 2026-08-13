import { useEffect, useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Plus, Sparkles } from "lucide-react";
import { useApp, type Lang } from "@/lib/app-state";
import { useT } from "@/lib/i18n";
import { AuthLanding } from "@/components/auth-landing";
import { PledgeDocument } from "@/components/pledge-document";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Leave It — Start your recovery journey" },
      {
        name: "description",
        content:
          "Set up your Leave It profile in a few calm steps: habit, triggers, daily tasks and nickname.",
      },
      { property: "og:title", content: "Leave It — Start your recovery journey" },
      {
        property: "og:description",
        content: "A gamified, premium companion for leaving the habit behind.",
      },
    ],
  }),
  component: Onboarding,
});

export type TimeLossInputs = {
  dailyFrequency: number;
  sessionDurationMinutes: number;
  yearsPracticed: number;
  currentAge: number;
};

export function calculateTimeLoss({
  dailyFrequency,
  sessionDurationMinutes,
  yearsPracticed,
  currentAge,
}: TimeLossInputs) {
  const safeFreq = Math.max(0, dailyFrequency || 0);
  const safeMinutes = Math.max(0, sessionDurationMinutes || 0);
  const safeYears = Math.max(0, yearsPracticed || 0);
  const safeAge = Math.max(1, currentAge || 20);

  // 1. Daily Hours Lost
  const dailyHours = (safeMinutes / 60) * safeFreq;

  // 2. Yearly Hours Lost
  const yearlyHours = Math.round(dailyHours * 365);

  // 3. Total Hours Lost So Far
  const totalHoursLostSoFar = dailyHours * 365 * safeYears;

  // 4. Percentage of Total Life Wasted So Far
  const totalLifetimeHours = safeAge * 365 * 24;
  const percentageWasted =
    totalLifetimeHours > 0 ? ((totalHoursLostSoFar / totalLifetimeHours) * 100).toFixed(1) : "0.0";

  // 5. Future Net Years Lost Until Age 80
  const remainingYears = Math.max(0, 80 - safeAge);
  const futureHoursLost = dailyHours * 365 * remainingYears;
  const futureNetYearsLost = (futureHoursLost / (365 * 24)).toFixed(1);

  return {
    dailyHours,
    yearlyHours,
    totalHoursLostSoFar,
    percentageWasted,
    remainingYears,
    futureHoursLost,
    futureNetYearsLost,
  };
}

export function getYearsPracticed(durationStr: string): number {
  if (!durationStr) return 1;
  if (
    durationStr.includes("أكثر") ||
    durationStr.includes("More") ||
    durationStr.includes("٥") ||
    durationStr.includes("5")
  ) {
    return durationStr.includes("أكثر") || durationStr.includes("More") ? 6 : 4;
  }
  if (durationStr.includes("٣") || durationStr.includes("3")) return 3;
  if (durationStr.includes("١") || durationStr.includes("1")) return 2;
  return 1;
}

const opt = (ar: string, en: string) => ({ ar, en });
const L = (o: { ar: string; en: string }, lang: Lang) => (lang === "ar" ? o.ar : o.en);

const TRIGGERS = [
  opt("الوحدة", "Loneliness"),
  opt("الملل", "Boredom"),
  opt("السهر", "Late nights"),
  opt("التوتر", "Stress"),
  opt("الهاتف في السرير", "Phone in bed"),
  opt("مواقع التواصل", "Social media"),
  opt("الفراغ", "Empty time"),
  opt("الحزن", "Sadness"),
];
const PRE = [
  opt("قلق", "Anxious"),
  opt("فراغ", "Empty"),
  opt("إثارة", "Excited"),
  opt("غضب", "Angry"),
  opt("تعب", "Exhausted"),
  opt("حماس مؤقت", "Restless"),
];
const POST = [
  opt("ندم", "Regret"),
  opt("خزي", "Shame"),
  opt("راحة قصيرة", "Brief relief"),
  opt("فراغ أكبر", "Deeper emptiness"),
  opt("كسل", "Sluggish"),
  opt("عزلة", "Isolation"),
];
const DAMAGE = [
  opt("ضعف التركيز", "Weak focus"),
  opt("تأخر النوم", "Poor sleep"),
  opt("انخفاض الثقة", "Low confidence"),
  opt("ضعف العلاقات", "Strained relationships"),
  opt("تراجع الدراسة/العمل", "Work or study decline"),
  opt("بُعد روحي", "Spiritual distance"),
];
const ATTEMPTS = [
  opt("لم أحاول من قبل", "Never tried before"),
  opt("مرة أو مرتين", "Once or twice"),
  opt("عدة محاولات", "Several attempts"),
  opt("محاولات لا تُحصى", "Countless attempts"),
];
const MOTIVATION = [
  opt("دافع ديني", "Faith"),
  opt("صحتي النفسية", "Mental health"),
  opt("علاقاتي", "My relationships"),
  opt("طموحي ومستقبلي", "My future"),
];
const LOCKED_POOL = [
  opt("صلاة الفجر في وقتها", "Fajr prayer on time"),
  opt("٣٠ دقيقة مشي", "30 minutes walking"),
  opt("قراءة ورد يومي", "Daily reading"),
  opt("النوم قبل منتصف الليل", "Sleep before midnight"),
  opt("تمارين رياضية", "Workout"),
  opt("كتابة يومياتي", "Journaling"),
];
const NAMES_M = [
  opt("الصقر الهادئ", "The Calm Falcon"),
  opt("الجبل الثابت", "The Steady Mountain"),
  opt("فارس الفجر", "Knight of Dawn"),
];
const NAMES_F = [
  opt("الزهرة الصامدة", "The Resilient Bloom"),
  opt("نسمة الفجر", "Dawn Breeze"),
  opt("النجمة الهادئة", "The Quiet Star"),
];

function Pill({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm transition-all duration-200 ${
        active
          ? "border-cherry bg-cherry text-cotton shadow-[var(--shadow-float)]"
          : "border-noir/10 bg-card/70 text-maroon hover:border-cherry/40"
      }`}
    >
      {children}
    </button>
  );
}

function Rolling({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const dur = 1600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <span className="font-mono tabular-nums">{n.toLocaleString("en-US")}</span>;
}

function Onboarding() {
  const { state, set, ready } = useApp();
  const navigate = useNavigate();
  const tr = useT(state.lang);
  const lang = state.lang;
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [shock, setShock] = useState(false);
  const [showMilestone, setShowMilestone] = useState(false);
  const [custom, setCustom] = useState("");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    if (ready && state.onboarded) navigate({ to: "/dashboard" });
  }, [ready, state.onboarded, navigate]);

  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  const go = (d: number) => {
    setDir(d);
    setStep((s) => Math.max(0, s + d));
  };

  // Math shock pauses deliberately: the user dismisses it themselves.
  const nextFromFreq = () => setShock(true);

  const names = state.gender === "female" ? NAMES_F : NAMES_M;

  const handleFinishStep = () => {
    setShowMilestone(true);
  };

  const finishAndNavigate = () => {
    set({
      onboarded: true,
      startedAt: Date.now(),
      lives: 3,
      nickname: state.nickname || customName || L(names[0]!, lang),
    });
    navigate({ to: "/dashboard" });
  };

  const steps = useMemo(
    () => [
      // 1 language
      {
        title: tr("chooseLang"),
        body: (
          <div className="grid gap-3">
            {(["ar", "en"] as Lang[]).map((l) => (
              <Pill key={l} active={lang === l} onClick={() => set({ lang: l })}>
                {l === "ar" ? "العربية" : "English"}
              </Pill>
            ))}
          </div>
        ),
        valid: true,
      },
      // 2 welcome
      {
        title: tr("welcome"),
        sub: tr("welcomeSub"),
        body: (
          <figure className="rounded-[24px] border border-noir/10 bg-cherry/5 p-6">
            <blockquote className="font-display text-base leading-loose text-maroon">
              {tr("welcomeQuote")}
            </blockquote>
            <figcaption className="mt-4 text-xs text-noir/45">{tr("welcomeQuoteSrc")}</figcaption>
          </figure>
        ),

        valid: true,
      },
      // 3 gender
      {
        title: tr("gender"),
        body: (
          <div className="grid grid-cols-2 gap-3">
            <Pill active={state.gender === "male"} onClick={() => set({ gender: "male" })}>
              {tr("male")}
            </Pill>
            <Pill active={state.gender === "female"} onClick={() => set({ gender: "female" })}>
              {tr("female")}
            </Pill>
          </div>
        ),
        valid: !!state.gender,
      },
      // 4 age
      {
        title: tr("age"),
        body: (
          <input
            inputMode="numeric"
            value={state.age}
            onChange={(e) => set({ age: e.target.value.replace(/\D/g, "").slice(0, 2) })}
            placeholder={tr("agePh")}
            className="w-full rounded-[24px] border border-noir/10 bg-card/70 px-6 py-5 text-center font-mono text-3xl text-maroon outline-none focus:border-cherry"
          />
        ),
        valid: Number(state.age) > 8,
      },
      // 5 target
      {
        title: tr("targetTitle"),
        body: (
          <div className="grid gap-3">
            {[tr("targetOptPorn"), tr("targetOptMasturbation"), tr("targetOptBoth")].map((o) => (
              <Pill key={o} active={state.target === o} onClick={() => set({ target: o })}>
                {o}
              </Pill>
            ))}
          </div>
        ),
        valid: !!state.target,
      },
      // 6 duration
      {
        title: tr("duration"),
        body: (
          <div className="grid gap-3">
            {[tr("d1"), tr("d2"), tr("d3"), tr("d4")].map((o) => (
              <Pill key={o} active={state.duration === o} onClick={() => set({ duration: o })}>
                {o}
              </Pill>
            ))}
          </div>
        ),
        valid: !!state.duration,
      },
      // 7 frequency
      {
        title: tr("freq"),
        sub: tr("freqHint"),
        body: (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Pill key={n} active={state.frequency === n} onClick={() => set({ frequency: n })}>
                  {n}
                </Pill>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs text-noir/50">{tr("freqDailyLabel")}</label>
              <input
                inputMode="numeric"
                value={state.frequency ? String(state.frequency) : ""}
                onChange={(e) =>
                  set({ frequency: Number(e.target.value.replace(/\D/g, "").slice(0, 2) || 0) })
                }
                placeholder="1"
                className="w-full rounded-[24px] border border-noir/10 bg-card/70 px-6 py-4 text-center font-mono text-3xl text-maroon outline-none focus:border-cherry"
              />
            </div>
          </div>
        ),
        valid: Number(state.frequency) > 0,
      },
      // 8 session duration
      {
        title: tr("sessionDurationTitle"),
        sub: tr("sessionDurationHint"),
        body: (
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-2">
              {[15, 30, 45, 60].map((m) => (
                <Pill
                  key={m}
                  active={state.timePerSession === m}
                  onClick={() => set({ timePerSession: m })}
                >
                  {m} {lang === "ar" ? "دقيقة" : "min"}
                </Pill>
              ))}
            </div>
            <div>
              <label className="mb-1 block text-xs text-noir/50">{tr("freqTimeLabel")}</label>
              <input
                inputMode="numeric"
                value={state.timePerSession === 0 ? "" : String(state.timePerSession)}
                onChange={(e) =>
                  set({
                    timePerSession: Number(e.target.value.replace(/\D/g, "").slice(0, 3) || 0),
                  })
                }
                placeholder="0"
                className="w-full rounded-[24px] border border-noir/10 bg-card/70 px-6 py-4 text-center font-mono text-3xl text-maroon outline-none focus:border-cherry"
              />
            </div>
          </div>
        ),
        valid: Number(state.timePerSession) > 0,
        onNext: nextFromFreq,
      },
      // 8 triggers
      {
        title: tr("triggers"),
        sub: tr("multiHint"),
        body: (
          <div className="flex flex-wrap gap-2">
            {TRIGGERS.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.triggers.includes(v)}
                  onClick={() => set({ triggers: toggle(state.triggers, v) })}
                >
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: state.triggers.length > 0,
      },
      // 9 pre
      {
        title: tr("preEmotions"),
        sub: tr("multiHint"),
        body: (
          <div className="flex flex-wrap gap-2">
            {PRE.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.preEmotions.includes(v)}
                  onClick={() => set({ preEmotions: toggle(state.preEmotions, v) })}
                >
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: state.preEmotions.length > 0,
      },
      // 10 post
      {
        title: tr("postEmotions"),
        sub: tr("multiHint"),
        body: (
          <div className="flex flex-wrap gap-2">
            {POST.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.postEmotions.includes(v)}
                  onClick={() => set({ postEmotions: toggle(state.postEmotions, v) })}
                >
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: state.postEmotions.length > 0,
      },
      // 11 damage
      {
        title: tr("damage"),
        sub: tr("multiHint"),
        body: (
          <div className="flex flex-wrap gap-2">
            {DAMAGE.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.damage.includes(v)}
                  onClick={() => set({ damage: toggle(state.damage, v) })}
                >
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: state.damage.length > 0,
      },
      // 12 attempts
      {
        title: tr("attempts"),
        body: (
          <div className="grid gap-3">
            {ATTEMPTS.map((o) => {
              const v = L(o, lang);
              return (
                <Pill key={o.en} active={state.attempts === v} onClick={() => set({ attempts: v })}>
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: !!state.attempts,
      },
      // 13 motivation
      {
        title: tr("motivation"),
        body: (
          <div className="grid gap-3">
            {MOTIVATION.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.motivation === v}
                  onClick={() => set({ motivation: v })}
                >
                  {v}
                </Pill>
              );
            })}
          </div>
        ),
        valid: !!state.motivation,
      },
      // 14 tasks
      {
        title: tr("tasks"),
        sub: tr("tasksSub"),
        body: (
          <div className="grid gap-4">
            <div className="flex flex-wrap gap-2">
              {LOCKED_POOL.map((o) => {
                const v = L(o, lang);
                const locked = state.habits.filter((h) => h.locked);
                const active = locked.some((h) => h.label === v);
                return (
                  <Pill
                    key={o.en}
                    active={active}
                    onClick={() => {
                      if (active) {
                        set({ habits: state.habits.filter((h) => h.label !== v) });
                      } else if (locked.length < 2) {
                        set({
                          habits: [
                            ...state.habits,
                            { id: crypto.randomUUID(), label: v, locked: true },
                          ],
                        });
                      }
                    }}
                  >
                    {v}
                  </Pill>
                );
              })}
            </div>
            <div className="flex gap-2">
              <input
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder={tr("addCustom")}
                className="flex-1 rounded-full border border-noir/10 bg-card/70 px-5 py-3 text-sm text-maroon outline-none focus:border-cherry"
              />
              <button
                type="button"
                onClick={() => {
                  const v = custom.trim();
                  if (!v || state.habits.filter((h) => !h.locked).length >= 3) return;
                  set({
                    habits: [...state.habits, { id: crypto.randomUUID(), label: v, locked: false }],
                  });
                  setCustom("");
                }}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-cherry text-cotton"
                aria-label={tr("add")}
              >
                <Plus size={18} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {state.habits
                .filter((h) => !h.locked)
                .map((h) => (
                  <span
                    key={h.id}
                    className="rounded-full border border-noir/10 bg-cherry/5 px-4 py-2 text-xs text-maroon"
                  >
                    {h.label}
                  </span>
                ))}
            </div>
          </div>
        ),
        valid: state.habits.filter((h) => h.locked).length === 2,
      },
      // 15 nickname
      {
        title: tr("nickname"),
        sub: tr("nicknameSub"),
        body: (
          <div className="grid gap-3">
            {names.map((o) => {
              const v = L(o, lang);
              return (
                <Pill
                  key={o.en}
                  active={state.nickname === v}
                  onClick={() => {
                    set({ nickname: v });
                    setCustomName("");
                  }}
                >
                  {v}
                </Pill>
              );
            })}
            <input
              value={customName}
              onChange={(e) => {
                setCustomName(e.target.value);
                set({ nickname: e.target.value });
              }}
              placeholder={tr("customName")}
              className="rounded-full border border-noir/10 bg-card/70 px-5 py-3 text-sm text-maroon outline-none focus:border-cherry"
            />
          </div>
        ),
        valid: !!state.nickname.trim(),
      },
      // 16 pledge document
      {
        title: tr("pledgeTitle"),
        sub: tr("pledgeSub"),
        body: (
          <PledgeDocument
            reasons={state.pledgeReasons || state.damage.join("، ") || tr("pledgeDefaultReasons")}
            impacts={
              state.pledgeImpacts || state.postEmotions.join("، ") || tr("pledgeDefaultImpacts")
            }
            goals={state.pledgeGoals || state.motivation || tr("pledgeDefaultGoals")}
            emergencyPlan={state.pledgeEmergencyPlan || tr("pledgeDefaultEmergency")}
            nickname={state.nickname}
            initialSignature={state.pledgeSignature}
            onSaveSignature={(sig) => set({ pledgeSignature: sig })}
            onChangeFields={(fields) =>
              set({
                pledgeReasons: fields.reasons ?? state.pledgeReasons,
                pledgeImpacts: fields.impacts ?? state.pledgeImpacts,
                pledgeGoals: fields.goals ?? state.pledgeGoals,
                pledgeEmergencyPlan: fields.emergencyPlan ?? state.pledgeEmergencyPlan,
              })
            }
          />
        ),
        valid: !!state.pledgeSignature,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, lang, custom, customName],
  );

  if (ready && !state.authenticated) {
    return (
      <AuthLanding
        onAuthenticate={() => {
          if (state.onboarded) {
            navigate({ to: "/dashboard" });
          }
        }}
      />
    );
  }

  const current = steps[Math.min(step, steps.length - 1)]!;
  const last = step === steps.length - 1;
  const Arrow = lang === "ar" ? ArrowLeft : ArrowRight;
  const BackArrow = lang === "ar" ? ArrowRight : ArrowLeft;

  return (
    <main className="relative mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-10">
      <div className="mb-8 flex items-center gap-3">
        {step > 0 && (
          <button
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-noir/10 bg-card/70 text-maroon"
            aria-label={tr("back")}
          >
            <BackArrow size={18} />
          </button>
        )}
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-noir/8">
          <motion.div
            className="h-full rounded-full bg-cherry"
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 200, damping: 28 }}
          />
        </div>
        <span className="font-mono text-xs text-noir/45">
          {step + 1}/{steps.length}
        </span>
      </div>

      <div className="flex flex-1 flex-col justify-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={step}
            initial={{ opacity: 0, x: dir * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -60 }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="bento p-7"
          >
            <h1 className="font-display text-2xl font-semibold leading-snug text-maroon">
              {current.title}
            </h1>
            {"sub" in current && current.sub && (
              <p className="mt-2 text-sm text-noir/50">{current.sub as string}</p>
            )}
            <div className="mt-6">{current.body}</div>
          </motion.section>
        </AnimatePresence>
      </div>

      <button
        disabled={!current.valid}
        onClick={() => {
          if (last) return handleFinishStep();
          const onNext = (current as { onNext?: () => void }).onNext;
          if (onNext) return onNext();
          go(1);
        }}
        className="mt-8 flex items-center justify-center gap-2 rounded-full bg-cherry px-6 py-4 text-base font-medium text-cotton shadow-[var(--shadow-float)] transition-all disabled:opacity-30"
      >
        {last ? tr("finish") : step === 1 ? tr("start") : tr("next")}
        {!last && <Arrow size={18} />}
      </button>

      <AnimatePresence>
        {showMilestone && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 px-6 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bento max-w-md w-full p-8 text-center space-y-5 border border-cherry/20 shadow-2xl"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cherry/10 text-cherry">
                <Sparkles size={32} />
              </div>
              <h2 className="font-display text-2xl font-bold text-maroon">
                {tr("milestoneTitle")}
              </h2>
              <p className="text-sm text-noir/70 leading-relaxed">{tr("milestoneMessage")}</p>
              <button
                type="button"
                onClick={finishAndNavigate}
                className="w-full rounded-full bg-cherry py-4 text-base font-semibold text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon"
              >
                {tr("milestoneAction")}
              </button>
            </motion.div>
          </motion.div>
        )}

        {shock &&
          (() => {
            const dailyFrequency = Math.max(0, Number(state.frequency) || 0);
            const sessionDurationMinutes = Math.max(0, Number(state.timePerSession) || 0);
            const currentAge = Math.max(10, Number(state.age) || 20);
            const yearsPracticed = getYearsPracticed(state.duration);

            const { yearlyHours, percentageWasted, futureNetYearsLost } = calculateTimeLoss({
              dailyFrequency,
              sessionDurationMinutes,
              yearsPracticed,
              currentAge,
            });

            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/95 px-6 backdrop-blur-md overflow-y-auto py-10"
              >
                <motion.div
                  initial={{ scale: 0.92, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  className="w-full max-w-md text-center space-y-6"
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cherry/10 text-cherry">
                    <Sparkles size={28} />
                  </div>

                  <h2 className="font-display text-2xl font-bold text-maroon">
                    {tr("timeLossTitle")}
                  </h2>

                  <div className="grid gap-3 text-start">
                    <div className="bento p-5 border-s-4 border-s-cherry">
                      <p className="text-xs text-noir/50">{tr("timeLossYearlyLabel")}</p>
                      <p className="font-mono text-3xl font-bold text-cherry mt-1">
                        <Rolling value={yearlyHours} />{" "}
                        <span className="text-sm font-sans text-noir/60">
                          {tr("timeLossYearlyUnit")}
                        </span>
                      </p>
                    </div>

                    <div className="bento p-5 bg-cherry/10 border border-cherry/30">
                      <p className="text-xs font-bold text-cherry uppercase tracking-wider">
                        {tr("timeLossFutureHeader")}
                      </p>
                      <p className="text-sm font-medium text-maroon mt-2 leading-relaxed">
                        {tr("timeLossFutureBodyPrefix")}{" "}
                        <span className="font-mono text-xl font-bold text-cherry">
                          {futureNetYearsLost} {tr("timeLossFutureNetYears")}
                        </span>{" "}
                        {tr("timeLossFutureBodySuffix")}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShock(false);
                      go(1);
                    }}
                    className="w-full rounded-full bg-cherry px-6 py-4 text-base font-bold text-cotton shadow-[var(--shadow-float)] transition-all hover:bg-maroon active:scale-95"
                  >
                    {tr("timeLossButton")}
                  </button>
                </motion.div>
              </motion.div>
            );
          })()}
      </AnimatePresence>
    </main>
  );
}
