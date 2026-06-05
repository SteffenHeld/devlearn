import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useThemeToggle } from "../context/ThemeContext";
import "./devlearn.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      navigate("/dashboard");
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
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

        {/* Card */}
        <div className="dl-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 className="dl-form-title">Konto erstellen</h1>
              <p className="dl-form-sub">Lerne modern. Lerne jetzt.</p>
            </div>
            <button
              className="dl-theme-toggle"
              onClick={toggleTheme}
              aria-label={darkMode ? "Light Mode" : "Dark Mode"}
            >
              {darkMode ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
          </div>

          <form onSubmit={handleRegister} noValidate>
            <div className="dl-field">
              <label htmlFor="reg-name">Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </div>
            <div className="dl-field">
              <label htmlFor="reg-email">E-Mail</label>
              <input
                id="reg-email"
                type="email"
                placeholder="du@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="dl-field">
              <label htmlFor="reg-password">Passwort</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>
            <div className="dl-field">
              <label htmlFor="reg-confirm">Passwort bestätigen</label>
              <input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            {error && <p className="dl-alert dl-alert--error">{error}</p>}

            <button
              type="submit"
              className="dl-btn dl-btn--teal"
              style={{ width: "100%", justifyContent: "center", marginTop: 4, padding: "12px" }}
              disabled={loading}
            >
              {loading ? "Wird erstellt…" : "Konto erstellen"}
            </button>
          </form>

          <p style={{ fontSize: 13, color: "var(--dl-text-faint)", marginTop: 18, textAlign: "center" }}>
            Bereits ein Konto?{" "}
            <span
              style={{ color: "var(--dl-violet-400)", cursor: "pointer", fontWeight: 500 }}
              onClick={() => navigate("/")}
            >
              Jetzt anmelden
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}