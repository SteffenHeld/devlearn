import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import { useProgress } from "../../hooks/useProgress";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import CourseCard from "../../components/ui/CourseCard";

/* ── Icons ───────────────────────────────────────────────────────────────────── */
const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconBook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);
const IconClose = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconSun = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IconMoon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const CATEGORIES = ["Alle", "HTML/CSS/JS", "React/Vite/TS", "Figma", "Framer"];

export default function CoursesPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses, loading, error } = useCourses();
  const { progress } = useProgress();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState<string>("");
  const [activeCategory, setActiveCategory] = useState<string>("Alle");

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const initials = (user?.displayName ?? "S")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  const filtered = courses.filter((c) => {
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Alle" || c.category === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>

      {/* ── Overlay (Mobile) ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="dl-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className={`dl-sidebar${sidebarOpen ? " dl-sidebar--open" : ""}`} aria-label="Navigation">
        <DevLearnLogo />
        <p className="dl-sidebar-section">Menü</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/dashboard")}>
            <IconDashboard /> Dashboard
          </button>
          <button className="dl-sidebar-link active" aria-current="page">
            <IconBook /> Kurse
          </button>
          <div style={{ height: 1, background: "var(--dl-border)", margin: "8px 0" }} />
          <button className="dl-sidebar-link" onClick={toggleTheme}>
            {mode === "dark" ? <IconSun /> : <IconMoon />}
            {mode === "dark" ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
        <div className="dl-sidebar-footer">
          <div className="dl-sidebar-user">
            <div className="dl-avatar">{initials}</div>
            <div>
              <div className="dl-sidebar-user-name">{user?.displayName ?? "Student"}</div>
              <div className="dl-sidebar-user-role">Student</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <button
            className="dl-topbar-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Menü öffnen"
          >
            {sidebarOpen ? <IconClose /> : <IconMenu />}
          </button>
          <span className="dl-topbar-title">Alle Kurse</span>
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