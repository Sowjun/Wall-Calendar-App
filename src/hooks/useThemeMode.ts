"use client";

import { useState, useEffect } from "react";

export type ThemeMode = "light" | "dark";

export function useThemeMode() {
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("calendar-theme-mode");
    if (savedTheme === "light" || savedTheme === "dark") {
      setThemeMode(savedTheme);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setThemeMode(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    localStorage.setItem("calendar-theme-mode", themeMode);
    document.documentElement.classList.toggle("dark", themeMode === "dark");
  }, [themeMode]);

  return { themeMode, setThemeMode, isDark: themeMode === "dark" };
}
