import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

type Tab = "student" | "teacher";

// ── Validierung ───────────────────────────────────────────────
function validateEmail(email: string): string {
  if (!email.trim()) return "Bitte E-Mail-Adresse eingeben.";
  if (!email.includes("@") || !email.includes(".")) return "Bitte eine gültige E-Mail-Adresse eingeben.";
  return "";
}

function validatePassword(password: string): string {
  if (!password) return "Bitte Passwort eingeben.";
  if (password.length < 6) return "Das Passwort muss mindestens 6 Zeichen haben.";
  return "";
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  const [activeTab, setActiveTab] = useState<Tab>("student");
  const [email, setEmail]         = useState<string>("");
  const [password, setPassword]   = useState<string>("");
  const [error, setError]         = useState<string>("");
  const [loading, setLoading]     = useState<boolean>(false);

  // Feldfehler (direkt am Input)
  const [emailError, setEmailError]       = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");

  // Passwort vergessen
  const [showReset, setShowReset]       = useState<boolean>(false);
  const [resetEmail, setResetEmail]     = useState<string>("");
  const [resetSent, setResetSent]       = useState<boolean>(false);
  const [resetError, setResetError]     = useState<string>("");
  const [resetLoading, setResetLoading] = useState<boolean>(false);
  const [resetEmailError, setResetEmailError] = useState<string>("");

  // Feld verlassen → sofort validieren (onBlur)
  const handleEmailBlur = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // Alle Felder validieren
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    setEmailError(eErr);
    setPasswordError(pErr);
    if (eErr || pErr) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await new Promise((resolve) => setTimeout(resolve, 300));
      navigate("/dashboard");
    } catch {
      setError(
        activeTab === "teacher"
          ? "E-Mail oder Passwort falsch. Bitte Dozenten-Zugangsdaten prüfen."
          : "E-Mail oder Passwort falsch."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setResetError("");

    const eErr = validateEmail(resetEmail);
    setResetEmailError(eErr);
    if (eErr) return;

    setResetLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
    } catch {
      setResetError("E-Mail-Adresse nicht gefunden. Bitte prüfen.");
    } finally {
      setResetLoading(false);
    }
  };

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setEmail("");
    setPassword("");
    setError("");
    setEmailError("");
    setPasswordError("");
  };

  return (
    <div className={`dl-auth-page${darkMode ? " dl-dark" : ""}`}>

      {/* Hintergrund */}
      <svg className="dl-auth-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" style={{ fill: "#c8c4f8", opacity: 0.35 }} />
        <polygon points="720,900 1440,900 1440,200" style={{ fill: "#b8eed8", opacity: 0.35 }} />
        <circle cx="160" cy="200" r="300" style={{ fill: "none", stroke: "#a8a4e8", strokeWidth: 0.8, opacity: 0.4 }} />
        <circle cx="1300" cy="700" r="240" style={{ fill: "none", stroke: "#5dbca0", strokeWidth: 0.8, opacity: 0.35 }} />
      </svg>

      <div className="dl-auth-content">
        <DevLearnLogo linkTo="/" className="dl-auth-logo" />

        <div className="dl-form-card">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <ThemeToggleButton />
          </div>

          {/* ── Passwort-Reset ──────────────────────────────────────────── */}
          {showReset ? (
            <>
              <h1 className="dl-form-title">Passwort zurücksetzen</h1>
              <p className="dl-form-sub" style={{ marginBottom: 24 }}>
                Gib deine E-Mail-Adresse ein — wir schicken dir einen Reset-Link.
              </p>

              {resetSent ? (
                <div style={{
                  padding: "16px", borderRadius: "var(--dl-radius-md)",
                  background: "var(--dl-teal-50)", border: "1px solid var(--dl-teal-100)",
                  marginBottom: 20,
                }}>
                  <p style={{ fontSize: 14, color: "var(--dl-teal-600)", fontWeight: 500 }}>
                    ✓ Reset-Link wurde gesendet!
                  </p>
                  <p style={{ fontSize: 13, color: "var(--dl-teal-600)", marginTop: 4 }}>
                    Bitte prüfe dein E-Mail-Postfach und folge dem Link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handlePasswordReset} noValidate>
                  <div className="dl-field">
                    <label htmlFor="reset-email">E-Mail</label>
                    <input
                      id="reset-email"
                      type="email"
                      placeholder="du@example.com"
                      value={resetEmail}
                      onChange={(e) => { setResetEmail(e.target.value); setResetEmailError(""); }}
                      onBlur={() => setResetEmailError(validateEmail(resetEmail))}
                      aria-invalid={!!resetEmailError}
                      aria-describedby={resetEmailError ? "reset-email-error" : undefined}
                      autoComplete="email"
                      autoFocus
                    />
                    {resetEmailError && (
                      <p id="reset-email-error" className="dl-field-error">{resetEmailError}</p>
                    )}
                  </div>
                  {resetError && <p className="dl-alert dl-alert--error">{resetError}</p>}
                  <button
                    type="submit"
                    className="dl-btn dl-btn--teal"
                    style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 4 }}
                    disabled={resetLoading}
                  >
                    {resetLoading ? "Wird gesendet…" : "Reset-Link senden"}
                  </button>
                </form>
              )}

              <button
                className="dl-btn dl-btn--ghost"
                style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
                onClick={() => {
                  setShowReset(false);
                  setResetSent(false);
                  setResetError("");
                  setResetEmail("");
                  setResetEmailError("");
                }}
              >
                Zurück zum Login
              </button>
            </>
          ) : (
            <>
              {/* ── Tabs ───────────────────────────────────────────────── */}
              <div style={{ display: "flex", borderBottom: "1px solid var(--dl-border)", marginBottom: 24 }}>
                {(["student", "teacher"] as Tab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => handleTabChange(tab)}
                    style={{
                      flex: 1, background: "transparent", border: "none",
                      borderBottom: activeTab === tab
                        ? "2px solid var(--dl-violet-400)"
                        : "2px solid transparent",
                      padding: "10px 0", fontFamily: "var(--dl-font)", fontSize: 14,
                      fontWeight: activeTab === tab ? 600 : 400,
                      color: activeTab === tab ? "var(--dl-violet-400)" : "var(--dl-text-muted)",
                      cursor: "pointer", marginBottom: -1,
                      transition: "color 0.15s, border-color 0.15s",
                    }}
                    aria-selected={activeTab === tab}
                  >
                    {tab === "student" ? "👨‍🎓 Schüler" : "👨‍🏫 Dozent"}
                  </button>
                ))}
              </div>

              {/* ── Login-Formular ─────────────────────────────────────── */}
              <h1 className="dl-form-title">
                {activeTab === "student" ? "Willkommen zurück" : "Dozenten-Login"}
              </h1>
              <p className="dl-form-sub" style={{ marginBottom: 20 }}>
                {activeTab === "student"
                  ? "Melde dich an und lerne weiter."
                  : "Verwalte deine Kurse und Lektionen."}
              </p>

              <form onSubmit={handleLogin} noValidate>
                {/* E-Mail */}
                <div className="dl-field">
                  <label htmlFor="login-email">E-Mail</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="du@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    onBlur={handleEmailBlur}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? "login-email-error" : undefined}
                    autoComplete="email"
                  />
                  {emailError && (
                    <p id="login-email-error" className="dl-field-error">{emailError}</p>
                  )}
                </div>

                {/* Passwort */}
                <div className="dl-field">
                  <label htmlFor="login-password">Passwort</label>
                  <input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    onBlur={handlePasswordBlur}
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? "login-password-error" : undefined}
                    autoComplete="current-password"
                  />
                  {passwordError && (
                    <p id="login-password-error" className="dl-field-error">{passwordError}</p>
                  )}
                </div>

                {/* Passwort vergessen */}
                <div style={{ textAlign: "right", marginTop: -8, marginBottom: 16 }}>
                  <button
                    type="button"
                    onClick={() => { setShowReset(true); setResetEmail(email); }}
                    style={{
                      background: "none", border: "none", padding: 0,
                      fontSize: 13, color: "var(--dl-violet-400)",
                      cursor: "pointer", fontFamily: "var(--dl-font)",
                    }}
                  >
                    Passwort vergessen?
                  </button>
                </div>

                {error && <p className="dl-alert dl-alert--error">{error}</p>}

                <button
                  type="submit"
                  className="dl-btn dl-btn--teal"
                  style={{ width: "100%", justifyContent: "center", padding: "12px" }}
                  disabled={loading}
                >
                  {loading ? "Wird eingeloggt…" : "Einloggen"}
                </button>
              </form>

              <div style={{ marginTop: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <Link to="/" style={{ fontSize: 13, color: "var(--dl-text-faint)" }}>
                  ← Startseite
                </Link>
                {activeTab === "student" && (
                  <p style={{ fontSize: 13, color: "var(--dl-text-faint)" }}>
                    Noch kein Konto?{" "}
                    <Link to="/register" style={{ color: "var(--dl-violet-400)", fontWeight: 500 }}>
                      Registrieren
                    </Link>
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}