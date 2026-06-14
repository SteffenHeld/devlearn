import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// ─── Typen ────────────────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark";

interface ThemeToggleContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const ThemeToggleContext = createContext<ThemeToggleContextType | null>(null);

export function useThemeToggle(): ThemeToggleContextType {
  const context = useContext(ThemeToggleContext);
  if (!context) {
    throw new Error("useThemeToggle muss innerhalb eines ThemeContextProviders verwendet werden");
  }
  return context;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // dl-dark global auf body setzen — wirkt auf alle Pages und CSS-Variablen
  useEffect(() => {
    if (mode === "dark") {
      document.body.classList.add("dl-dark");
    } else {
      document.body.classList.remove("dl-dark");
    }
  }, [mode]);

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeToggleContext.Provider>
  );
}