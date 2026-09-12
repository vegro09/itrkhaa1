import { useState, useEffect, useCallback } from "react";
import { useApp } from "@/lib/app-state";

export type ThemeId = "classic" | "bordo" | "coral" | "venice" | "rose" | "castro";

export interface ThemeColors {
  primary: string;
  bgMain: string;
  textMain: string;
  accent: string;
  cardBg: string;
  borderColor: string;
}

export interface ThemeOption {
  id: ThemeId;
  name: string;
  nameEn: string;
  light: ThemeColors;
  dark: ThemeColors;
}

export const THEMES: ThemeOption[] = [
  {
    id: "classic",
    name: "الكلاسيكي الأصلي",
    nameEn: "Classic Original",
    light: {
      bgMain: "#FAF7F2",
      textMain: "#121010",
      primary: "#810100",
      accent: "#D4A373",
      cardBg: "#FFFFFF",
      borderColor: "rgba(212, 163, 115, 0.3)",
    },
    dark: {
      bgMain: "#121010",
      textMain: "#FAF7F2",
      primary: "#E53935",
      accent: "#D4A373",
      cardBg: "#1C1917",
      borderColor: "rgba(255, 255, 255, 0.1)",
    },
  },
  {
    id: "bordo",
    name: "غابة البوردو",
    nameEn: "Bordo Forest",
    light: {
      bgMain: "#F5DABF",
      textMain: "#0F3D3A",
      primary: "#6C151E",
      accent: "#0F3D3A",
      cardBg: "#FFFFFF",
      borderColor: "rgba(15, 61, 58, 0.2)",
    },
    dark: {
      bgMain: "#0A1F1D",
      textMain: "#F5DABF",
      primary: "#EF4444",
      accent: "#2DD4BF",
      cardBg: "#0F3D3A",
      borderColor: "rgba(245, 218, 191, 0.1)",
    },
  },
  {
    id: "coral",
    name: "المرجان الاستوائي",
    nameEn: "Tropical Coral",
    light: {
      bgMain: "#FDFBEF",
      textMain: "#235451",
      primary: "#EC5D3D",
      accent: "#235451",
      cardBg: "#FFFFFF",
      borderColor: "rgba(35, 84, 81, 0.2)",
    },
    dark: {
      bgMain: "#112423",
      textMain: "#FDFBEF",
      primary: "#EC5D3D",
      accent: "#4FD1C5",
      cardBg: "#1E3B39",
      borderColor: "rgba(253, 251, 239, 0.1)",
    },
  },
  {
    id: "venice",
    name: "أزرق فينيسيا",
    nameEn: "Venice Blue",
    light: {
      bgMain: "#F5EEDD",
      textMain: "#16587B",
      primary: "#16587B",
      accent: "#84B3CE",
      cardBg: "#FFFFFF",
      borderColor: "rgba(22, 88, 123, 0.2)",
    },
    dark: {
      bgMain: "#0B1C28",
      textMain: "#F5EEDD",
      primary: "#84B3CE",
      accent: "#F5EEDD",
      cardBg: "#112A3C",
      borderColor: "rgba(245, 238, 221, 0.1)",
    },
  },
  {
    id: "rose",
    name: "الوردة العتيقة",
    nameEn: "Dusty Rose",
    light: {
      bgMain: "#F4DB9A",
      textMain: "#502028",
      primary: "#C66974",
      accent: "#DD8C96",
      cardBg: "#FDFBF7",
      borderColor: "rgba(198, 105, 116, 0.3)",
    },
    dark: {
      bgMain: "#251215",
      textMain: "#F4DB9A",
      primary: "#DD8C96",
      accent: "#F4DB9A",
      cardBg: "#3F1D23",
      borderColor: "rgba(244, 219, 154, 0.1)",
    },
  },
  {
    id: "castro",
    name: "سماء كاسترو",
    nameEn: "Castro Sky",
    light: {
      bgMain: "#D9E7F8",
      textMain: "#56021E",
      primary: "#56021E",
      accent: "#6371A2",
      cardBg: "#FFFFFF",
      borderColor: "rgba(86, 2, 30, 0.2)",
    },
    dark: {
      bgMain: "#1A0109",
      textMain: "#D9E7F8",
      primary: "#F43F5E",
      accent: "#6371A2",
      cardBg: "#380113",
      borderColor: "rgba(217, 231, 248, 0.1)",
    },
  },
];

export function useTheme() {
  const { state, set } = useApp();

  const [currentTheme, setCurrentTheme] = useState<ThemeId>(() => {
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("theme_preference") ||
        localStorage.getItem("user_theme");
      if (stored && THEMES.some((t) => t.id === stored)) {
        return stored as ThemeId;
      }
    }
    return (state.user_theme as ThemeId) || "classic";
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      const storedDark = localStorage.getItem("darkMode");
      if (storedDark !== null) {
        return storedDark === "true";
      }
    }
    return state.theme === "dark";
  });

  const applyTheme = useCallback((themeId: ThemeId, dark: boolean) => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", themeId);
    if (dark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setTheme = useCallback(
    (newTheme: ThemeId) => {
      setCurrentTheme(newTheme);
      if (typeof window !== "undefined") {
        localStorage.setItem("theme_preference", newTheme);
        localStorage.setItem("user_theme", newTheme);
      }
      applyTheme(newTheme, isDarkMode);
      set({
        user_theme: newTheme,
      });
    },
    [applyTheme, isDarkMode, set],
  );

  const setDarkMode = useCallback(
    (dark: boolean) => {
      setIsDarkMode(dark);
      if (typeof window !== "undefined") {
        localStorage.setItem("darkMode", String(dark));
      }
      applyTheme(currentTheme, dark);
      set({
        theme: dark ? "dark" : "light",
      });
    },
    [applyTheme, currentTheme, set],
  );

  const toggleDarkMode = useCallback(() => {
    setDarkMode(!isDarkMode);
  }, [isDarkMode, setDarkMode]);

  useEffect(() => {
    const storedPref =
      typeof window !== "undefined"
        ? localStorage.getItem("theme_preference") || localStorage.getItem("user_theme")
        : null;
    const initialTheme = (storedPref as ThemeId) || (state.user_theme as ThemeId) || "classic";

    const storedDark =
      typeof window !== "undefined" ? localStorage.getItem("darkMode") : null;
    const initialDark =
      storedDark !== null ? storedDark === "true" : state.theme === "dark";

    setCurrentTheme(initialTheme);
    setIsDarkMode(initialDark);
    applyTheme(initialTheme, initialDark);
  }, [applyTheme, state.user_theme, state.theme]);

  return {
    theme: currentTheme,
    setTheme,
    darkMode: isDarkMode,
    setDarkMode,
    toggleDarkMode,
    themes: THEMES,
  };
}
