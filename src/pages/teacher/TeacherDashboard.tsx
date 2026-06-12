import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import useCourses from "../../hooks/useCourses";
import type { Course } from "../../types";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import { useThemeToggle } from "../../context/ThemeContext";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

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
const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconX = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};
const CATEGORIES = ["HTML/CSS/JS", "React/Vite/TS", "Figma", "Framer"];
type Tab = "courses" | "students";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Korrekter Import aus context/AuthContext
  const { user } = useAuth();
  const { courses, addCourse } = useCourses();
  const [activeTab, setActiveTab] = useState<Tab>("courses");

  const [showForm, setShowForm]       = useState(false);
  const [newTitle, setNewTitle]       = useState("");
  const [newCategory, setNewCategory] = useState("HTML/CSS/JS");
  const [newDesc, setNewDesc]         = useState("");
  const [saving, setSaving]           = useState(false);
  const [formError, setFormError]     = useState("");

  const handleLogout = async () => {
  setSidebarOpen(false);
  navigate("/");
  await signOut(auth);
  };

  const handleNavigate = (path: string) => {
  setSidebarOpen(false);
  navigate(path);
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) { setFormError("Bitte einen Titel eingeben."); return; }
    setSaving(true); setFormError("");
    try {
      const newCourse = await addCourse({
        title: newTitle.trim(),
        category: newCategory,
        description: newDesc.trim(),
      });
      setNewTitle(""); setNewCategory("HTML/CSS/JS"); setNewDesc("");
      setShowForm(false);
      // Direkt zur Kursbearbeitungs-Seite navigieren wenn addCourse die ID zurückgibt
      if (newCourse?.id) navigate(`/teacher/kurse/${newCourse.id}`);
      else navigate("/teacher/kurse");
    } catch {
      setFormError("Fehler beim Erstellen. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (user?.displayName ?? "L")
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  // moduleCount/lessonCount können in alten Firestore-Dokumenten fehlen
  // daher direkt aus den geladenen modules/lessons zählen
  const totalModules = courses.reduce(
    (sum, c) => sum + (c.modules?.length ?? 0), 0
  );
  const totalLessons = courses.reduce(
    (sum, c) => sum + (c.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0), 0
  );

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
        <p className="dl-sidebar-section">Lehrer-Panel</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link active" aria-current="page">
            <IconDashboard /> Dashboard
          </button>
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/teacher/kurse")}>
            <IconBook /> Kurse verwalten
          </button>
          {/* Schüler-Verwaltung noch nicht implementiert — deaktiviert */}
          <button className="dl-sidebar-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            <IconUsers /> Schüler
          </button>
        </nav>
        <div className="dl-sidebar-footer">
          <button className="dl-sidebar-link" onClick={handleLogout} style={{ color: "var(--dl-coral-400)" }}>
            <IconLogout /> Abmelden
          </button>
          <div className="dl-sidebar-user" style={{ marginTop: 8 }}>
            <div className="dl-avatar">{initials}</div>
            <div>
              <div className="dl-sidebar-user-name">{user?.displayName ?? "Lehrer"}</div>
              <div className="dl-sidebar-user-role">Lehrer</div>
            </div>
          </div>
        </div>
      </aside>

      <main className="dl-main">
        <div className="dl-topbar">
            <button
              className="dl-topbar-menu-btn"
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label="Menü öffnen"
            >
              {sidebarOpen ? <IconX /> : <IconMenu />}
            </button>
            <span className="dl-topbar-title">Lehrer-Dashboard</span>
          <div className="dl-topbar-actions">
            <button className="dl-btn dl-btn--primary dl-btn--sm" onClick={() => setShowForm(true)}>
              <IconPlus /> Neuer Kurs
            </button>
            <ThemeToggleButton />
          </div>
        </div>

        <div className="dl-page">
          <div className="dl-page-header">
            <h1 className="dl-page-title">Hallo, {user?.displayName?.split(" ")[0] ?? "Lehrer"} 👋</h1>
            <p className="dl-page-sub">Verwalte deine Kurse, Module und Lektionen.</p>
          </div>

          {/* Stats */}
          <div className="dl-stats-grid">
            <div className="dl-stat">
              <p className="dl-stat-label">Kurse</p>
              <p className="dl-stat-value dl-stat-value--violet">{courses.length}</p>
            </div>
            <div className="dl-stat">
              <p className="dl-stat-label">Module</p>
              <p className="dl-stat-value">
                {totalModules}
              </p>
            </div>
            <div className="dl-stat">
              <p className="dl-stat-label">Lektionen</p>
              <p className="dl-stat-value dl-stat-value--teal">{totalLessons}</p>
            </div>
          </div>

          {/* Neuer-Kurs-Formular — inline eingeblendet */}
          {showForm && (
            <div className="dl-card" style={{ marginBottom: 24, borderColor: "var(--dl-violet-200)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h2 style={{ fontSize: 15, fontWeight: 600, color: "var(--dl-text-primary)", margin: 0 }}>
                  Neuen Kurs erstellen
                </h2>
                <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => { setShowForm(false); setFormError(""); }}>
                  <IconX />
                </button>
              </div>
              <form onSubmit={handleCreateCourse} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="dl-field">
                    <label htmlFor="new-course-title">Kursname</label>
                    <input
                      id="new-course-title"
                      type="text"
                      placeholder="z.B. HTML & CSS Grundlagen"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                  <div className="dl-field">
                    <label htmlFor="new-course-cat">Kategorie</label>
                    <select id="new-course-cat" value={newCategory} onChange={(e) => setNewCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="dl-field">
                  <label htmlFor="new-course-desc">Beschreibung (optional)</label>
                  <textarea
                    id="new-course-desc"
                    placeholder="Kurze Beschreibung des Kurses…"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    style={{ minHeight: 72 }}
                  />
                </div>
                {formError && <p className="dl-alert dl-alert--error">{formError}</p>}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="dl-btn dl-btn--ghost" onClick={() => { setShowForm(false); setFormError(""); }}>
                    Abbrechen
                  </button>
                  <button type="submit" className="dl-btn dl-btn--primary" disabled={saving}>
                    {saving ? "Wird erstellt…" : "Kurs erstellen"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: "1px solid var(--dl-border)" }}>
            {(["courses", "students"] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  background: "transparent", border: "none",
                  borderBottom: activeTab === tab ? "2px solid var(--dl-violet-400)" : "2px solid transparent",
                  padding: "10px 16px", fontFamily: "var(--dl-font)", fontSize: 14,
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? "var(--dl-violet-400)" : "var(--dl-text-muted)",
                  cursor: "pointer", marginBottom: -1, transition: "color 0.15s, border-color 0.15s",
                }}
                aria-selected={activeTab === tab}
              >
                {tab === "courses" ? "Meine Kurse" : "Schüler"}
              </button>
            ))}
          </div>

          {/* Kurse Tab */}
          {activeTab === "courses" && (
            <div className="dl-section">
              {courses.length === 0 && !showForm ? (
                <div className="dl-empty">
                  <div className="dl-empty-icon">📚</div>
                  <p className="dl-empty-text">Noch keine Kurse vorhanden.</p>
                  <button className="dl-btn dl-btn--primary" onClick={() => setShowForm(true)}>
                    <IconPlus /> Ersten Kurs erstellen
                  </button>
                </div>
              ) : (
                <div className="dl-table-wrap">
                  <table className="dl-table">
                    <thead>
                      <tr>
                        <th>Kurs</th><th>Kategorie</th><th>Module</th><th>Lektionen</th><th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {courses.map((course: Course) => {
                        const cat = course.category ?? "HTML/CSS/JS";
                        return (
                          <tr key={course.id}>
                            <td>
                              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <span style={{ fontSize: 20 }}>{bannerEmoji[cat] ?? "📖"}</span>
                                <span style={{ fontWeight: 500 }}>{course.title}</span>
                              </div>
                            </td>
                            <td><span className="dl-badge dl-badge--violet">{cat}</span></td>
                            <td style={{ color: "var(--dl-text-muted)" }}>{course.moduleCount ?? 0}</td>
                            <td style={{ color: "var(--dl-text-muted)" }}>{course.lessonCount ?? 0}</td>
                            <td>
                              <button
                                className="dl-btn dl-btn--ghost dl-btn--sm"
                                onClick={() => navigate(`/teacher/kurse/${course.id}`)}
                              >
                                <IconEdit /> Bearbeiten
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Schüler Tab — noch nicht implementiert */}
          {activeTab === "students" && (
            <div className="dl-empty">
              <div className="dl-empty-icon">👥</div>
              <p className="dl-empty-text">Schüler-Verwaltung kommt bald.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}