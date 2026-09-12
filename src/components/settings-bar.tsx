import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Settings, ChevronDown, Moon, Sun, Globe, Sliders, Volume2, Shield } from "lucide-react";
import { useApp, type Lang } from "@/lib/app-state";
import { useT } from "@/lib/i18n";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { THEMES } from "@/hooks/use-theme";

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
          type="button"
          onClick={() => onChange(key)}
          className="relative flex-1 rounded-full px-3 py-2 text-xs font-medium transition-all cursor-pointer"
        >
          {value === key && (
            <motion.span
              layoutId={`seg-${options.map((o) => o[0]).join("")}`}
              className="absolute inset-0 rounded-full bg-cherry"
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
            />
          )}
          <span className={`relative z-10 ${value === key ? "text-cotton font-bold" : "text-noir/55"}`}>
            {label}
          </span>
        </button>
      ))}
    </div>
  );
}

export function SettingsBar({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  const { state, set } = useApp();
  const tr = useT(state.lang);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isAr = state.lang === "ar";

  return (
    <div className="bento w-full overflow-hidden transition-all">
      {/* Unified Container Header Bar Button */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="flex w-full items-center justify-between p-5 text-start transition-colors hover:bg-noir/5 cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cherry/10 text-cherry">
            <Settings size={20} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-maroon dark:text-[#EDEBDE]">
              {isAr ? "الإعدادات" : "Settings"}
            </h2>
            <p className="text-xs text-noir/45">
              {isAr
                ? "تخصيص المظهر، اللغة، ونبرة حكيم الذكي"
                : "Customize theme, language, and Hakeem AI tone"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-noir/10 bg-card/60 px-3 py-1 text-[11px] font-medium text-noir/60">
            {state.lang === "ar" ? "العربية" : "English"} ·{" "}
            {THEMES.find((t) => t.id === (state.user_theme || "classic"))?.[isAr ? "name" : "nameEn"] ||
              (isAr ? "الكلاسيكي" : "Classic")}
          </span>
          <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={18} className="text-noir/40" />
          </motion.div>
        </div>
      </button>

      {/* Expandable Configuration Controls Panel */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-noir/10 p-5 space-y-4 bg-card/40">
              {/* App Appearance / Theme Selector */}
              <ThemeSwitcher />

              {/* Language */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-noir/50 flex items-center gap-1.5">
                  <Globe size={14} className="text-cherry" />
                  <span>{tr("language")}</span>
                </p>
                <Segment<Lang>
                  value={state.lang}
                  options={[
                    ["ar", "العربية"],
                    ["en", "English"],
                  ]}
                  onChange={(lang) => set({ lang })}
                />
              </div>

              {/* Tone */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-noir/50 flex items-center gap-1.5">
                  <Volume2 size={14} className="text-cherry" />
                  <span>{tr("tone")}</span>
                </p>
                <Segment<"empathetic" | "scientific" | "strict">
                  value={state.tone}
                  options={[
                    ["empathetic", tr("empathetic")],
                    ["scientific", tr("scientific")],
                    ["strict", tr("strict")],
                  ]}
                  onChange={(tone) => set({ tone, hakeemTone: tone })}
                />
              </div>

              {/* Hakeem Response Length */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-noir/50 flex items-center gap-1.5">
                  <Sliders size={14} className="text-cherry" />
                  <span>{tr("hakeemLength")}</span>
                </p>
                <Segment<"short" | "medium" | "detailed">
                  value={state.hakeemLength || "medium"}
                  options={[
                    ["short", tr("lengthShort")],
                    ["medium", tr("lengthMedium")],
                    ["detailed", tr("lengthDetailed")],
                  ]}
                  onChange={(hakeemLength) => set({ hakeemLength })}
                />
              </div>

              {/* Tracker Style / شكل العداد */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-noir/50 flex items-center gap-1.5">
                  <Shield size={14} className="text-cherry" />
                  <span>{isAr ? "شكل العداد" : "Tracker Style"}</span>
                </p>
                <Segment<"classic" | "shield">
                  value={state.trackerType || "shield"}
                  options={[
                    ["classic", isAr ? "العداد الرقمي الكلاسيكي" : "Classic Digital"],
                    ["shield", isAr ? "الدرع الفضي المنيع" : "Royal Silver Shield"],
                  ]}
                  onChange={(trackerType) => set({ trackerType })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
