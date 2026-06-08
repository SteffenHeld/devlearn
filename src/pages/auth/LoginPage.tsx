import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";

const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconSun = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

export default function LoginPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";

  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch {
      setError("E-Mail oder Passwort falsch.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`dl-auth-page${darkMode ? " dl-dark" : ""}`}>

      {/* Hintergrund */}
      <svg className="dl-auth-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" style={{ fill: "#c8c4f8", opacity: 0.35 }} />
        <polygon points="720,900 1440,900 1440,200"  style={{ fill: "#b8eed8", opacity: 0.35 }} />
        <circle cx="160"  cy="200" r="300" style={{ fill: "none", stroke: "#a8a4e8", strokeWidth: 0.8, opacity: 0.4 }} />
        <circle cx="1300" cy="700" r="240" style={{ fill: "none", stroke: "#5dbca0", strokeWidth: 0.8, opacity: 0.35 }} />
      </svg>

      <div className="dl-auth-content">
        {/* Logo */}
        <div className="dl-auth-logo">
          Dev<span>Learn</span>
        </div>

        <div className="dl-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 className="dl-form-title">Willkommen zurück</h1>
              <p className="dl-form-sub">Melde dich an und lerne weiter.</p>
            </div>
            <button className="dl-theme-toggle" onClick={toggleTheme} aria-label={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>

          <form onSubmit={handleLogin} noValidate>
            <div className="dl-field">
              <label htmlFor="login-email">E-Mail</label>
              <input
                id="login-email"
                type="email"
                placeholder="du@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="dl-field">
              <label htmlFor="login-password">Passwort</label>
              <input
                id="login-password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && <p className="dl-alert dl-alert--error">{error}</p>}

            <button
              type="submit"
              className="dl-btn dl-btn--teal"
              style={{ width: "100%", justifyContent: "center", marginTop: 4, padding: "12px" }}
              disabled={loading}
            >
              {loading ? "Wird eingeloggt…" : "Einloggen"}
            </button>
          </form>

          <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate("/")} style={{ padding: "6px 10px" }}>
              <IconBack /> Startseite
            </button>
            <p style={{ fontSize: 13, color: "var(--dl-text-faint)" }}>
              Noch kein Konto?{" "}
              <span
                style={{ color: "var(--dl-violet-400)", cursor: "pointer", fontWeight: 500 }}
                onClick={() => navigate("/register")}
              >
                Registrieren
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}