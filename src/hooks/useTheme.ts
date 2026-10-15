"use client";
import { useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const update = () => {
      let stored: string | null = null;
      try {
        stored = localStorage.getItem("pg-theme");
      } catch {
        /* Theme works without storage. */
      }
      const preference: Theme =
        stored === "light" || stored === "dark" ? stored : "system";
      setTheme(preference);
      document.documentElement.dataset.theme =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
    };
    update();
    media.addEventListener("change", update);
    window.addEventListener("storage", update);
    return () => {
      media.removeEventListener("change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  function changeTheme(value: Theme) {
    setTheme(value);
    document.documentElement.dataset.theme =
      value === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : value;
    try {
      localStorage.setItem("pg-theme", value);
    } catch {
      /* Storage is optional. */
    }
  }
  return { theme, changeTheme };
}
