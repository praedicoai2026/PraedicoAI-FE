"use client";
import { useEffect, useState } from "react";
export type Theme = "light" | "dark" | "system";
export function useTheme() {
  const [theme, setTheme] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
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
      const resolved =
        preference === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preference;
      setTheme(preference);
      setResolvedTheme(resolved);
      document.documentElement.dataset.theme = resolved;
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
    const resolved =
      value === "system"
        ? window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light"
        : value;
    setTheme(value);
    setResolvedTheme(resolved);
    document.documentElement.dataset.theme = resolved;
    try {
      localStorage.setItem("pg-theme", value);
    } catch {
      /* Storage is optional. */
    }
  }
  function toggleTheme() {
    changeTheme(resolvedTheme === "dark" ? "light" : "dark");
  }
  return { theme, resolvedTheme, changeTheme, toggleTheme };
}
