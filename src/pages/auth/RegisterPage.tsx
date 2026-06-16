import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

// ── Validierung ───────────────────────────────────────────────
function validateName(name: string): string {
  if (!name.trim()) return "Bitte Namen eingeben.";
  if (name.trim().length < 2) return "Der Name muss mindestens 2 Zeichen haben.";
  return "";
}

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

function validateConfirm(password: string, confirm: string): string {
  if (!confirm) return "Bitte Passwort bestätigen.";
  if (password !== confirm) return "Die Passwörter stimmen nicht überein.";
  return "";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  const [name, setName]         = useState<string>("");
  const [email, setEmail]       = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm]   = useState<string>("");
  const [error, setError]       = useState<string>("");
  const [loading, setLoading]   = useState<boolean>(false);

  // Feldfehler (direkt am Input)
  const [nameError, setNameError]       = useState<string>("");
  const [emailError, setEmailError]     = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [confirmError, setConfirmError] = useState<string>("");

  // onBlur → sofort validieren
  const handleNameBlur     = () => setNameError(validateName(name));
  const handleEmailBlur    = () => setEmailError(validateEmail(email));
  const handlePasswordBlur = () => setPasswordError(validatePassword(password));
  const handleConfirmBlur  = () => setConfirmError(validateConfirm(password, confirm));

  const handleRegister = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");

    // Alle Felder validieren
    const nErr = validateName(name);
    const eErr = validateEmail(email);
    const pErr = validatePassword(password);
    const cErr = validateConfirm(password, confirm);
    setNameError(nErr);
    setEmailError(eErr);
    setPasswordError(pErr);
    setConfirmError(cErr);
    if (nErr || eErr || pErr || cErr) return;

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        role: "student",
        createdAt: new Date().toISOString(),
      });
      await new Promise((resolve) => setTimeout(resolve, 300));
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
        <DevLearnLogo linkTo="/" className="dl-auth-logo" />

        <div className="dl-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 className="dl-form-title">Konto erstellen</h1>
              <p className="dl-form-sub">Lerne modern. Lerne jetzt.</p>
            </div>
            <ThemeToggleButton />
          </div>

          <form onSubmit={handleRegister} noValidate>

            {/* Name */}
            <div className="dl-field">
              <label htmlFor="reg-name">Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Max Mustermann"
                value={name}
                onChange={(e) => { setName(e.target.value); setNameError(""); }}
                onBlur={handleNameBlur}
                aria-invalid={!!nameError}
                aria-describedby={nameError ? "reg-name-error" : undefined}
                autoComplete="name"
              />
              {nameError && (
                <p id="reg-name-error" className="dl-field-error">{nameError}</p>
              )}
            </div>

            {/* E-Mail */}
            <div className="dl-field">
              <label htmlFor="reg-email">E-Mail</label>
              <input
                id="reg-email"
                type="email"
                placeholder="du@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                onBlur={handleEmailBlur}
                aria-invalid={!!emailError}
                aria-describedby={emailError ? "reg-email-error" : undefined}
                autoComplete="email"
              />
              {emailError && (
                <p id="reg-email-error" className="dl-field-error">{emailError}</p>
              )}
            </div>

            {/* Passwort */}
            <div className="dl-field">
              <label htmlFor="reg-password">Passwort</label>
              <input
                id="reg-password"
                type="password"
                placeholder="Mindestens 6 Zeichen"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                onBlur={handlePasswordBlur}
                aria-invalid={!!passwordError}
                aria-describedby={passwordError ? "reg-password-error" : undefined}
                autoComplete="new-password"
              />
              {passwordError && (
                <p id="reg-password-error" className="dl-field-error">{passwordError}</p>
              )}
            </div>

            {/* Passwort bestätigen */}
            <div className="dl-field">
              <label htmlFor="reg-confirm">Passwort bestätigen</label>
              <input
                id="reg-confirm"
                type="password"
                placeholder="••••••••"
                value={confirm}
                onChange={(e) => { setConfirm(e.target.value); setConfirmError(""); }}
                onBlur={handleConfirmBlur}
                aria-invalid={!!confirmError}
                aria-describedby={confirmError ? "reg-confirm-error" : undefined}
                autoComplete="new-password"
              />
              {confirmError && (
                <p id="reg-confirm-error" className="dl-field-error">{confirmError}</p>
              )}
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
            <Link to="/" style={{ color: "var(--dl-violet-400)", fontWeight: 500 }}>
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}