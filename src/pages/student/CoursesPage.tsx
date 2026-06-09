import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import { useProgress } from "../../hooks/useProgress";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";
import CourseCard from "../../components/ui/CourseCard";

/* ── Icons ───────────────────────────────────────────────────────────────────── */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);

const CATEGORIES = ["Alle", "HTML/CSS/JS", "React/Vite/TS", "Figma", "Framer"];

export default function CoursesPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses, loading, error } = useCourses();
  const { progress } = useProgress();
  // role kommt direkt aus useAuth — kein (user as any).role nötig
  const { role } = useAuth();

  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Alle");

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Alle" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="dl-sidebar" aria-label="Navigation">
        <DevLearnLogo />
        <p className="dl-sidebar-section">Menü</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link" onClick={() => navigate("/dashboard")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          <button className="dl-sidebar-link active" aria-current="page">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Kurse
          </button>
        </nav>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate("/dashboard")}>
            <IconBack /> Dashboard
          </button>
          <div className="dl-topbar-actions">
            {/* Teacher-Button nur anzeigen wenn Rolle wirklich "teacher" ist */}
            {role === "teacher" && (
              <button className="dl-btn dl-btn--primary dl-btn--sm" onClick={() => navigate("/teacher/kurse")}>
                + Kurs verwalten
              </button>
            )}
            <ThemeToggleButton />
          </div>
        </div>

        <div className="dl-page">
          <div className="dl-page-header">
            <h1 className="dl-page-title">Alle Kurse</h1>
            <p className="dl-page-sub">Wähle einen Kurs und starte deinen nächsten Lernabschnitt.</p>
          </div>

          {/* Search + Filter */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28, alignItems: "center" }}>
            <div style={{ position: "relative", flex: "1 1 220px", maxWidth: 320 }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--dl-text-faint)", pointerEvents: "none" }}>
                <IconSearch />
              </span>
              <input
                type="search"
                placeholder="Kurs suchen…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%",
                  background: "var(--dl-bg-surface)",
                  border: "1px solid var(--dl-border)",
                  borderRadius: "var(--dl-radius-sm)",
                  padding: "9px 14px 9px 38px",
                  fontSize: 14,
                  color: "var(--dl-text-primary)",
                  fontFamily: "var(--dl-font)",
                  outline: "none",
                }}
                aria-label="Kurse suchen"
              />
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  style={{
                    padding: "7px 14px", borderRadius: 99, fontSize: 13,
                    fontFamily: "var(--dl-font)", cursor: "pointer",
                    fontWeight: activeCategory === cat ? 600 : 400,
                    border: activeCategory === cat ? "1.5px solid var(--dl-violet-400)" : "1px solid var(--dl-border)",
                    background: activeCategory === cat ? "var(--dl-violet-50)" : "transparent",
                    color: activeCategory === cat ? "var(--dl-violet-600)" : "var(--dl-text-muted)",
                    transition: "all 0.15s",
                  }}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* States */}
          {loading && (
            <div className="dl-empty">
              <p style={{ color: "var(--dl-text-faint)", fontSize: 14 }}>Kurse werden geladen…</p>
            </div>
          )}
          {error && <p className="dl-alert dl-alert--error">{error}</p>}

          {/* Kurs-Grid */}
          {!loading && filtered.length === 0 && (
            <div className="dl-empty">
              <div className="dl-empty-icon">🔍</div>
              <p className="dl-empty-text">Keine Kurse gefunden.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="dl-courses-grid">
              {filtered.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                progress={progress[course.id]}
              />
            ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}