import { createContext, useContext, useState, useMemo, ReactNode } from "react";
import { ThemeProvider, createTheme, Theme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// ─── Typen ────────────────────────────────────────────────────────────────────

type ThemeMode = "light" | "dark";

interface ThemeToggleContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

interface ThemeContextProviderProps {
  children: ReactNode;
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

// ─── Theme Builder ────────────────────────────────────────────────────────────

function buildTheme(mode: ThemeMode): Theme {
  return createTheme({
    palette: {
      mode,
      primary:   { main: "#2E75B6" },
      secondary: { main: "#FF6B35" },
      background: {
        default: mode === "light" ? "#F5F7FA" : "#121212",
        paper:   mode === "light" ? "#FFFFFF"  : "#1E1E1E",
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Arial", sans-serif',
      h1: { fontWeight: 700 },
      h2: { fontWeight: 700 },
      h3: { fontWeight: 600 },
    },
    shape: { borderRadius: 10 },
  });
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function ThemeContextProvider({ children }: ThemeContextProviderProps) {
  const [mode, setMode] = useState<ThemeMode>("light");

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  const theme = useMemo(() => buildTheme(mode), [mode]);

  return (
    <ThemeToggleContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeToggleContext.Provider>
  );
}