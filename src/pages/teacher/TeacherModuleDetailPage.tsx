import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";
import useCourses from "../../hooks/useCourses";
import type { Course, Module, Lesson } from "../../types";

const IconPlus = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
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

const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "React/Vite/TS": "⚛️", "Figma": "🎨", "Framer": "🪄",
};

export default function TeacherModuleDetailPage() {
  const { kursId, modulId } = useParams<{ kursId: string; modulId: string }>();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { courses, addLesson } = useCourses();

  const course = courses.find((c: Course) => c.id === kursId);
  const mod = course?.modules?.find((m: Module) => m.id === modulId);
  const lessons: Lesson[] = mod?.lessons ?? [];

  const [showLessonForm, setShowLessonForm] = useState<boolean>(false);
  const [lessonTitle, setLessonTitle]       = useState<string>("");
  const [lessonContent, setLessonContent]   = useState<string>("");
  const [lessonDuration, setLessonDuration] = useState<string>("");
  const [savingLesson, setSavingLesson]     = useState<boolean>(false);
  const [lessonError, setLessonError]       = useState<string>("");

  if (!course || !mod) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main"><div className="dl-page">
          <div className="dl-empty">
            <div className="dl-empty-icon">🔍</div>
            <p className="dl-empty-text">Modul nicht gefunden.</p>
            <button className="dl-btn dl-btn--ghost" onClick={() => navigate(`/teacher/kurse/${kursId}`)}>
              <IconBack /> Zurück
            </button>
          </div>
        </div></main>
      </div>
    );
  }

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonTitle.trim()) { setLessonError("Bitte einen Titel eingeben."); return; }
    setSavingLesson(true); setLessonError("");
    try {
      await addLesson(kursId!, modulId!, {
        title: lessonTitle.trim(),
        content: lessonContent.trim(),
        // duration ist number in types.ts — 0 statt null wenn leer
        duration: lessonDuration ? parseInt(lessonDuration) : 0,
      });
      setLessonTitle(""); setLessonContent(""); setLessonDuration("");
      setShowLessonForm(false);
    } catch {
      setLessonError("Fehler beim Erstellen.");
    } finally {
      setSavingLesson(false);
    }
  };

  const cat = course.category ?? "HTML/CSS/JS";
  const modIndex = (course.modules ?? []).findIndex((m: Module) => m.id === modulId);

  return (
    <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="dl-sidebar" aria-label="Navigation">
        <div className="dl-sidebar-logo">Dev<span>Learn</span></div>
        <p className="dl-sidebar-section">Lehrer-Panel</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link" onClick={() => navigate("/teacher/kurse")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Kurse
          </button>
          <button className="dl-sidebar-link" onClick={() => navigate(`/teacher/kurse/${kursId}`)}>
            <span style={{ fontSize: 17 }}>{bannerEmoji[cat] ?? "📖"}</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{course.title}</span>
          </button>
          <div className="dl-sidebar-link active" style={{ cursor: "default" }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--dl-violet-50)", color: "var(--dl-violet-600)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>
              {modIndex + 1}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{mod.title}</span>
          </div>
        </nav>
        {lessons.length > 0 && (
          <>
            <p className="dl-sidebar-section" style={{ marginTop: 16 }}>Lektionen</p>
            <nav className="dl-sidebar-nav">
              {lessons.map((l: Lesson, i: number) => (
                <div key={l.id} className="dl-sidebar-link" style={{ fontSize: 12, cursor: "default", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--dl-text-faint)", minWidth: 16 }}>{i + 1}.</span>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{l.title}</span>
                </div>
              ))}
            </nav>
          </>
        )}
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate(`/teacher/kurse/${kursId}`)}>
            <IconBack /> {course.title}
          </button>
          <div className="dl-topbar-actions">
            <button className="dl-btn dl-btn--primary dl-btn--sm" onClick={() => setShowLessonForm(true)}>
              <IconPlus /> Neue Lektion
            </button>
            <button className="dl-theme-toggle" onClick={toggleTheme} aria-label={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </div>

        <div className="dl-page">
          <nav className="dl-breadcrumb" aria-label="Breadcrumb">
            <span role="button" onClick={() => navigate("/teacher/kurse")}>Kurse</span>
            <span className="dl-breadcrumb-sep">/</span>
            <span role="button" onClick={() => navigate(`/teacher/kurse/${kursId}`)}>{course.title}</span>
            <span className="dl-breadcrumb-sep">/</span>
            <span className="dl-breadcrumb-current">{mod.title}</span>
          </nav>

          <div className="dl-page-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div>
                <h1 className="dl-page-title">{mod.title}</h1>
                {mod.description && <p className="dl-page-sub">{mod.description}</p>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="dl-badge dl-badge--gray">{lessons.length} Lektionen</span>
              </div>
            </div>
          </div>

          {/* Neue Lektion — Formular */}
          {showLessonForm && (
            <div className="dl-card" style={{ marginBottom: 24, borderColor: "var(--dl-violet-200)" }}>
              <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16, color: "var(--dl-text-primary)" }}>
                Neue Lektion
              </h2>
              <form onSubmit={handleAddLesson} noValidate>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0 16px" }}>
                  <div className="dl-field">
                    <label htmlFor="lesson-title">Lektionstitel</label>
                    <input
                      id="lesson-title"
                      type="text"
                      placeholder="z.B. Was ist HTML?"
                      value={lessonTitle}
                      onChange={(e) => setLessonTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="dl-field">
                    <label htmlFor="lesson-duration">Dauer (Min.)</label>
                    <input
                      id="lesson-duration"
                      type="number"
                      min="1"
                      max="120"
                      placeholder="10"
                      value={lessonDuration}
                      onChange={(e) => setLessonDuration(e.target.value)}
                    />
                  </div>
                </div>
                <div className="dl-field">
                  <label htmlFor="lesson-content">Inhalt (HTML oder Markdown)</label>
                  <textarea
                    id="lesson-content"
                    placeholder="<h2>Einführung</h2><p>In dieser Lektion lernst du…</p>"
                    value={lessonContent}
                    onChange={(e) => setLessonContent(e.target.value)}
                    style={{ minHeight: 140, fontFamily: "'Fira Code', monospace", fontSize: 13 }}
                  />
                </div>
                {lessonError && <p className="dl-alert dl-alert--error">{lessonError}</p>}
                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
                  <button type="button" className="dl-btn dl-btn--ghost" onClick={() => { setShowLessonForm(false); setLessonError(""); }}>
                    Abbrechen
                  </button>
                  <button type="submit" className="dl-btn dl-btn--primary" disabled={savingLesson}>
                    {savingLesson ? "Erstellt…" : "Lektion erstellen"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Lektionsliste */}
          <div className="dl-section">
            <div className="dl-section-header">
              <h2 className="dl-section-title">Lektionen ({lessons.length})</h2>
              {lessons.length > 0 && (
                <button className="dl-btn dl-btn--subtle dl-btn--sm" onClick={() => setShowLessonForm(true)}>
                  <IconPlus /> Lektion hinzufügen
                </button>
              )}
            </div>

            {lessons.length === 0 && !showLessonForm ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📝</div>
                <p className="dl-empty-text">Noch keine Lektionen. Füge die erste hinzu.</p>
                <button className="dl-btn dl-btn--primary" onClick={() => setShowLessonForm(true)}>
                  <IconPlus /> Erste Lektion erstellen
                </button>
              </div>
            ) : (
              <div className="dl-table-wrap">
                <table className="dl-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}>#</th>
                      <th>Titel</th>
                      <th>Dauer</th>
                      <th>Inhalt</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lessons.map((lesson: Lesson, i: number) => (
                      <tr key={lesson.id}>
                        <td style={{ color: "var(--dl-text-faint)", fontSize: 13 }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{lesson.title}</td>
                        <td style={{ color: "var(--dl-text-muted)" }}>
                          {lesson.duration > 0
                            ? `${lesson.duration} Min.`
                            : <span style={{ color: "var(--dl-text-faint)" }}>–</span>
                          }
                        </td>
                        <td>
                          {lesson.content
                            ? <span className="dl-badge dl-badge--teal">Vorhanden</span>
                            : <span className="dl-badge dl-badge--gray">Leer</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}