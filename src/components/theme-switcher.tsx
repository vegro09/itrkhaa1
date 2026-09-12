import React from "react";
import { Check, Moon, Sun, Palette } from "lucide-react";
import { motion } from "motion/react";
import { useTheme, THEMES, type ThemeId } from "@/hooks/use-theme";
import { useApp } from "@/lib/app-state";

export function ThemeSwitcher({
  className = "",
  showNightModeToggle = true,
}: {
  className?: string;
  showNightModeToggle?: boolean;
}) {
  const { theme: activeTheme, setTheme, darkMode, toggleDarkMode } = useTheme();
  const { state } = useApp();
  const isAr = state.lang === "ar";

  return (
    <div className={`space-y-5 ${className}`}>
      {/* =========================================
          SECTION 1: NIGHT MODE TOGGLE (الوضع الليلي)
         ========================================= */}
      {showNightModeToggle && (
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-card/80 border border-border/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              {darkMode ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isAr ? "الوضع الليلي" : "Night Mode"}
              </p>
              <p className="text-xs text-foreground/50">
                {darkMode
                  ? isAr
                    ? "الوضع الداكن مفعّل لراحة العينين"
                    : "Dark mode enabled for eye comfort"
                  : isAr
                    ? "الوضع النهاري الفاتح"
                    : "Bright daytime mode"}
              </p>
            </div>
          </div>

          {/* Toggle Switch */}
          <button
            type="button"
            role="switch"
            aria-checked={darkMode}
            onClick={toggleDarkMode}
            className={`relative inline-flex h-7 w-13 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              darkMode ? "bg-primary" : "bg-noir/20 dark:bg-cotton/20"
            }`}
          >
            <span className="sr-only">
              {isAr ? "تبديل الوضع الليلي" : "Toggle night mode"}
            </span>
            <span
              className={`pointer-events-none flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md transform ring-0 transition duration-200 ease-in-out ${
                darkMode ? (isAr ? "-translate-x-6" : "translate-x-6") : "translate-x-0"
              }`}
            >
              {darkMode ? (
                <Moon size={12} className="text-primary" />
              ) : (
                <Sun size={12} className="text-amber-500" />
              )}
            </span>
          </button>
        </div>
      )}

      {/* =========================================
          SECTION 2: THEME SELECTOR GRID (مظهر التطبيق)
         ========================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-semibold text-foreground/70 flex items-center gap-1.5 uppercase tracking-wider">
            <Palette size={15} className="text-primary" />
            <span>{isAr ? "مظهر التطبيق" : "App Appearance"}</span>
          </h3>
          <span className="text-[11px] font-medium text-foreground/50">
            {THEMES.find((t) => t.id === activeTheme)?.name}
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEMES.map((themeOption) => {
            const isSelected = activeTheme === themeOption.id;
            const colors = darkMode ? themeOption.dark : themeOption.light;

            return (
              <button
                key={themeOption.id}
                type="button"
                onClick={() => setTheme(themeOption.id)}
                className={`group relative flex flex-col items-start p-3 rounded-2xl border transition-all duration-200 text-start cursor-pointer select-none ${
                  isSelected
                    ? "ring-2 ring-primary shadow-md scale-105 transition-all border-primary bg-card"
                    : "border-border/60 hover:border-border hover:shadow-sm bg-card/60 hover:bg-card"
                }`}
              >
                {/* Tile Preview Block */}
                <div
                  className="w-full h-14 rounded-xl p-2 flex items-center justify-between mb-2 shadow-inner border border-black/5 dark:border-white/5 relative overflow-hidden"
                  style={{ backgroundColor: colors.bgMain }}
                >
                  {/* Split Circle showing --primary and --bg-main */}
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full shadow-md border border-black/10 dark:border-white/10 relative overflow-hidden shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${colors.primary} 50%, ${colors.bgMain} 50%)`,
                      }}
                      title={`${colors.primary} / ${colors.bgMain}`}
                    >
                      {/* Micro accent dot inside center */}
                      <div
                        className="absolute inset-0 m-auto w-2 h-2 rounded-full border border-black/15 shadow-xs"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span
                        className="w-3.5 h-1.5 rounded-full"
                        style={{ backgroundColor: colors.primary }}
                      />
                      <span
                        className="w-2.5 h-1 rounded-full opacity-70"
                        style={{ backgroundColor: colors.accent }}
                      />
                    </div>
                  </div>

                  {/* Micro card representation */}
                  <div
                    className="w-6 h-8 rounded-md border border-black/5 shadow-xs flex flex-col justify-center items-center gap-1 px-0.5"
                    style={{ backgroundColor: colors.cardBg }}
                  >
                    <div
                      className="w-4 h-1 rounded-full"
                      style={{ backgroundColor: colors.primary }}
                    />
                    <div
                      className="w-3 h-0.5 rounded-full"
                      style={{ backgroundColor: colors.accent }}
                    />
                  </div>

                  {/* Selected Checkmark Badge */}
                  {isSelected && (
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-sm">
                      <Check size={10} strokeWidth={3} />
                    </div>
                  )}
                </div>

                {/* Theme Name */}
                <div className="w-full flex items-center justify-between">
                  <span
                    className={`text-xs font-bold leading-tight truncate ${
                      isSelected
                        ? "text-primary"
                        : "text-foreground/80 group-hover:text-foreground"
                    }`}
                  >
                    {isAr ? themeOption.name : themeOption.nameEn}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
