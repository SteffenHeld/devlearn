import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import { useProgress } from "../../hooks/useProgress";
import type { Module, Lesson } from "../../types";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ThemeToggleButton from "../../components/ui/ThemeToggleButton";

/* ── Icons ───────────────────────────────────────────────────────────────────── */
const IconBack = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconPlay = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">
    <polygon points="5 3 19 12 5 21 5 3"/>
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

export default function ModuleDetailPage() {
  const { kursId, modulId } = useParams<{ kursId: string; modulId: string }>();
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  // useProgress liefert completedLessons aus users/{uid}/progress/{courseId}
  // — kein eigener Firestore-Read pro Lektion nötig
  const { progress } = useProgress();

  const [module, setModule]   = useState<Module | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!kursId || !modulId) return;

    async function fetchData(): Promise<void> {
      // Modul laden
      const moduleSnap = await getDoc(
        doc(db, "courses", kursId!, "modules", modulId!)
      );
      if (moduleSnap.exists()) {
        setModule({ id: moduleSnap.id, ...(moduleSnap.data() as Omit<Module, "id">) });
      }

      // Lektionen laden
      const lessonsQuery = query(
        collection(db, "courses", kursId!, "modules", modulId!, "lessons"),
        orderBy("order")
      );
      const lessonsSnap = await getDocs(lessonsQuery);
      setLessons(
        lessonsSnap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Lesson, "id">),
        }))
      );

      setLoading(false);
    }

    fetchData();
  }, [kursId, modulId]);

  // Abgeschlossene Lektionen aus useProgress lesen — reaktiv, kein eigener Read
  const completedLessons: string[] =
    progress[kursId ?? ""]?.completedLessons ?? [];
  const completedIds = new Set(completedLessons);

  const done  = lessons.filter((l) => completedIds.has(l.id)).length;
  const total = lessons.length;
  const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
  const nextLesson = lessons.find((l) => !completedIds.has(l.id));

  if (loading) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main">
          <div className="dl-page">
            <div className="dl-empty">
              <p style={{ color: "var(--dl-text-faint)", fontSize: 14 }}>Lektionen werden geladen…</p>
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
        <DevLearnLogo />
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
          <div className="dl-sidebar-link active" style={{ cursor: "default" }} aria-current="page">
            <span style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--dl-violet-50)", color: "var(--dl-violet-600)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              fontSize: 11, fontWeight: 600, flexShrink: 0,
            }}>M</span>
            <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {module?.title ?? "Modul"}
            </span>
          </div>
        </nav>

        {/* Lektionen in Sidebar */}
        {lessons.length > 0 && (
          <>
            <p className="dl-sidebar-section" style={{ marginTop: 16 }}>Lektionen</p>
            <nav className="dl-sidebar-nav">
              {lessons.map((lesson, i) => {
                const isDone = completedIds.has(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    className="dl-sidebar-link"
                    onClick={() => navigate(`/kurse/${kursId}/${modulId}/${lesson.id}`)}
                    style={{ fontSize: 13, gap: 8 }}
                  >
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                      background: isDone ? "var(--dl-teal-400)" : "var(--dl-border)",
                      display: "inline-flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {isDone && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      )}
                    </span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {i + 1}. {lesson.title}
                    </span>
                  </button>
                );
              })}
            </nav>
          </>
        )}
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <main className="dl-main">
        <div className="dl-topbar">
          <button className="dl-btn dl-btn--ghost dl-btn--sm" onClick={() => navigate(`/kurse/${kursId}`)}>
            <IconBack /> Zurück zum Kurs
          </button>
          <div className="dl-topbar-actions">
            {nextLesson && (
              <button
                className="dl-btn dl-btn--primary dl-btn--sm"
                onClick={() => navigate(`/kurse/${kursId}/${modulId}/${nextLesson.id}`)}
              >
                <IconPlay />
                {done === 0 ? "Starten" : "Weiterlernen"}
              </button>
            )}
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
            <span className="dl-breadcrumb-current">{module?.title}</span>
          </nav>

          {/* Header */}
          <div className="dl-page-header">
            <h1 className="dl-page-title">{module?.title}</h1>
            {/* description ist in Module als optional definiert — kein any-Cast nötig */}
            {module?.description && (
              <p className="dl-page-sub">{module.description}</p>
            )}
          </div>

          {/* Fortschritts-Card */}
          <div className="dl-card" style={{ marginBottom: 32, display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 180 }}>
              <p style={{ fontSize: 12, color: "var(--dl-text-faint)", marginBottom: 8 }}>Modulfortschritt</p>
              <div className="dl-progress" style={{ marginBottom: 6 }}>
                <div
                  className={`dl-progress-fill dl-progress-fill${pct === 100 ? "--teal" : "--violet"}`}
                  style={{ width: `${pct}%` }}
                  role="progressbar"
                  aria-valuenow={pct}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="dl-progress-label">{done} von {total} Lektionen abgeschlossen</p>
            </div>
            <div style={{ display: "flex", gap: 12 }}>
              <div className="dl-stat" style={{ padding: "12px 16px", minWidth: 72 }}>
                <p className="dl-stat-label">Lektionen</p>
                <p className="dl-stat-value" style={{ fontSize: 22 }}>{total}</p>
              </div>
              <div className="dl-stat" style={{ padding: "12px 16px", minWidth: 72 }}>
                <p className="dl-stat-label">Fertig</p>
                <p className="dl-stat-value dl-stat-value--teal" style={{ fontSize: 22 }}>{done}</p>
              </div>
            </div>
          </div>

          {/* Lektionsliste */}
          <div className="dl-section">
            <div className="dl-section-header">
              <h2 className="dl-section-title">Lektionen</h2>
            </div>

            {lessons.length === 0 ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📋</div>
                <p className="dl-empty-text">Noch keine Lektionen vorhanden.</p>
              </div>
            ) : (
              <div className="dl-module-list">
                {lessons.map((lesson, i) => {
                  const isDone = completedIds.has(lesson.id);
                  return (
                    <div
                      key={lesson.id}
                      className="dl-module-item"
                      onClick={() => navigate(`/kurse/${kursId}/${modulId}/${lesson.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/kurse/${kursId}/${modulId}/${lesson.id}`)}
                      aria-label={`Lektion ${i + 1}: ${lesson.title}`}
                    >
                      <div className={`dl-module-num${isDone ? " dl-module-num--done" : ""}`}>
                        {isDone ? (
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"/>
                          </svg>
                        ) : i + 1}
                      </div>
                      <div className="dl-module-info">
                        <p className="dl-module-name">{lesson.title}</p>
                        <p className="dl-module-sub">
                          {lesson.duration > 0 ? `${lesson.duration} Min.` : ""}
                          {isDone ? " · Abgeschlossen ✔" : ""}
                        </p>
                      </div>
                      <span style={{ color: "var(--dl-text-faint)" }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <polyline points="9 18 15 12 9 6"/>
                        </svg>
                      </span>
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