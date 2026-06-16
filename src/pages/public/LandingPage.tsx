import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import "../../styles/LandingPage.css";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

export default function LandingPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  // Login
  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);
  const [role, setRole]         = useState<"student" | "teacher">("student");

  // Passwort vergessen
  const [showReset, setShowReset]       = useState<boolean>(false);
  const [resetEmail, setResetEmail]     = useState<string>("");
  const [resetSent, setResetSent]       = useState<boolean>(false);
  const [resetError, setResetError]     = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);

  const isTeacher = role === "teacher";

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
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

  const shellClass = [
    "dl-landing",
    darkMode ? "dl-dark" : "",
    isTeacher ? "dl-landing--teacher" : "",
  ].filter(Boolean).join(" ");

  return (
    <div className={shellClass}>

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
        <DevLearnLogo />
        <nav className="dl-nav">
          <Link to="/ueber-uns">Über uns</Link>
          <Link to="/preise">Preise</Link>
        </nav>
        <ThemeToggleButton />
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <main className="dl-hero">

        {/* DaisyUI Hero Komponente */}
        <div className="hero min-h-screen" style={{ background: "transparent", minHeight:"auto", paddingBottom: "20px" }}>
          <div className="hero-content text-center" style={{ paddingTop: 0}}>
            <div className="max-w-2xl">

              {/* Badge */}
              <div className="badge badge-primary badge-outline mb-6 px-4 py-3 text-sm font-medium">
                🎓 Lernplattform für Entwickler
              </div>

              {/* Titel */}
              <h1 className="text-6xl font-bold mb-6 leading-tight" style={{ color: "var(--dl-text)" }}>
                Lerne modern.<br />
                <span className="text-transparent bg-clip-text"
                  style={{ backgroundImage: "linear-gradient(135deg, var(--dl-violet-400), var(--dl-teal-400))" }}>
                  Lerne jetzt.
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-lg mb-8 leading-relaxed" style={{ color: "var(--dl-text-muted)" }}>
                Von HTML bis React – strukturierte Kurse mit
                Praxisprojekten und IHK-Zertifizierung.
              </p>

              {/* Buttons */}
              <div className="flex gap-4 justify-center flex-wrap mb-12">
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => navigate("/register")}
                >
                  Jetzt starten
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                  </svg>
                </button>
                <button
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: "var(--dl-violet-400)", color: "var(--dl-violet-400)" }}
                  onClick={() => navigate("/kurse-entdecken")}
                >
                  Kurse ansehen
                </button>
              </div>

              {/* Stats */}
              <div className="stats stats-horizontal shadow-lg"
                style={{ background: "rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="stat">
                  <div className="stat-value text-2xl" style={{ color: "var(--dl-violet-400)" }}>4</div>
                  <div className="stat-desc" style={{ color: "var(--dl-text-muted)" }}>Kurskategorien</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-2xl" style={{ color: "var(--dl-teal-400)" }}>IHK</div>
                  <div className="stat-desc" style={{ color: "var(--dl-text-muted)" }}>Zertifiziert</div>
                </div>
                <div className="stat">
                  <div className="stat-value text-2xl" style={{ color: "var(--dl-amber-400, #f59e0b)" }}>100%</div>
                  <div className="stat-desc" style={{ color: "var(--dl-text-muted)" }}>Praxisorientiert</div>
                </div>
              </div>

            </div>
          </div>
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

          {/* ── Rollen-Tabs ─────────────────────────────────────────────────── */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`dl-role-btn dl-role-btn--student${!isTeacher ? " dl-role-btn--active" : ""}`}
            >
              👨‍🎓 Student
            </button>
            <button
              type="button"
              onClick={() => setRole("teacher")}
              className={`dl-role-btn dl-role-btn--teacher${isTeacher ? " dl-role-btn--active" : ""}`}
            >
              👨‍🏫 Lehrer
            </button>
          </div>

          {/* ── Passwort-Reset ───────────────────────────────────────────────── */}
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
                  <button type="submit" className="dl-login-btn" disabled={resetLoading} style={{ marginBottom: 10 }}>
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
                    <button
                      type="button"
                      onClick={() => { setShowReset(true); setResetEmail(email); }}
                      className="dl-forgot-btn"
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