import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import { useProgress } from "../../hooks/useProgress";
import type { CourseProgress } from "../../types";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";
import CourseCard from "../../components/ui/CourseCard";

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

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";
  const { user } = useAuth();
  const { courses } = useCourses();
  const { progress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    setSidebarOpen(false);
    navigate("/");
    await signOut(auth);
  };

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
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

      {/* ── Overlay (Mobile) ─────────────────────────────────────────────────── */}
      {sidebarOpen && (
        <div
          className="dl-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside
        className={`dl-sidebar${sidebarOpen ? " dl-sidebar--open" : ""}`}
        aria-label="Navigation"
      >
        <DevLearnLogo />

        <p className="dl-sidebar-section">Menü</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link active" aria-current="page">
            <IconDashboard /> Dashboard
          </button>
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/kurse")}>
            <IconBook /> Kurse
          </button>
          <button className="dl-sidebar-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            <IconAward /> Zertifikate
          </button>

          {/* Trennlinie + Abmelden direkt in der Nav */}
          <div style={{ height: 1, background: "var(--dl-border)", margin: "8px 0" }} />
          <button className="dl-sidebar-link" onClick={handleLogout} style={{ color: "var(--dl-coral-400)" }}>
            <IconLogout /> Abmelden
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
          {/* Hamburger (nur Mobile) */}
          <button
            className="dl-topbar-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Menü öffnen"
          >
            {sidebarOpen ? <IconClose /> : <IconMenu />}
          </button>

          <span className="dl-topbar-title">Übersicht</span>
          <div className="dl-topbar-actions">
            <ThemeToggleButton />
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
              <span className="dl-section-link" onClick={() => handleNavigate("/kurse")}>
                Alle ansehen →
              </span>
            </div>

            {courses.length === 0 ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📚</div>
                <p className="dl-empty-text">Noch keine Kurse verfügbar.</p>
                <button className="dl-btn dl-btn--primary" onClick={() => handleNavigate("/kurse")}>
                  Kurse entdecken
                </button>
              </div>
            ) : (
              <div className="dl-courses-grid">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={progress[course.id]}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}