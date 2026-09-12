import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import { LogOut, FileText, PenTool, ChevronDown } from "lucide-react";
import { useApp, todayISO, type Lang } from "@/lib/app-state";
import { useT } from "@/lib/i18n";
import { PixelHeart } from "@/components/visuals";
import { PledgeDocument } from "@/components/pledge-document";
import { SignatureModal } from "@/components/signature-modal";
import { SettingsBar } from "@/components/settings-bar";
import { ThemeSwitcher } from "@/components/theme-switcher";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile & settings — Leave It" },
      {
        name: "description",
        content:
          "Your continuous healing calendar, hearts, language, theme and Hakeem tone settings.",
      },
      { property: "og:title", content: "Profile & settings — Leave It" },
      { property: "og:description", content: "Your healing calendar and app preferences." },
    ],
  }),
  component: Profile,
});

function Segment<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: [T, string][];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex rounded-full border border-noir/10 bg-card/60 p-1">
      {options.map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="relative flex-1 rounded-full px-3 py-2 text-xs font-medium"
        >
          {value === key && (
            <motion.span
              layoutId={`seg-${options.map((o) => o[0]).join("")}`}
              className="absolute inset-0 rounded-full bg-cherry"
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${value === key ? "text-cotton" : "text-noir/55"}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

function Profile() {
  const { state, set, reset } = useApp();
  const tr = useT(state.lang);
  const navigate = useNavigate();

  const [mounted, setMounted] = useState(false);
  const [pledgeOpen, setPledgeOpen] = useState(false);
  const [sigModalOpen, setSigModalOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedSig = localStorage.getItem("userSignature") || localStorage.getItem("pledgeSignature");
      if (storedSig && !state.pledgeSignature) {
        set({ pledgeSignature: storedSig });
      }
    } catch {
      /* ignore */
    }
  }, []);

  const handleSaveSignature = (sigDataUrl: string) => {
    set({ pledgeSignature: sigDataUrl });
    try {
      localStorage.setItem("userSignature", sigDataUrl);
      localStorage.setItem("pledgeSignature", sigDataUrl);
    } catch {
      /* ignore */
    }
  };

  const total = state.habits.length || 1;
  const start = new Date(state.startedAt);
  start.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayIndex = Math.max(0, Math.floor((today.getTime() - start.getTime()) / 86_400_000)); // 0-based
  const elapsed = dayIndex + 1;

  // Continuous infinite grid: shows all days from day 1 up to current day plus upcoming buffer
  const totalGridDays = Math.max(60, elapsed + 10);
  const days = Array.from({ length: totalGridDays }).map((_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const key = todayISO(d);
    const future = i > dayIndex;
    const done = state.history[key] ?? 0;
    const ratio = Math.min(1, done / total);
    return { key, index: i + 1, future, done, ratio, rating: state.ratings[key] };
  });

  const tone = (d: (typeof days)[number]) => {
    if (d.future) return { background: "color-mix(in srgb, var(--noir-black) 5%, transparent)" };
    // A self-rating always wins over habit completion.
    if (d.rating === "excellent") return { background: "#2E7D32" };
    if (d.rating === "good") return { background: "#D4A373" };
    if (d.rating === "struggling") return { background: "#E67E22" };
    if (d.rating === "relapsed") return { background: "#810100" };
    if (d.ratio >= 1) return { background: "#2E7D32" };
    if (d.ratio >= 0.66) return { background: "#D4A373" };
    if (d.ratio > 0) return { background: "#E67E22" };
    return { background: "color-mix(in srgb, var(--noir-black) 12%, transparent)" };
  };

  const progressText =
    state.lang === "ar"
      ? `قطعت ${elapsed} يوماً في مسار التعافي والحرية`
      : `You have completed ${elapsed} days in your recovery journey`;

  return (
    <main className="mx-auto w-full max-w-xl px-5 pb-36 pt-10">
      <section className="bento flex items-center justify-between p-6">
        <div>
          <h1 className="font-display text-xl font-semibold text-maroon">
            {state.nickname || tr("appName")}
          </h1>
          <p className="mt-1 font-mono text-xs text-noir/45">
            {state.xp} {tr("xp")}
          </p>
        </div>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <PixelHeart key={i} filled={i < state.lives} size={24} />
          ))}
        </div>
      </section>

      <section className="bento mt-5 p-6">
        <h2 className="text-sm font-medium text-noir/55">{tr("calendar")}</h2>
        <p className="mt-1.5 text-xs leading-relaxed text-noir/45">{progressText}</p>
        <div className="mt-5 grid grid-cols-10 gap-1.5">
          {days.map((d) => (
            <div
              key={d.key}
              title={`${d.index} · ${d.key}`}
              className="aspect-square rounded-[5px]"
              style={tone(d)}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-[11px] text-noir/45">
          {(
            [
              ["#2E7D32", state.lang === "ar" ? "ممتاز" : "Excellent"],
              ["#D4A373", state.lang === "ar" ? "جيد" : "Good"],
              ["#E67E22", state.lang === "ar" ? "أعاني" : "Struggling"],
              ["#810100", state.lang === "ar" ? "انتكست" : "Relapsed"],
            ] as const
          ).map(([c, label]) => (
            <span key={label} className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: c }} />
              {label}
            </span>
          ))}
        </div>
      </section>

      {/* Only revealed after the first complete 3-strike reset. */}
      {state.attemptsLog.length > 0 && (
        <section className="bento mt-5 p-6">
          <h2 className="text-sm font-medium text-noir/55">{tr("attemptHistory")}</h2>
          <ul className="mt-4 flex flex-col gap-2.5">
            {state.attemptsLog.map((a, i) => {
              const days = Math.max(0, Math.floor((a.endedAt - a.startedAt) / 86_400_000));
              return (
                <li
                  key={a.endedAt}
                  className="flex items-center justify-between rounded-[20px] border border-noir/10 bg-card/60 px-4 py-3 text-xs"
                >
                  <span className="text-maroon">
                    {tr("attemptLabel")} {i + 1}
                  </span>
                  <span className="text-noir/50">
                    {tr("lasted")} <span className="font-mono text-cherry">{days}</span>{" "}
                    {tr("dayUnit")}
                  </span>
                  <span className="font-mono text-noir/40">{todayISO(new Date(a.endedAt))}</span>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* The Pledge Section (Collapsible - default closed) */}
      <section className="bento mt-5 overflow-hidden transition-all">
        <button
          type="button"
          onClick={() => setPledgeOpen(!pledgeOpen)}
          className="flex w-full items-center justify-between p-6 text-start transition-colors hover:bg-noir/5 cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cherry/10 text-cherry">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-maroon dark:text-[#EDEBDE]">
                {tr("pledgeTitle")}
              </h2>
              <p className="text-xs text-noir/45">
                {state.lang === "ar"
                  ? "انقر لاستعراض وثيقة العهد والتوقيع"
                  : "Click to view pledge document and signature"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {state.pledgeSignature && (
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-cherry/10 px-3 py-1 text-[11px] font-bold text-cherry">
                ✓ {state.lang === "ar" ? "موقع" : "Signed"}
              </span>
            )}
            <motion.div animate={{ rotate: pledgeOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={18} className="text-noir/40" />
            </motion.div>
          </div>
        </button>

        <AnimatePresence initial={false}>
          {pledgeOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="overflow-hidden border-t border-noir/10 p-6 pt-4 bg-card/40"
            >
              <PledgeDocument
                reasons={state.pledgeReasons || state.damage.join("، ")}
                impacts={state.pledgeImpacts || state.postEmotions.join("، ")}
                goals={state.pledgeGoals || state.motivation || ""}
                emergencyPlan={state.pledgeEmergencyPlan || tr("pledgeDefaultEmergency")}
                nickname={state.nickname}
                initialSignature={state.pledgeSignature}
                onSaveSignature={handleSaveSignature}
                onChangeFields={(fields) =>
                  set({
                    pledgeReasons: fields.reasons ?? state.pledgeReasons,
                    pledgeImpacts: fields.impacts ?? state.pledgeImpacts,
                    pledgeGoals: fields.goals ?? state.pledgeGoals,
                    pledgeEmergencyPlan: fields.emergencyPlan ?? state.pledgeEmergencyPlan,
                  })
                }
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* App Appearance / Theme Selector */}
      <section className="bento mt-5 p-6">
        <ThemeSwitcher />
      </section>

      {/* Consolidated Settings Section */}
      <section className="mt-5 space-y-4">
        <SettingsBar defaultExpanded={false} />

        <button
          type="button"
          onClick={() => {
            reset();
            navigate({ to: "/" });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-cherry/30 py-3.5 text-sm text-cherry transition-colors hover:bg-cherry/10 cursor-pointer"
        >
          <LogOut size={16} />
          {tr("logout")}
        </button>
      </section>
    </main>
  );
}
