import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import "../LandingPage.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
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
    <div className="dl-landing">

      {/* ── SVG-Hintergrund: zwei diagonale Linien ────────────────── */}
      <svg
        className="dl-diag-bg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* lila Zone oben-links */}
        <polygon points="0,0 1440,0 720,900 0,900" className="dl-zone-purple" />
        {/* grüne Zone unten-rechts */}
        <polygon points="720,900 1440,900 1440,200" className="dl-zone-teal" />
        {/* Diagonale Linie 1: oben-links → unten-rechts */}
        <line x1="0" y1="0" x2="1440" y2="900" className="dl-diag-line" />
        {/* Diagonale Linie 2: oben-rechts → Mitte-unten */}
        <line x1="1440" y1="0" x2="720" y2="900" className="dl-diag-line dl-diag-line--2" />
        {/* Dekorative Kreise */}
        <circle cx="120" cy="450" r="320" className="dl-deco-circle dl-deco-circle--left" />
        <circle cx="1320" cy="450" r="260" className="dl-deco-circle dl-deco-circle--right" />
      </svg>

      {/* ── Sektor 1: Navigation (oben-links) ────────────────────── */}
      <header className="dl-header">
        <div className="dl-logo">
          Dev<span>Learn</span>
        </div>
        <nav className="dl-nav">
          <a href="#kurse">Kurse</a>
          <a href="#ueber-uns">Über uns</a>
          <a href="#preise">Preise</a>
        </nav>
        <button
          className="dl-register-btn"
          onClick={() => navigate("/register")}
        >
          Registrieren
        </button>
      </header>

      {/* ── Hero ─────────────────────────────────────────────────── */}
      <main className="dl-hero">
        <span className="dl-hero-tag">Lernplattform für Entwickler</span>
        <h1 className="dl-hero-title">
          Lerne modern.<br />Lerne jetzt.
        </h1>
        <p className="dl-hero-sub">
          Von HTML bis React — strukturierte Kurse mit
          Praxisprojekten und IHK-Zertifizierung.
        </p>
        <div className="dl-hero-btns">
          <button
            className="dl-btn-primary"
            onClick={() => navigate("/register")}
          >
            Jetzt starten
          </button>
          <button
            className="dl-btn-ghost"
            onClick={() => navigate("/courses")}
          >
            Kurse ansehen
          </button>
        </div>
      </main>

      {/* ── Sektor 2: Kontakt-Link (unten-links) ─────────────────── */}
      <div className="dl-contact-zone">
        <p className="dl-zone-label">Fragen? Meld dich.</p>
        <a href="/contact" className="dl-contact-link">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"/>
            <path d="M2 7l10 7 10-7"/>
          </svg>
          Zum Kontaktformular
        </a>
      </div>

      {/* ── Sektor 3: Login-Card (unten-rechts) ──────────────────── */}
      <div className="dl-login-zone">
        <p className="dl-zone-label dl-zone-label--teal">Bereits registriert?</p>
        <div className="dl-login-card">
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
              <label htmlFor="dl-password">Passwort</label>
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
            <button
              type="submit"
              className="dl-login-btn"
              disabled={loading}
            >
              {loading ? "Wird eingeloggt…" : "Einloggen"}
            </button>
          </form>
          <p className="dl-register-hint">
            Noch kein Konto?{" "}
            <span onClick={() => navigate("/register")}>
              Jetzt registrieren
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}