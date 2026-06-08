import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import useCourses from "../../hooks/useCourses";
import "../../styles/LandingPage.css";

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);

const CATEGORIES = ["Alle", "HTML/CSS/JS", "React/Vite/TS", "Figma", "Framer"];
const bannerColor: Record<string, string> = {
  "HTML/CSS/JS": "--violet", "React/Vite/TS": "--teal", "Figma": "--amber", "Framer": "--coral",
};
const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};

export default function PublicCoursesPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses } = useCourses();

  const [search, setSearch]           = useState<string>("");
  const [activeCategory, setCategory] = useState<string>("Alle");

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === "Alle" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className={`dl-landing${darkMode ? " dl-dark" : ""}`} style={{ minHeight: "100vh" }}>

      {/* Hintergrund – identisch zur LandingPage */}
      <svg className="dl-diag-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" className="dl-zone-purple" />
        <polygon points="720,900 1440,900 1440,200" className="dl-zone-teal" />
        <line x1="0" y1="0" x2="1440" y2="900" className="dl-diag-line" />
        <line x1="1440" y1="0" x2="720" y2="900" className="dl-diag-line dl-diag-line--2" />
        <circle cx="120" cy="450" r="320" className="dl-deco-circle dl-deco-circle--left" />
        <circle cx="1320" cy="450" r="260" className="dl-deco-circle dl-deco-circle--right" />
      </svg>

      {/* Header */}
      <header className="dl-header">
        <Link to="/" className="dl-logo">Dev<span>Learn</span></Link>
        <nav className="dl-nav">
          <Link to="/kurse-entdecken">Kurse</Link>
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
        <button className="dl-register-btn" onClick={() => navigate("/register")}>
          Registrieren
        </button>
      </header>

      {/* Content */}
      <main style={{ position: "relative", zIndex: 10, padding: "48px 48px 80px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Hero-Text */}
        <div style={{ marginBottom: 40 }}>
          <span className="dl-hero-tag">Kursangebot</span>
          <h1 className="dl-hero-title" style={{ maxWidth: 560 }}>
            Alle Kurse auf einen Blick
          </h1>
          <p className="dl-hero-sub">
            Von HTML-Grundlagen bis React – starte kostenlos und lerne in deinem Tempo.
          </p>
        </div>

        {/* Search + Filter */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 36, alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#7878a0", pointerEvents: "none" }}>
              <IconSearch />
            </span>
            <input
              type="search"
              placeholder="Kurs suchen…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255,255,255,0.72)",
                border: "1px solid rgba(127,119,221,0.22)",
                borderRadius: 10,
                padding: "10px 14px 10px 38px",
                fontSize: 14,
                color: "#1a1a2e",
                fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                outline: "none",
                backdropFilter: "blur(4px)",
              }}
              aria-label="Kurse suchen"
            />
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: "7px 14px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
                  fontWeight: activeCategory === cat ? 600 : 400,
                  cursor: "pointer",
                  border: activeCategory === cat ? "1.5px solid #7F77DD" : "1px solid rgba(127,119,221,0.25)",
                  background: activeCategory === cat ? "rgba(127,119,221,0.15)" : "rgba(255,255,255,0.5)",
                  color: activeCategory === cat ? "#534AB7" : "#4a4a6a",
                  transition: "all 0.15s",
                  backdropFilter: "blur(4px)",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Kurs-Grid */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#7878a0" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 16 }}>Keine Kurse gefunden.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {filtered.map((course) => {
              const cat = course.category ?? "HTML/CSS/JS";
              const variant = bannerColor[cat] ?? "--violet";

              return (
                <div
                  key={course.id}
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.6)",
                    borderRadius: 16,
                    overflow: "hidden",
                    cursor: "pointer",
                    transition: "transform 0.15s, box-shadow 0.2s",
                  }}
                  onClick={() => navigate("/register")}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === "Enter" && navigate("/register")}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px rgba(83,74,183,0.16)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "";
                  }}
                  aria-label={`Kurs: ${course.title} – Klicke um dich zu registrieren`}
                >
                  {/* Banner */}
                  <div className={`dl-course-banner dl-course-banner${variant}`}
                    style={{ height: 72, display: "flex", alignItems: "center", padding: "0 20px", gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{bannerEmoji[cat] ?? "📖"}</span>
                    <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.4px", textTransform: "uppercase", color: "var(--dl-text-faint)" }}>
                      {cat}
                    </span>
                  </div>

                  {/* Body */}
                  <div style={{ padding: "16px 20px 20px" }}>
                    <p style={{ fontSize: 15, fontWeight: 600, color: "#1a1a2e", marginBottom: 4 }}>{course.title}</p>
                    <p style={{ fontSize: 12, color: "#7878a0", marginBottom: 16 }}>
                      {course.moduleCount ?? 0} Module · {course.lessonCount ?? 0} Lektionen
                    </p>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                        background: "rgba(127,119,221,0.12)", color: "#534AB7",
                      }}>Kostenlos starten</span>
                      <span style={{ color: "#7F77DD" }}><IconArrow /></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA unten */}
        <div style={{
          marginTop: 56, textAlign: "center",
          padding: "40px 32px",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(8px)",
          borderRadius: 20,
          border: "1px solid rgba(255,255,255,0.6)",
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: "#1a1a2e", marginBottom: 10, letterSpacing: "-0.3px" }}>
            Bereit loszulegen?
          </h2>
          <p style={{ fontSize: 15, color: "#4a4a6a", marginBottom: 24, lineHeight: 1.7 }}>
            Registriere dich kostenlos und starte deinen ersten Kurs noch heute.
          </p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="dl-btn-primary" onClick={() => navigate("/register")}>
              Jetzt kostenlos starten
            </button>
            <Link to="/" className="dl-btn-ghost">
              Zurück zur Startseite
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}