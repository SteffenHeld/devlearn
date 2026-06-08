import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import "../../styles/LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";

  // Login
  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);

  // Passwort vergessen
  const [showReset, setShowReset]       = useState<boolean>(false);
  const [resetEmail, setResetEmail]     = useState<string>("");
  const [resetSent, setResetSent]       = useState<boolean>(false);
  const [resetError, setResetError]     = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Kurzer Delay damit onAuthStateChanged feuern kann
      // bevor React Router zur Dashboard-Route navigiert
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate("/dashboard");
    } catch {
      setError("E-Mail oder Passwort falsch.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setResetError("");
    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch {
      setResetError("E-Mail-Adresse nicht gefunden.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className={`dl-landing${darkMode ? " dl-dark" : ""}`}>

      {/* ── SVG-Hintergrund ─────────────────────────────────────────────────── */}
      <svg className="dl-diag-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" className="dl-zone-purple" />
        <polygon points="720,900 1440,900 1440,200" className="dl-zone-teal" />
        <line x1="0" y1="0" x2="1440" y2="900" className="dl-diag-line" />
        <line x1="1440" y1="0" x2="720" y2="900" className="dl-diag-line dl-diag-line--2" />
        <circle cx="120" cy="450" r="320" className="dl-deco-circle dl-deco-circle--left" />
        <circle cx="1320" cy="450" r="260" className="dl-deco-circle dl-deco-circle--right" />
      </svg>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="dl-header">
        <div className="dl-logo">Dev<span>Learn</span></div>
        <nav className="dl-nav">
          <Link to="/ueber-uns">Über uns</Link>
          <Link to="/preise">Preise</Link>
        </nav>
        <button
          className="dl-theme-toggle"
          onClick={toggleTheme}
          aria-label={darkMode ? "Light Mode aktivieren" : "Dark Mode aktivieren"}
        >
          {darkMode ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="12" cy="12" r="5"/>
              <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
              <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <main className="dl-hero">
        <span className="dl-hero-tag">Lernplattform für Entwickler</span>
        <h1 className="dl-hero-title">
          Lerne modern.<br />Lerne jetzt.
        </h1>
        <p className="dl-hero-sub">
          Von HTML bis React – strukturierte Kurse mit
          Praxisprojekten und IHK-Zertifizierung.
        </p>
        <div className="dl-hero-btns">
          <button className="dl-btn-primary" onClick={() => navigate("/register")}>
            Jetzt starten
          </button>
          <button className="dl-btn-ghost" onClick={() => navigate("/kurse-entdecken")}>
            Kurse ansehen
          </button>
        </div>
      </main>

      {/* ── Kontakt-Zone ────────────────────────────────────────────────────── */}
      <div className="dl-contact-zone">
        <p className="dl-zone-label">Fragen? Meld dich.</p>
        <Link to="/contact" className="dl-contact-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
          Zum Kontaktformular
        </Link>
      </div>

      {/* ── Login-Zone ──────────────────────────────────────────────────────── */}
      <div className="dl-login-zone">
        <div className="dl-login-card">

          {/* ── Passwort-Reset-Ansicht ───────────────────────────────────── */}
          {showReset ? (
            <>
              <h2 className="dl-login-title">Passwort zurücksetzen</h2>
              <p style={{ fontSize: 13, color: "var(--dl-text-muted)", marginBottom: 16, lineHeight: 1.6 }}>
                Gib deine E-Mail ein — wir schicken dir einen Reset-Link.
              </p>

              {resetSent ? (
                <>
                  <div style={{
                    padding: "12px 14px", borderRadius: "var(--dl-radius-md)",
                    background: "var(--dl-teal-50)", border: "1px solid var(--dl-teal-100)",
                    marginBottom: 16,
                  }}>
                    <p style={{ fontSize: 13, color: "var(--dl-teal-600)", fontWeight: 500 }}>
                      ✓ Reset-Link gesendet!
                    </p>
                    <p style={{ fontSize: 12, color: "var(--dl-teal-600)", marginTop: 2 }}>
                      Bitte prüfe dein Postfach.
                    </p>
                  </div>
                  <button
                    className="dl-login-btn"
                    onClick={() => { setShowReset(false); setResetSent(false); setResetEmail(""); }}
                  >
                    Zurück zum Login
                  </button>
                </>
              ) : (
                <form onSubmit={handlePasswordReset} noValidate>
                  <div className="dl-field">
                    <label htmlFor="reset-email">E-Mail</label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="du@example.com"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {resetError && <p className="dl-error">{resetError}</p>}
                  <button
                    type="submit"
                    className="dl-login-btn"
                    disabled={resetLoading}
                    style={{ marginBottom: 10 }}
                  >
                    {resetLoading ? "Wird gesendet…" : "Reset-Link senden"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowReset(false); setResetError(""); setResetEmail(""); }}
                    style={{
                      background: "none", border: "none", width: "100%",
                      fontSize: 13, color: "var(--dl-text-faint)",
                      cursor: "pointer", fontFamily: "var(--dl-font)", padding: "4px 0",
                    }}
                  >
                    ← Zurück zum Login
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              {/* ── Login-Formular ───────────────────────────────────────── */}
              <h2 className="dl-login-title">Anmelden</h2>
              <form onSubmit={handleLogin} noValidate>
                <div className="dl-field">
                  <label htmlFor="dl-email">E-Mail</label>
                  <input
                    id="dl-email"
                    type="email"
                    placeholder="du@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
                <div className="dl-field">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                    <label htmlFor="dl-password" style={{ margin: 0 }}>Passwort</label>
                    {/* Passwort vergessen — überträgt eingetippte E-Mail direkt */}
                    <button
                      type="button"
                      onClick={() => { setShowReset(true); setResetEmail(email); }}
                      style={{
                        background: "none", border: "none", padding: 0,
                        fontSize: 12, color: "var(--dl-violet-400)",
                        cursor: "pointer", fontFamily: "var(--dl-font)",
                      }}
                    >
                      Passwort vergessen?
                    </button>
                  </div>
                  <input
                    id="dl-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                  />
                </div>
                {error && <p className="dl-error">{error}</p>}
                <button type="submit" className="dl-login-btn" disabled={loading}>
                  {loading ? "Wird eingeloggt…" : "Einloggen"}
                </button>
              </form>
              <p className="dl-register-hint">
                Noch kein Konto?{" "}
                <Link to="/register">Jetzt registrieren</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}