import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useProgress } from "../../hooks/useProgress";
import { useThemeToggle } from "../../context/ThemeContext";
import type { Lesson } from "../../types";
import Sidebar from "../../components/ui/Sidebar";
import PageBreadcrumb from "../../components/ui/PageBreadcrumb";

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

export default function LessonPage() {
  const { kursSlug, modulId, lektionId } = useParams<{
    kursSlug: string;
    modulId: string;
    lektionId: string;
  }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";
  const { progress, markLessonComplete } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [lesson, setLesson]   = useState<Lesson | null>(null);
  const [saving, setSaving]   = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (!kursSlug || !modulId || !lektionId || !user) return;
    async function fetchLesson(): Promise<void> {
      const coursesQuery = query(collection(db, "courses"), where("slug", "==", kursSlug));
      const coursesSnap = await getDocs(coursesQuery);
      if (coursesSnap.empty) {
        setLoading(false);
        return;
      }
      const realCourseId = coursesSnap.docs[0].id;
      setCourseId(realCourseId);

      const lessonSnap = await getDoc(
        doc(db, "courses", realCourseId, "modules", modulId!, "lessons", lektionId!)
      );
      if (lessonSnap.exists()) {
        setLesson({ id: lessonSnap.id, ...(lessonSnap.data() as Omit<Lesson, "id">) });
      }
      setLoading(false);
    }
    fetchLesson();
  }, [kursSlug, modulId, lektionId, user]);

  const completed =
    progress[courseId ?? ""]?.completedLessons?.includes(lektionId ?? "") ?? false;

  async function handleComplete(): Promise<void> {
    if (!courseId || !modulId || !lektionId || saving) return;
    setSaving(true);
    await markLessonComplete(courseId, modulId, lektionId);
    setSaving(false);
  }

  const contextItem = (
    <>
      <button className="dl-sidebar-link" onClick={() => handleNavigate(`/kurse/${kursSlug}`)}>
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        Zum Kurs
      </button>
      <button className="dl-sidebar-link" onClick={() => handleNavigate(`/kurse/${kursSlug}/${modulId}`)}>
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
    </>
  );

  if (loading) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        {sidebarOpen && <div className="dl-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />}
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} activePage="kurse" />
        <main className="dl-main">
          <div className="dl-topbar">
            <button className="dl-topbar-menu-btn" onClick={() => setSidebarOpen((p) => !p)} aria-label="Menü öffnen">
              {sidebarOpen ? <IconClose /> : <IconMenu />}
            </button>
            <span className="dl-topbar-title">Lektion</span>
          </div>
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

      {sidebarOpen && (
        <div className="dl-sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-hidden="true" />
      )}

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage="none"
        contextItem={contextItem}
      />

      <main className="dl-main">
        <div className="dl-topbar">
          <button className="dl-topbar-menu-btn" onClick={() => setSidebarOpen((prev) => !prev)} aria-label="Menü öffnen">
            {sidebarOpen ? <IconClose /> : <IconMenu />}
          </button>
          <span className="dl-topbar-title">{lesson?.title ?? "Lektion"}</span>
        </div>

        <div className="dl-page">
          <PageBreadcrumb items={[
            { label: "Kurse",  onClick: () => handleNavigate("/kurse") },
            { label: "Kurs",   onClick: () => handleNavigate(`/kurse/${kursSlug}`) },
            { label: "Modul",  onClick: () => handleNavigate(`/kurse/${kursSlug}/${modulId}`) },
            { label: lesson?.title ?? "Lektion" },
          ]} />

          <div className="dl-lesson-layout">
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
                    onClick={() => handleNavigate(`/kurse/${kursSlug}/${modulId}`)}
                    style={{ padding: "12px 24px" }}
                  >
                    <IconNext /> Weiter zum Modul
                  </button>
                )}
              </div>
            </div>

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
                    onClick={() => handleNavigate(`/kurse/${kursSlug}/${modulId}`)}
                  >
                    <IconBack /> Zurück zum Modul
                  </button>
                  <button
                    className="dl-btn dl-btn--ghost"
                    style={{ justifyContent: "flex-start", fontSize: 13 }}
                    onClick={() => handleNavigate(`/kurse/${kursSlug}`)}
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