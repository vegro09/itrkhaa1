import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/app-state";

export type ThemeId = "classic" | "ocean" | "pine" | "midnight" | "lavender" | "dew";

export interface ThemeOption {
  id: ThemeId;
  name: string;
  nameEn: string;
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  cardColor: string;
  category?: "default" | "male" | "female" | "dark";
}

export const THEMES: ThemeOption[] = [
  {
    id: "classic",
    name: "الكلاسيكي الدافئ",
    nameEn: "Warm Classic",
    primaryColor: "#810100",
    accentColor: "#D4A373",
    backgroundColor: "#FAF7F2",
    cardColor: "#FFFFFF",
    category: "default",
  },
  {
    id: "ocean",
    name: "أعماق المحيط",
    nameEn: "Deep Ocean",
    primaryColor: "#0F172A",
    accentColor: "#14B8A6",
    backgroundColor: "#F4F7F9",
    cardColor: "#FFFFFF",
    category: "male",
  },
  {
    id: "pine",
    name: "غابة الصنوبر",
    nameEn: "Pine Forest",
    primaryColor: "#1B4332",
    accentColor: "#B07D62",
    backgroundColor: "#F0F4F1",
    cardColor: "#FFFFFF",
    category: "male",
  },
  {
    id: "midnight",
    name: "الليل الهادئ",
    nameEn: "Midnight Zen",
    primaryColor: "#E4E4E7",
    accentColor: "#6366F1",
    backgroundColor: "#09090B",
    cardColor: "#18181B",
    category: "dark",
  },
  {
    id: "lavender",
    name: "زهرة الخزامى",
    nameEn: "Lavender Bloom",
    primaryColor: "#7E609A",
    accentColor: "#D4A5A5",
    backgroundColor: "#F9F8FC",
    cardColor: "#FFFFFF",
    category: "female",
  },
  {
    id: "dew",
    name: "ندى الصباح",
    nameEn: "Morning Dew",
    primaryColor: "#84A98C",
    accentColor: "#F2CC8F",
    backgroundColor: "#FDFBF7",
    cardColor: "#FFFFFF",
    category: "female",
  },
];

export function useTheme() {
  const { state, set } = useApp();
  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user_theme");
      if (stored && THEMES.some((t) => t.id === stored)) {
        return stored as ThemeId;
      }
    }
    return (state.user_theme as ThemeId) || "classic";
  });

  const applyTheme = useCallback((themeId: ThemeId) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", themeId);
    if (themeId === "midnight") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeId) => {
      setCurrentTheme(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("user_theme", newTheme);
      }
      applyTheme(newTheme);
      set({
        user_theme: newTheme,
        theme: newTheme === "midnight" ? "dark" : "light",
      });
    },
    [applyTheme, set],
  );

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("user_theme") : null;
    const initial = (stored as ThemeId) || (state.user_theme as ThemeId) || "classic";
    setCurrentTheme(initial);
    applyTheme(initial);
  }, [applyTheme, state.user_theme]);

  return {
    theme: currentTheme,
    setTheme,
    themes: THEMES,
  };
}
