import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

interface ThemeCtx {
  resolved: "dark";
}
const Ctx = createContext<ThemeCtx | null>(null);

function applyDark(): void {
  if (typeof window === "undefined") return;
  document.documentElement.classList.add("dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [resolved] = useState<"dark">("dark");

  useEffect(() => {
    applyDark();
  }, []);

  return <Ctx.Provider value={{ resolved }}>{children}</Ctx.Provider>;
}

export function useTheme() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useTheme must be used inside ThemeProvider");
  return c;
}
