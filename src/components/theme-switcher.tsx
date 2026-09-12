import React from "react";
import { Check, Palette } from "lucide-react";
import { useTheme, THEMES, type ThemeId } from "@/hooks/use-theme";
import { useApp } from "@/lib/app-state";

export function ThemeSwitcher({ className = "" }: { className?: string }) {
  const { theme: activeTheme, setTheme } = useTheme();
  const { state } = useApp();
  const isAr = state.lang === "ar";

  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xs font-semibold text-noir/60 dark:text-cotton/60 flex items-center gap-1.5 uppercase tracking-wider">
          <Palette size={15} className="text-primary" />
          <span>{isAr ? "مظهر التطبيق" : "App Appearance"}</span>
        </h3>
        <span className="text-[11px] font-medium text-noir/40 dark:text-cotton/40">
          {THEMES.find((t) => t.id === activeTheme)?.name}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {THEMES.map((themeOption) => {
          const isSelected = activeTheme === themeOption.id;

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
              {/* Color Preview Block */}
              <div
                className="w-full h-12 rounded-xl p-2 flex items-center justify-between mb-2 shadow-inner border border-black/5 dark:border-white/5 relative overflow-hidden"
                style={{ backgroundColor: themeOption.backgroundColor }}
              >
                {/* Color swatches preview */}
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-5 h-5 rounded-full shadow-sm border border-black/10 flex items-center justify-center"
                    style={{ backgroundColor: themeOption.primaryColor }}
                    title={isAr ? "اللون الرئيسي" : "Primary"}
                  />
                  <div
                    className="w-4 h-4 rounded-full shadow-sm border border-black/10"
                    style={{ backgroundColor: themeOption.accentColor }}
                    title={isAr ? "اللون الثانوي" : "Accent"}
                  />
                </div>

                {/* Micro card representation */}
                <div
                  className="w-6 h-7 rounded-md border border-black/5 shadow-xs flex flex-col justify-center items-center gap-0.5 px-0.5"
                  style={{ backgroundColor: themeOption.cardColor }}
                >
                  <div
                    className="w-4 h-1 rounded-full"
                    style={{ backgroundColor: themeOption.primaryColor }}
                  />
                  <div
                    className="w-3 h-0.5 rounded-full opacity-60"
                    style={{ backgroundColor: themeOption.accentColor }}
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
                    isSelected ? "text-primary" : "text-foreground/80 group-hover:text-foreground"
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
  );
}
