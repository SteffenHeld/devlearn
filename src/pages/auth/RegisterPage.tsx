import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  const [name, setName]       = useState<string>("");
  const [email, setEmail]     = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirm, setConfirm] = useState<string>("");
  const [error, setError]     = useState<string>("");
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
      // 1. Firebase Auth User anlegen
      const cred = await createUserWithEmailAndPassword(auth, email, password);

      // 2. Displayname setzen
      await updateProfile(cred.user, { displayName: name });

      // 3. User-Dokument in Firestore anlegen mit Rolle "student"
      //    Ohne diesen Schritt findet AuthContext keine Rolle
      //    und ProtectedRoute blockiert alle geschützten Routen
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        role: "student",
        createdAt: new Date().toISOString(),
      });

      // 4. Kurzer Delay damit onAuthStateChanged feuern kann
      //    bevor React Router zur Dashboard-Route navigiert
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

        {/* Logo */}
        <DevLearnLogo linkTo="/" className="dl-auth-logo" />

        {/* Card */}
        <div className="dl-form-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
            <div>
              <h1 className="dl-form-title">Konto erstellen</h1>
              <p className="dl-form-sub">Lerne modern. Lerne jetzt.</p>
            </div>
            <ThemeToggleButton />
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
            <Link to="/" style={{ color: "var(--dl-violet-400)", fontWeight: 500 }}>
              Jetzt anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}