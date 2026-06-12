import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import useCourses from "../../hooks/useCourses";
import type { Course, Module } from "../../types";
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
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconChevron = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="9 18 15 12 9 6"/>
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

const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};

export default function TeacherCourseDetailPage() {
  const { kursId } = useParams<{ kursId: string }>();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses, addModule, updateCourse } = useCourses();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const course = courses.find((c: Course) => c.id === kursId);
  const modules: Module[] = course?.modules ?? [];

  const [showModuleForm, setShowModuleForm] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle]       = useState<string>("");
  const [moduleDesc, setModuleDesc]         = useState<string>("");
  const [savingModule, setSavingModule]     = useState<boolean>(false);
  const [moduleError, setModuleError]       = useState<string>("");

  const [editMode, setEditMode]         = useState<boolean>(false);
  const [editTitle, setEditTitle]       = useState<string>(course?.title ?? "");
  const [editDesc, setEditDesc]         = useState<string>(course?.description ?? "");
  const [savingCourse, setSavingCourse] = useState<boolean>(false);

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  if (!course) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main"><div className="dl-page">
          <div className="dl-empty">
            <div className="dl-empty-icon">🔍</div>
            <p className="dl-empty-text">Kurs nicht gefunden.</p>
            <button className="dl-btn dl-btn--ghost" onClick={() => navigate("/teacher/kurse")}>
              <IconBack /> Zurück
            </button>
          </div>
        </div></main>
      </div>
    );
  }

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!moduleTitle.trim()) { setModuleError("Bitte einen Titel eingeben."); return; }
    setSavingModule(true); setModuleError("");
    try {
      await addModule(kursId!, { title: moduleTitle.trim(), description: moduleDesc.trim() });
      setModuleTitle(""); setModuleDesc(""); setShowModuleForm(false);
    } catch {
      setModuleError("Fehler beim Erstellen.");
    } finally {
      setSavingModule(false);
    }
  };

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingCourse(true);
    try {
      await updateCourse(kursId!, { title: editTitle, description: editDesc });
      setEditMode(false);
    } catch { /* ignore */ }
    finally { setSavingCourse(false); }
  };

  const cat = course.category ?? "HTML/CSS/JS";

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
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/teacher/kurse")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Kurse verwalten
          </button>
          <div className="dl-sidebar-link active" style={{ cursor: "default" }}>
            <span style={{ fontSize: 17 }}>{bannerEmoji[cat] ?? "📖"}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</span>
          </div>
           <div style={{ height: 1, background: "var(--dl-border)", margin: "8px 0" }} />
            <button className="dl-sidebar-link" onClick={toggleTheme}>
              {mode === "dark" ? <IconSun /> : <IconMoon />}
              {mode === "dark" ? "Light Mode" : "Dark Mode"}
            </button>
        </nav>

        {modules.length > 0 && (
          <>
            <p className="dl-sidebar-section" style={{ marginTop: 16 }}>Module</p>
            <nav className="dl-sidebar-nav">
              {modules.map((mod: Module, i: number) => (
                <button
                  key={mod.id}
                  className="dl-sidebar-link"
                  style={{ fontSize: 13 }}
                  onClick={() => handleNavigate(`/teacher/kurse/${kursId}/${mod.id}`)}
                >
                  <span style={{
                    width: 20, height: 20, borderRadius: "50%",
                    background: "var(--dl-violet-50)", color: "var(--dl-violet-600)",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    fontSize: 11, fontWeight: 600, flexShrink: 0,
                  }}>{i + 1}</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</span>
                </button>
              ))}
            </nav>
          </>
        )}
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
          <span className="dl-topbar-title">{course.title}</span>
        </div>

        <div className="dl-page">
          <nav className="dl-breadcrumb" aria-label="Breadcrumb">
            <span role="button" onClick={() => handleNavigate("/teacher/kurse")}>Kurse</span>
            <span className="dl-breadcrumb-sep">/</span>
            <span className="dl-breadcrumb-current">{course.title}</span>
          </nav>

          {/* Kurs-Header mit Edit */}
          <div className="dl-card" style={{ marginBottom: 28 }}>
            {editMode ? (
              <form onSubmit={handleSaveCourse}>
                <div className="dl-field">
                  <label htmlFor="edit-course-title">Kursname</label>
                  <input id="edit-course-title" type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                </div>
                <div className="dl-field">
                  <label htmlFor="edit-course-desc">Beschreibung</label>
                  <textarea id="edit-course-desc" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{ minHeight: 72 }} />
                </div>
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="dl-btn dl-btn--ghost" onClick={() => setEditMode(false)}>Abbrechen</button>
                  <button type="submit" className="dl-btn dl-btn--primary" disabled={savingCourse}>
                    {savingCourse ? "Speichert…" : "Speichern"}
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ fontSize: 36 }}>{bannerEmoji[cat] ?? "📖"}</span>
                  <div>
                    <h1 className="dl-page-title" style={{ marginBottom: 4 }}>{course.title}</h1>
                    {course.description && <p className="dl-page-sub">{course.description}</p>}
                    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                      <span className="dl-badge dl-badge--violet">{cat}</span>
                      <span className="dl-badge dl-badge--gray">{modules.length} Module</span>
                      <span className="dl-badge dl-badge--gray">{course.lessonCount ?? 0} Lektionen</span>
                    </div>
                  </div>
                </div>
                <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => { setEditTitle(course.title); setEditDesc(course.description ?? ""); setEditMode(true); }}>
                  <IconEdit /> Bearbeiten
                </button>
              </div>
            )}
          </div>

          {/* Neues Modul – Formular */}
          {showModuleForm && (
            <div className="dl-card" style={{ marginBottom: 20, borderColor: "var(--dl-violet-200)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "var(--dl-text-primary)" }}>Neues Modul</h2>
              <form onSubmit={handleAddModule} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 16px" }}>
                  <div className="dl-field">
                    <label htmlFor="mod-title">Modulname</label>
                    <input id="mod-title" type="text" placeholder="z.B. Grundlagen" value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} required />
                  </div>
                  <div className="dl-field">
                    <label htmlFor="mod-desc">Beschreibung (optional)</label>
                    <input id="mod-desc" type="text" placeholder="Kurze Modulbeschreibung" value={moduleDesc} onChange={(e) => setModuleDesc(e.target.value)} />
                  </div>
                </div>
                {moduleError && <p className="dl-alert dl-alert--error">{moduleError}</p>}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="dl-btn dl-btn--ghost" onClick={() => { setShowModuleForm(false); setModuleError(""); }}>Abbrechen</button>
                  <button type="submit" className="dl-btn dl-btn--primary" disabled={savingModule}>
                    {savingModule ? "Erstellt…" : "Modul erstellen"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Modul-Liste */}
          <div className="dl-section">
            <div className="dl-section-header">
              <h2 className="dl-section-title">Module ({modules.length})</h2>
              {modules.length > 0 && (
                <button className="dl-btn dl-btn--subtle dl-btn--sm" onClick={() => setShowModuleForm(true)}>
                  <IconPlus /> Modul hinzufügen
                </button>
              )}
            </div>
            {modules.length === 0 && !showModuleForm ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📦</div>
                <p className="dl-empty-text">Noch keine Module. Füge das erste hinzu.</p>
                <button className="dl-btn dl-btn--primary" onClick={() => setShowModuleForm(true)}>
                  <IconPlus /> Erstes Modul erstellen
                </button>
              </div>
            ) : (
              <div className="dl-module-list">
                {modules.map((mod: Module, i: number) => (
                  <div
                    key={mod.id}
                    className="dl-module-item"
                    onClick={() => handleNavigate(`/teacher/kurse/${kursId}/${mod.id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && handleNavigate(`/teacher/kurse/${kursId}/${mod.id}`)}
                  >
                    <div className="dl-module-num">{i + 1}</div>
                    <div className="dl-module-info">
                      <p className="dl-module-name">{mod.title}</p>
                      <p className="dl-module-sub">
                        {mod.lessonCount ?? 0} Lektionen
                        {mod.description ? ` · ${mod.description}` : ""}
                      </p>
                    </div>
                    <span style={{ color: "var(--dl-text-faint)" }}><IconChevron /></span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}