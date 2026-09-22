"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  if (!mounted) {
    return <Button aria-label="Toggle theme" size="icon" variant="ghost" disabled />;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      size="icon"
      variant="ghost"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}