import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import useCourses from "../../hooks/useCourses";
import type { Course } from "../../types";
import DevLearnLogo from "../../components/ui/DevLearnLogo";

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconEye = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
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

const CATEGORIES = ["HTML/CSS/JS", "React/Vite/TS", "Figma", "Framer"];
const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};

export default function TeacherCoursesPage() {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses, addCourse } = useCourses();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [showForm, setShowForm]       = useState<boolean>(false);
  const [title, setTitle]             = useState<string>("");
  const [category, setCategory]       = useState<string>("HTML/CSS/JS");
  const [description, setDescription] = useState<string>("");
  const [saving, setSaving]           = useState<boolean>(false);
  const [error, setError]             = useState<string>("");

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { setError("Bitte einen Titel eingeben."); return; }
    setSaving(true);
    setError("");
    try {
      await addCourse({ title: title.trim(), category, description: description.trim() });
      setTitle(""); setCategory("HTML/CSS/JS"); setDescription("");
      setShowForm(false);
    } catch {
      setError("Fehler beim Erstellen. Bitte erneut versuchen.");
    } finally {
      setSaving(false);
    }
  };

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
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/teacher/dashboard")}>
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
            Kurse verwalten
          </button>
           <div style={{ height: 1, background: "var(--dl-border)", margin: "8px 0" }} />
            <button className="dl-sidebar-link" onClick={toggleTheme}>
              {mode === "dark" ? <IconSun /> : <IconMoon />}
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
        </nav>
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
          <span className="dl-topbar-title">Kurse verwalten</span>
        </div>

        <div className="dl-page">
          <div className="dl-page-header">
            <h1 className="dl-page-title">Kurse verwalten</h1>
            <p className="dl-page-sub">Erstelle und bearbeite deine Kurse, Module und Lektionen.</p>
          </div>

          {showForm && (
            <div className="dl-card" style={{ marginBottom: 28, borderColor: "var(--dl-violet-200)" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "var(--dl-text-primary)", marginBottom: 20 }}>
                Neuen Kurs erstellen
              </h2>
              <form onSubmit={handleCreate} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="dl-field">
                    <label htmlFor="tc-title">Kursname</label>
                    <input id="tc-title" type="text" placeholder="z.B. HTML & CSS Grundlagen" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>
                  <div className="dl-field">
                    <label htmlFor="tc-category">Kategorie</label>
                    <select id="tc-category" value={category} onChange={(e) => setCategory(e.target.value)}>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="dl-field">
                  <label htmlFor="tc-desc">Beschreibung (optional)</label>
                  <textarea id="tc-desc" placeholder="Kurze Beschreibung des Kurses…" value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 72 }} />
                </div>
                {error && <p className="dl-alert dl-alert--error">{error}</p>}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="dl-btn dl-btn--ghost" onClick={() => { setShowForm(false); setError(""); }}>Abbrechen</button>
                  <button type="submit" className="dl-btn dl-btn--primary" disabled={saving}>
                    {saving ? "Wird erstellt…" : "Kurs erstellen"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {courses.length === 0 && !showForm ? (
            <div className="dl-empty">
              <div className="dl-empty-icon">📚</div>
              <p className="dl-empty-text">Noch keine Kurse vorhanden. Erstelle deinen ersten Kurs!</p>
              <button className="dl-btn dl-btn--primary" onClick={() => setShowForm(true)}>
                <IconPlus /> Ersten Kurs erstellen
              </button>
            </div>
          ) : (
            <div className="dl-table-wrap">
              <table className="dl-table">
                <thead>
                  <tr>
                    <th>Kurs</th>
                    <th>Kategorie</th>
                    <th>Module</th>
                    <th>Lektionen</th>
                    <th style={{ width: 160 }}>Aktionen</th>
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
                        <td style={{ color: "var(--dl-text-muted)" }}>{course.modules?.length ?? 0}</td>
                        <td style={{ color: "var(--dl-text-muted)" }}>{course.modules?.reduce((s, m) => s + (m.lessons?.length ?? 0), 0) ?? 0}</td>
                        <td>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button className="dl-btn dl-btn--subtle dl-btn--sm" onClick={() => handleNavigate(`/teacher/kurse/${course.id}`)}>
                              <IconEdit /> Bearbeiten
                            </button>
                            <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => handleNavigate(`/kurse/${course.slug ?? course.id}`)} title="Studentenansicht">
                              <IconEye />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}