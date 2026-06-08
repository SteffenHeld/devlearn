import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import { useProgress } from "../../hooks/useProgress";
import type { CourseProgress } from "../../types";

/* ── Icons ───────────────────────────────────────────────────────────────────── */
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
const IconAward = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
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

const bannerColor: Record<string, string> = {
  "HTML/CSS/JS": "--violet", "React/Vite/TS": "--teal", "Figma": "--amber", "Framer": "--coral",
};
const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { user } = useAuth();
  const { courses } = useCourses();
  const { progress } = useProgress();

  const handleLogout = async () => {
    navigate("/");
    await signOut(auth);
  };

  const firstName = user?.displayName?.split(" ")[0] ?? "Student";
  const initials = (user?.displayName ?? "S")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const completedCourses = courses.filter((c) => {
    const p: CourseProgress | undefined = progress[c.id];
    if (!p) return false;
    const total = c.lessonCount ?? 0;
    return total > 0 && p.completed >= total;
  }).length;

  const totalLessons = courses.reduce((sum, c) => sum + (c.lessonCount ?? 0), 0);
  const completedLessons = Object.values(progress).reduce(
    (sum, p) => sum + (p.completed ?? 0), 0
  );
  const avgProgress = courses.length
    ? Math.round(
        courses.reduce((sum, c) => {
          const p: CourseProgress | undefined = progress[c.id];
          const total = c.lessonCount ?? 0;
          return sum + (total > 0 ? ((p?.completed ?? 0) / total) * 100 : 0);
        }, 0) / courses.length
      )
    : 0;

  return (
    <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="dl-sidebar" aria-label="Navigation">
        <div className="dl-sidebar-logo">Dev<span>Learn</span></div>

        <p className="dl-sidebar-section">Menü</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link active" aria-current="page">
            <IconDashboard /> Dashboard
          </button>
          <button className="dl-sidebar-link" onClick={() => navigate("/kurse")}>
            <IconBook /> Kurse
          </button>
          {/* Zertifikate noch nicht implementiert — deaktiviert */}
          <button className="dl-sidebar-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            <IconAward /> Zertifikate
          </button>
        </nav>

        <div className="dl-sidebar-footer">
          <button className="dl-sidebar-link" onClick={handleLogout} style={{ color: "var(--dl-coral-400)" }}>
            <IconLogout /> Abmelden
          </button>
          <div className="dl-sidebar-user" style={{ marginTop: 8 }}>
            <div className="dl-avatar">{initials}</div>
            <div>
              <div className="dl-sidebar-user-name">{user?.displayName ?? "Student"}</div>
              <div className="dl-sidebar-user-role">Student</div>
            </div>
          </div>
        </div>
      </aside>

      {/* ── Hauptbereich ─────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <span className="dl-topbar-title">Übersicht</span>
          <div className="dl-topbar-actions">
            <button className="dl-theme-toggle" onClick={toggleTheme} aria-label={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </div>

        <div className="dl-page">
          <div className="dl-page-header">
            <h1 className="dl-page-title">Willkommen zurück, {firstName} 👋</h1>
            <p className="dl-page-sub">Hier ist dein aktueller Lernfortschritt.</p>
          </div>

          {/* Stats */}
          <div className="dl-stats-grid">
            <div className="dl-stat">
              <p className="dl-stat-label">Kurse gesamt</p>
              <p className="dl-stat-value dl-stat-value--violet">{courses.length}</p>
            </div>
            <div className="dl-stat">
              <p className="dl-stat-label">Abgeschlossen</p>
              <p className="dl-stat-value dl-stat-value--teal">{completedCourses}</p>
            </div>
            <div className="dl-stat">
              <p className="dl-stat-label">Lektionen</p>
              <p className="dl-stat-value">
                {completedLessons}
                <span style={{ fontSize: 16, color: "var(--dl-text-faint)", fontWeight: 400 }}>
                  /{totalLessons}
                </span>
              </p>
            </div>
            <div className="dl-stat">
              <p className="dl-stat-label">Ø Fortschritt</p>
              <p className="dl-stat-value dl-stat-value--amber">{avgProgress}%</p>
            </div>
          </div>

          {/* Kurse */}
          <div className="dl-section">
            <div className="dl-section-header">
              <h2 className="dl-section-title">Deine Kurse</h2>
              <span className="dl-section-link" onClick={() => navigate("/kurse")}>
                Alle ansehen →
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📚</div>
                <p className="dl-empty-text">Noch keine Kurse verfügbar.</p>
                <button className="dl-btn dl-btn--primary" onClick={() => navigate("/kurse")}>
                  Kurse entdecken
                </button>
              </div>
            ) : (
              <div className="dl-courses-grid">
                {courses.map((course) => {
                  const p: CourseProgress | undefined = progress[course.id];
                  const total = course.lessonCount ?? 0;
                  const done = p?.completed ?? 0;
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  const cat = course.category ?? "HTML/CSS/JS";
                  const variant = bannerColor[cat] ?? "--violet";
                  const isComplete = pct === 100;

                  return (
                    <div
                      key={course.id}
                      className="dl-course-card"
                      // Korrekter deutscher URL-Pfad
                      onClick={() => navigate(`/kurse/${course.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/kurse/${course.id}`)}
                      aria-label={`Kurs: ${course.title}`}
                    >
                      <div className={`dl-course-banner dl-course-banner${variant}`}>
                        <span className="dl-course-icon">{bannerEmoji[cat] ?? "📖"}</span>
                        {isComplete && (
                          <span className="dl-badge dl-badge--teal" style={{ marginLeft: "auto" }}>
                            <IconCheck /> Fertig
                          </span>
                        )}
                      </div>
                      <div className="dl-course-body">
                        <p className="dl-course-title">{course.title}</p>
                        <p className="dl-course-meta">
                          {course.moduleCount ?? 0} Module · {total} Lektionen
                        </p>
                        <div className="dl-progress">
                          <div
                            className={`dl-progress-fill dl-progress-fill${isComplete ? "--teal" : "--violet"}`}
                            style={{ width: `${pct}%` }}
                            role="progressbar"
                            aria-valuenow={pct}
                            aria-valuemin={0}
                            aria-valuemax={100}
                          />
                        </div>
                        <p className="dl-progress-label">{pct}% abgeschlossen</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}