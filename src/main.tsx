import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { ThemeContextProvider } from "./context/ThemeContext";
import "./devlearn.css"
import App from "./App";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root-Element nicht gefunden");

createRoot(rootElement).render(
  <StrictMode>
    <ThemeContextProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeContextProvider>
  </StrictMode>
);