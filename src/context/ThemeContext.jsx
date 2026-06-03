import { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const ThemeToggleContext = createContext();

export function useThemeToggle() {
  return useContext(ThemeToggleContext);
}

function buildTheme(mode) {
  return createTheme({
    palette: {
      mode,
      primary:    { main: "#2E75B6" },
      secondary:  { main: "#FF6B35" },
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

export function ThemeContextProvider({ children }) {
  const [mode, setMode] = useState("light");

  const toggleTheme = () =>
    setMode((prev) => (prev === "light" ? "dark" : "light"));

  // useMemo: Theme nur neu bauen wenn mode sich ändert
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