import { useNavigate, Link } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import "../../styles/LandingPage.css";
import "../../styles/Preise.css";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

export default function Preise() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  return (
    <div className={`dl-landing${darkMode ? " dl-dark" : ""}`}>

      {/* ── SVG-Hintergrund ─────────────────────────────────────────────────── */}
      <svg
        className="dl-diag-bg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <polygon points="0,0 1440,0 720,900 0,900" className="dl-zone-purple" />
        <polygon points="720,900 1440,900 1440,200" className="dl-zone-teal" />
        <line x1="0" y1="0" x2="1440" y2="900" className="dl-diag-line" />
        <line x1="1440" y1="0" x2="720" y2="900" className="dl-diag-line dl-diag-line--2" />
        <circle cx="120" cy="450" r="320" className="dl-deco-circle dl-deco-circle--left" />
        <circle cx="1320" cy="450" r="260" className="dl-deco-circle dl-deco-circle--right" />
      </svg>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="dl-header">
        <DevLearnLogo linkTo="/" />
        <nav className="dl-nav">
          <Link to="/ueber-uns">Über uns</Link>
          <Link to="/preise" className="dl-nav-active">Preise</Link>
        </nav>
        <ThemeToggleButton />
      </header>

      {/* ── Inhalt ──────────────────────────────────────────────────────────── */}
      <main className="pr-main">

        {/* Hero */}
        <section className="pr-hero">
          <span className="dl-hero-tag">Transparente Preise</span>
          <h1 className="dl-hero-title">
            Einfach.<br />Fair. Klar.
          </h1>
          <p className="dl-hero-sub">
            Kein verstecktes Kleingedrucktes – wähle das Modell,
            das zu dir passt, und starte sofort.
          </p>
        </section>

        {/* Preis-Karten */}
        <section className="pr-cards" id="preise">

          {/* Free */}
          <div className="pr-card">
            <div className="pr-card-header">
              <span className="pr-plan-label">Kostenlos</span>
              <div className="pr-price">
                <span className="pr-price-amount">0 €</span>
                <span className="pr-price-period">/ Monat</span>
              </div>
              <p className="pr-plan-desc">Perfekt zum Reinschnuppern.</p>
            </div>
            <ul className="pr-features">
              <li><span className="pr-check pr-check--on">✔</span> Zugriff auf Einführungskurse</li>
              <li><span className="pr-check pr-check--on">✔</span> HTML &amp; CSS Grundlagen</li>
              <li><span className="pr-check pr-check--on">✔</span> Community-Zugang</li>
              <li><span className="pr-check pr-check--off">✗</span> Erweiterte Kurse</li>
              <li><span className="pr-check pr-check--off">✗</span> IHK-Zertifizierung</li>
              <li><span className="pr-check pr-check--off">✗</span> Persönliches Feedback</li>
            </ul>
            <button className="dl-btn-ghost pr-btn" onClick={() => navigate("/register")}>
              Kostenlos starten
            </button>
          </div>

          {/* Pro – Hervorgehoben */}
          <div className="pr-card pr-card--featured">
            <div className="pr-featured-badge">Beliebteste Wahl</div>
            <div className="pr-card-header">
              <span className="pr-plan-label pr-plan-label--white">Pro</span>
              <div className="pr-price">
                <span className="pr-price-amount pr-price-amount--white">29 €</span>
                <span className="pr-price-period pr-price-period--white">/ Monat</span>
              </div>
              <p className="pr-plan-desc pr-plan-desc--white">Alles, was du für den Einstieg brauchst.</p>
            </div>
            <ul className="pr-features pr-features--white">
              <li><span className="pr-check pr-check--on">✔</span> Alle Kurse inkl. React &amp; TypeScript</li>
              <li><span className="pr-check pr-check--on">✔</span> Figma &amp; Framer Kurse</li>
              <li><span className="pr-check pr-check--on">✔</span> IHK-Zertifizierungsvorbereitung</li>
              <li><span className="pr-check pr-check--on">✔</span> Persönliches Feedback</li>
              <li><span className="pr-check pr-check--on">✔</span> Community-Zugang</li>
              <li><span className="pr-check pr-check--on">✔</span> Neue Kurse inklusive</li>
            </ul>
            <button className="dl-btn-primary pr-btn" onClick={() => navigate("/register")}>
              Pro starten
            </button>
          </div>

          {/* Team */}
          <div className="pr-card">
            <div className="pr-card-header">
              <span className="pr-plan-label">Team</span>
              <div className="pr-price">
                <span className="pr-price-amount">79 €</span>
                <span className="pr-price-period">/ Monat</span>
              </div>
              <p className="pr-plan-desc">Für Gruppen &amp; Unternehmen.</p>
            </div>
            <ul className="pr-features">
              <li><span className="pr-check pr-check--on">✔</span> Alles aus Pro</li>
              <li><span className="pr-check pr-check--on">✔</span> Bis zu 10 Nutzer</li>
              <li><span className="pr-check pr-check--on">✔</span> Team-Dashboard</li>
              <li><span className="pr-check pr-check--on">✔</span> Fortschrittsübersicht</li>
              <li><span className="pr-check pr-check--on">✔</span> Prioritäts-Support</li>
              <li><span className="pr-check pr-check--on">✔</span> Individuelle Kursplanung</li>
            </ul>
            <button className="dl-btn-ghost pr-btn" onClick={() => navigate("/contact")}>
              Kontakt aufnehmen
            </button>
          </div>

        </section>

        {/* Hinweis */}
        <p className="pr-hint">
          Alle Preise zzgl. gesetzlicher MwSt. · Monatlich kündbar · Keine versteckten Kosten.
        </p>

      </main>
    </div>
  );
}