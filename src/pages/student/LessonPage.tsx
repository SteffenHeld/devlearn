import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../hooks/useProgress";
import { useThemeToggle } from "../../context/ThemeContext";
import type { Lesson } from "../../types";

/* ── Icons ───────────────────────────────────────────────────────────────────── */
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);
const IconNext = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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

export default function LessonPage() {
  const { kursId, modulId, lektionId } = useParams<{
    kursId: string;
    modulId: string;
    lektionId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";

  // markLessonComplete aus useProgress — schreibt korrekt nach users/{uid}/progress/{courseId}
  const { progress, markLessonComplete } = useProgress();

  const [lesson, setLesson]   = useState<Lesson | null>(null);
  const [saving, setSaving]   = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!kursId || !modulId || !lektionId || !user) return;

    async function fetchLesson(): Promise<void> {
      const lessonSnap = await getDoc(
        doc(db, "courses", kursId!, "modules", modulId!, "lessons", lektionId!)
      );
      if (lessonSnap.exists()) {
        setLesson({ id: lessonSnap.id, ...(lessonSnap.data() as Omit<Lesson, "id">) });
      }
      setLoading(false);
    }

    fetchLesson();
  }, [kursId, modulId, lektionId, user]);

  // Abschluss-Status aus useProgress lesen — wird automatisch aktualisiert
  // wenn markLessonComplete aufgerufen wird (Echtzeit-Listener in useProgress)
  const completed =
    progress[kursId ?? ""]?.completedLessons?.includes(lektionId ?? "") ?? false;

  async function handleComplete(): Promise<void> {
    if (!kursId || !modulId || !lektionId || saving) return;
    setSaving(true);
    // markLessonComplete schreibt korrekt nach users/{uid}/progress/{courseId}
    // und zählt completed, completedLessons und modules[moduleId] hoch
    await markLessonComplete(kursId, modulId, lektionId);
    setSaving(false);
  }

  if (loading) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main">
          <div className="dl-page">
            <div className="dl-empty">
              <p style={{ color: "var(--dl-text-faint)", fontSize: 14 }}>Lektion wird geladen…</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className="dl-sidebar" aria-label="Navigation">
        <div className="dl-sidebar-logo">Dev<span>Learn</span></div>
        <p className="dl-sidebar-section">Navigation</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link" onClick={() => navigate("/dashboard")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          <button className="dl-sidebar-link" onClick={() => navigate("/kurse")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Alle Kurse
          </button>
          <button className="dl-sidebar-link" onClick={() => navigate(`/kurse/${kursId}`)}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Zum Kurs
          </button>
          <button className="dl-sidebar-link" onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--dl-violet-50)", color: "var(--dl-violet-600)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>M</span>
            Zum Modul
          </button>
          <div className="dl-sidebar-link active" style={{ cursor: "default" }} aria-current="page">
            <span style={{
              width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
              background: completed ? "var(--dl-teal-400)" : "var(--dl-violet-400)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
            }}>
              {completed && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {lesson?.title ?? "Lektion"}
            </span>
          </div>
        </nav>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}>
            <IconBack /> Zurück zum Modul
          </button>
          <div className="dl-topbar-actions">
            <button className="dl-theme-toggle" onClick={toggleTheme} aria-label={darkMode ? "Light Mode" : "Dark Mode"}>
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
          </div>
        </div>

        <div className="dl-page">
          {/* Breadcrumb */}
          <nav className="dl-breadcrumb" aria-label="Breadcrumb">
            <span role="button" onClick={() => navigate("/kurse")}>Kurse</span>
            <span className="dl-breadcrumb-sep" aria-hidden="true">/</span>
            <span role="button" onClick={() => navigate(`/kurse/${kursId}`)}>Kurs</span>
            <span className="dl-breadcrumb-sep" aria-hidden="true">/</span>
            <span role="button" onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}>Modul</span>
            <span className="dl-breadcrumb-sep" aria-hidden="true">/</span>
            <span className="dl-breadcrumb-current">{lesson?.title}</span>
          </nav>

          {/* Zweispaltiges Layout */}
          <div className="dl-lesson-layout">

            {/* ── Linke Spalte: Inhalt ─────────────────────────────────────── */}
            <div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 8, flexWrap: "wrap" }}>
                <h1 className="dl-page-title" style={{ marginBottom: 0 }}>{lesson?.title}</h1>
                {completed && (
                  <span className="dl-badge dl-badge--teal" style={{ marginTop: 6, padding: "4px 12px", fontSize: 12 }}>
                    <IconCheck /> Abgeschlossen
                  </span>
                )}
              </div>

              <div className="dl-divider" style={{ marginTop: 16 }} />

              {/* Lektion-Inhalt */}
              <div className="dl-lesson-content">
                {lesson?.content ? (
                  lesson.content.trim().startsWith("<")
                    ? <div dangerouslySetInnerHTML={{ __html: lesson.content }} />
                    : <p>{lesson.content}</p>
                ) : (
                  <div className="dl-empty" style={{ textAlign: "left", padding: "40px 0" }}>
                    <div className="dl-empty-icon">✏️</div>
                    <p className="dl-empty-text">Kein Inhalt für diese Lektion vorhanden.</p>
                  </div>
                )}
              </div>

              <div className="dl-divider" />

              {/* Aktions-Buttons */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {!completed && (
                  <button
                    className="dl-btn dl-btn--teal"
                    onClick={handleComplete}
                    disabled={saving}
                    style={{ padding: "12px 24px" }}
                  >
                    <IconCheckCircle />
                    {saving ? "Wird gespeichert…" : "Lektion abschließen"}
                  </button>
                )}
                {completed && (
                  <button
                    className="dl-btn dl-btn--ghost"
                    onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}
                    style={{ padding: "12px 24px" }}
                  >
                    <IconNext /> Weiter zum Modul
                  </button>
                )}
              </div>
            </div>

            {/* ── Rechte Spalte: Status-Card ───────────────────────────────── */}
            <aside>
              <div className="dl-card">
                <p style={{
                  fontSize: 12, fontWeight: 600, color: "var(--dl-text-faint)",
                  textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 16,
                }}>
                  Status
                </p>

                <div style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "14px 16px", borderRadius: "var(--dl-radius-md)",
                  background: completed ? "var(--dl-teal-50)" : "var(--dl-bg-muted)",
                  border: `1px solid ${completed ? "var(--dl-teal-100)" : "var(--dl-border)"}`,
                  marginBottom: 16, transition: "all 0.3s",
                }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%",
                    background: completed ? "var(--dl-teal-400)" : "var(--dl-border)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, transition: "background 0.3s",
                  }}>
                    {completed && <IconCheck />}
                  </div>
                  <div>
                    <p style={{
                      fontSize: 13, fontWeight: 600,
                      color: completed ? "var(--dl-teal-600)" : "var(--dl-text-primary)",
                      marginBottom: 2,
                    }}>
                      {completed ? "Abgeschlossen" : "Offen"}
                    </p>
                    <p style={{ fontSize: 12, color: "var(--dl-text-faint)" }}>
                      {completed ? "Gut gemacht!" : "Lektion noch nicht beendet"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <button
                    className="dl-btn dl-btn--ghost"
                    style={{ justifyContent: "flex-start", fontSize: 13 }}
                    onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}
                  >
                    <IconBack /> Zurück zum Modul
                  </button>
                  <button
                    className="dl-btn dl-btn--ghost"
                    style={{ justifyContent: "flex-start", fontSize: 13 }}
                    onClick={() => navigate(`/kurse/${kursId}`)}
                  >
                    <IconBack /> Zurück zum Kurs
                  </button>
                </div>

                {!completed && (
                  <button
                    className="dl-btn dl-btn--teal"
                    style={{ width: "100%", justifyContent: "center", marginTop: 16 }}
                    onClick={handleComplete}
                    disabled={saving}
                  >
                    <IconCheckCircle />
                    {saving ? "Speichert…" : "Abschließen"}
                  </button>
                )}
              </div>
            </aside>

          </div>
        </div>
      </main>
    </div>
  );
}