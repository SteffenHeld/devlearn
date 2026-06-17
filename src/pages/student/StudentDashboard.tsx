import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import { useProgress } from "../../hooks/useProgress";
import type { CourseProgress } from "../../types";
import Sidebar from "../../components/ui/Sidebar";
import CourseCard from "../../components/ui/CourseCard";

/* ── Icons ───────────────────────────────────────────────────────────────── */
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

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const firstName = user?.displayName?.split(" ")[0] ?? "Student";

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

      {sidebarOpen && (
        <div
          className="dl-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="dashboard" />

      <main className="dl-main">
        <div className="dl-topbar">
          <button
            className="dl-topbar-menu-btn"
            onClick={() => setSidebarOpen((prev) => !prev)}
            aria-label="Menü öffnen"
          >
            {sidebarOpen ? <IconClose /> : <IconMenu />}
          </button>
          <span className="dl-topbar-title">Übersicht</span>
        </div>

        <div className="dl-page">
          <div className="dl-page-header">
            <h1 className="dl-page-title">Willkommen zurück, {firstName} 👋</h1>
            <p className="dl-page-sub">Hier ist dein aktueller Lernfortschritt.</p>
          </div>

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