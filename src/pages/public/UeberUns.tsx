import { useNavigate, Link } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import "../../styles/LandingPage.css";
import "../../styles/UeberUns.css";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

export default function UeberUns() {
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
          <Link to="/ueber-uns" className="dl-nav-active">Über uns</Link>
          <Link to="/preise">Preise</Link>
        </nav>
        <ThemeToggleButton />
      </header>

      {/* ── Inhalt ──────────────────────────────────────────────────────────── */}
      <main className="ue-main">

        {/* Hero-Bereich */}
        <section className="ue-hero">
          <span className="dl-hero-tag">Wer wir sind</span>
          <h1 className="dl-hero-title">
            Lernen neu<br />gedacht.
          </h1>
          <p className="dl-hero-sub">
            DevLearn ist eine moderne Lernplattform für angehende Webentwickler –
            strukturiert, praxisnah und auf IHK-Niveau.
          </p>
        </section>

        {/* Karten-Bereich */}
        <section className="ue-cards">

          <div className="ue-card">
            <div className="ue-card-icon ue-card-icon--purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
            <h3 className="ue-card-title">Unsere Mission</h3>
            <p className="ue-card-text">
              Wir glauben, dass modernes Webentwickeln für jeden erlernbar ist –
              mit den richtigen Materialien, einer klaren Struktur und echten Projekten.
              DevLearn macht Wissen zugänglich und messbar.
            </p>
          </div>

          <div className="ue-card">
            <div className="ue-card-icon ue-card-icon--teal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <h3 className="ue-card-title">Unser Team</h3>
            <p className="ue-card-text">
              Hinter DevLearn stecken erfahrene Entwickler und Pädagogen,
              die selbst den Weg vom Anfänger zum Professional gegangen sind.
              Wir wissen, wo es hakt – und wie man es löst.
            </p>
          </div>

          <div className="ue-card">
            <div className="ue-card-icon ue-card-icon--purple">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </div>
            <h3 className="ue-card-title">Unser Ansatz</h3>
            <p className="ue-card-text">
              Kein trockenes Lesen – bei DevLearn lernst du durch echte Projekte,
              schrittweise Anleitungen und direktes Feedback. Vom ersten HTML-Tag
              bis zur fertigen React-App.
            </p>
          </div>

          <div className="ue-card">
            <div className="ue-card-icon ue-card-icon--teal">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="6"/>
                <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
              </svg>
            </div>
            <h3 className="ue-card-title">IHK-Zertifizierung</h3>
            <p className="ue-card-text">
              Unsere Kurse sind auf die IHK-Prüfungsanforderungen abgestimmt.
              Du lernst nicht nur für die Praxis – du bekommst auch einen
              anerkannten Abschluss, der auf dem Arbeitsmarkt zählt.
            </p>
          </div>

        </section>

        {/* CTA */}
        <section className="ue-cta">
          <p className="ue-cta-text">Bereit loszulegen?</p>
          <div className="dl-hero-btns">
            <button className="dl-btn-primary" onClick={() => navigate("/register")}>
              Jetzt starten
            </button>
            <Link to="/" className="dl-btn-ghost">
              Zurück zur Startseite
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}