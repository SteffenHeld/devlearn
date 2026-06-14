import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import "../../styles/contact.css"

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
const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="M2 7l10 7 10-7"/>
  </svg>
);
const IconSend = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
);

export default function ContactPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";

  const [name, setName]       = useState<string>("");
  const [email, setEmail]     = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [sent, setSent]       = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className={`dl-contact-page${darkMode ? " dl-dark" : ""}`}>

      {/* Hintergrund */}
      <svg className="dl-auth-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" style={{ fill: "#c8c4f8", opacity: 0.3 }} />
        <polygon points="720,900 1440,900 1440,200" style={{ fill: "#b8eed8", opacity: 0.3 }} />
        <circle cx="160" cy="160" r="280" style={{ fill: "none", stroke: "#a8a4e8", strokeWidth: 0.8, opacity: 0.35 }} />
        <circle cx="1300" cy="740" r="220" style={{ fill: "none", stroke: "#5dbca0", strokeWidth: 0.8, opacity: 0.3 }} />
      </svg>

      {/* Top-Bar */}
      <header className="dl-contact-topbar">
        <div className="dl-contact-topbar-right">
          <span className="dl-contact-logo">
            Dev<span>Learn</span>
          </span>
          <button className="dl-theme-toggle" onClick={toggleTheme} aria-label={darkMode ? "Light Mode" : "Dark Mode"}>
            {darkMode ? <IconSun /> : <IconMoon />}
          </button>
        </div>
      </header>

      {/* Zentrierter Content */}
      <main className="dl-contact-main">
        <div className="dl-contact-icon">
          <IconMail />
        </div>

        <div style={{ width: "100%", maxWidth: 520, marginBottom: 8 }}>
          <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate("/")}>
            <IconBack /> Zurück
          </button>
        </div>

        {sent ? (
          <div className="dl-form-card" style={{ textAlign: "center" }}>
            <div style={{ fontSize: 44, marginBottom: 16 }}>✅</div>
            <h1 className="dl-form-title" style={{ textAlign: "center" }}>Nachricht gesendet!</h1>
            <p className="dl-form-sub" style={{ textAlign: "center" }}>
              Danke für deine Nachricht, {name}. Wir melden uns bald bei dir.
            </p>
            <button className="dl-btn dl-btn--primary" style={{ width: "100%", justifyContent: "center" }} onClick={() => navigate("/")}>
              Zurück zur Startseite
            </button>
          </div>
        ) : (
          <div className="dl-form-card">
            <h1 className="dl-form-title">Kontakt aufnehmen</h1>
            <p className="dl-form-sub">Wir helfen dir gerne weiter — schreib uns einfach.</p>

            <form onSubmit={handleSubmit} noValidate>
              <div className="dl-contact-grid">
                <div className="dl-field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    placeholder="Max Mustermann"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="dl-field">
                  <label htmlFor="contact-email">E-Mail</label>
                  <input
                    id="contact-email"
                    type="email"
                    placeholder="du@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                  />
                </div>
              </div>
              <div className="dl-field">
                <label htmlFor="contact-subject">Betreff</label>
                <input
                  id="contact-subject"
                  type="text"
                  placeholder="Worum geht es?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                />
              </div>
              <div className="dl-field">
                <label htmlFor="contact-message">Nachricht</label>
                <textarea
                  id="contact-message"
                  placeholder="Deine Nachricht…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  style={{ minHeight: 120 }}
                />
              </div>

              <button
                type="submit"
                className="dl-btn dl-btn--primary"
                style={{ width: "100%", justifyContent: "center", padding: "12px", marginTop: 4 }}
                disabled={loading}
              >
                {loading ? "Wird gesendet…" : <><IconSend /> Nachricht senden</>}
              </button>
            </form>

            <div className="dl-contact-footer">
              {[
                { icon: "📧", label: "E-Mail", value: "kontakt@devlearn.de" },
                { icon: "📍", label: "Standort", value: "Deutschland" },
              ].map((item) => (
                <div key={item.label} style={{ textAlign: "center" }}>
                  <p style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</p>
                  <p style={{ fontSize: 11, color: "var(--dl-text-faint)", textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 2 }}>{item.label}</p>
                  <p style={{ fontSize: 13, color: "var(--dl-text-muted)", fontWeight: 500 }}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}