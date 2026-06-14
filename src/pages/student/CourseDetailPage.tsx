import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import { useProgress } from "../../hooks/useProgress";
import type { Course, Module, CourseProgress } from "../../types";
import DevLearnLogo from "../../components/ui/DevLearnLogo";
import ProgressBar from "../../components/ui/ProgressBar";
import PageBreadcrumb from "../../components/ui/PageBreadcrumb";

interface ModuleWithLessonIds extends Module {
  lessonIds: string[];
}

/* ── Icons ───────────────────────────────────────────────────────────────────── */
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

const bannerColor: Record<string, string> = {
  "HTML/CSS/JS": "--violet", "React/Vite/TS": "--teal", "Figma": "--amber", "Framer": "--coral",
};
const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS": "🌐", "Figma": "🎨", "Framer": "🪄",
};

export default function CourseDetailPage() {
  const { kursSlug } = useParams<{ kursSlug: string }>();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const darkMode = mode === "dark";
  const { progress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<ModuleWithLessonIds[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleNavigate = (path: string) => {
    setSidebarOpen(false);
    navigate(path);
  };

  useEffect(() => {
    if (!kursSlug) return;
    async function fetchData(): Promise<void> {
      const coursesQuery = query(
        collection(db, "courses"),
        where("slug", "==", kursSlug)
      );
      const coursesSnap = await getDocs(coursesQuery);
      if (coursesSnap.empty) {
        setLoading(false);
        return;
      }
      const courseDoc = coursesSnap.docs[0];
      const courseId = courseDoc.id;
      setCourse({ id: courseId, ...(courseDoc.data() as Omit<Course, "id">) });

      const modulesQuery = query(
        collection(db, "courses", courseId, "modules"),
        orderBy("order")
      );
      const modulesSnap = await getDocs(modulesQuery);
      const modulesWithIds: ModuleWithLessonIds[] = await Promise.all(
        modulesSnap.docs.map(async (d) => {
          const lessonsSnap = await getDocs(
            collection(db, "courses", courseId, "modules", d.id, "lessons")
          );
          return {
            id: d.id,
            ...(d.data() as Omit<Module, "id">),
            lessonIds: lessonsSnap.docs.map((l) => l.id),
          };
        })
      );
      setModules(modulesWithIds);
      setLoading(false);
    }
    fetchData();
  }, [kursSlug]);

  // Progress per echter Firestore-ID nachschlagen (nicht per Slug)
  const p: CourseProgress | undefined = progress[course?.id ?? ""];
  const completedLessons: string[] = p?.completedLessons ?? [];
  const totalLessons = modules.reduce((sum, m) => sum + m.lessonIds.length, 0);
  const doneLessons  = completedLessons.length;
  const pct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;
  const cat     = course?.category ?? "HTML/CSS/JS";
  const variant = bannerColor[cat] ?? "--violet";

  if (loading) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main">
          <div className="dl-page">
            <div className="dl-empty">
              <p style={{ color: "var(--dl-text-faint)", fontSize: 14 }}>Kurs wird geladen…</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!course) {
    return (
      <div className={`dl-shell${darkMode ? " dl-dark" : ""}`}>
        <main className="dl-main">
          <div className="dl-page">
            <div className="dl-empty">
              <div className="dl-empty-icon">🔍</div>
              <p className="dl-empty-text">Kurs nicht gefunden.</p>
              <button className="dl-btn dl-btn--ghost" onClick={() => navigate("/kurse")}>
                <IconBack /> Zurück zu den Kursen
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

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
        <p className="dl-sidebar-section">Navigation</p>
        <nav className="dl-sidebar-nav">
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/dashboard")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            Dashboard
          </button>
          <button className="dl-sidebar-link" onClick={() => handleNavigate("/kurse")}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
            </svg>
            Alle Kurse
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
              {modules.map((mod, i) => (
                <button
                  key={mod.id}
                  className="dl-sidebar-link"
                  onClick={() => handleNavigate(`/kurse/${kursSlug}/${mod.id}`)}
                  style={{ fontSize: 13 }}
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
        {/* ── Topbar ── */}
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
          <PageBreadcrumb items={[
            { label: "Kurse", onClick: () => handleNavigate("/kurse") },
            { label: course.title },
          ]} />

          {/* Kurs-Hero */}
          <div className="dl-card" style={{ marginBottom: 32, padding: 0, overflow: "hidden" }}>
            <div className={`dl-course-banner dl-course-banner${variant}`}
              style={{ height: 100, gap: 16, padding: "0 28px" }}>
              <span style={{ fontSize: 40 }}>{bannerEmoji[cat] ?? "📖"}</span>
              <div>
                <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.5px", textTransform: "uppercase", color: "var(--dl-text-faint)", marginBottom: 4 }}>
                  {cat}
                </p>
                <h1 style={{ fontSize: 22, fontWeight: 600, color: "var(--dl-text-primary)", letterSpacing: "-0.3px", margin: 0 }}>
                  {course.title}
                </h1>
              </div>
            </div>
            <div style={{ padding: "20px 28px" }}>
              {course.description && (
                <p style={{ fontSize: 14, color: "var(--dl-text-muted)", lineHeight: 1.7, marginBottom: 16 }}>
                  {course.description}
                </p>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 160 }}>
                  <ProgressBar pct={pct} showLabel isDone={pct === 100} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <span className="dl-badge dl-badge--gray">{modules.length} Module</span>
                  <span className="dl-badge dl-badge--gray">{totalLessons} Lektionen</span>
                  {pct === 100 && <span className="dl-badge dl-badge--teal">Abgeschlossen ✔</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Modul-Liste */}
          <div className="dl-section">
            <div className="dl-section-header">
              <h2 className="dl-section-title">Module</h2>
            </div>
            {modules.length === 0 ? (
              <div className="dl-empty">
                <div className="dl-empty-icon">📦</div>
                <p className="dl-empty-text">Noch keine Module vorhanden.</p>
              </div>
            ) : (
              <div className="dl-module-list">
                {modules.map((mod, i) => {
                  const modLessons = mod.lessonIds.length;
                  const modDone    = mod.lessonIds.filter((id) => completedLessons.includes(id)).length;
                  const modPct     = modLessons > 0 ? Math.round((modDone / modLessons) * 100) : 0;
                  const isDone     = modLessons > 0 && modDone === modLessons;
                  return (
                    <div
                      key={mod.id}
                      className="dl-module-item"
                      onClick={() => handleNavigate(`/kurse/${kursSlug}/${mod.id}`)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => e.key === "Enter" && handleNavigate(`/kurse/${kursSlug}/${mod.id}`)}
                      aria-label={`Modul ${i + 1}: ${mod.title}`}
                    >
                      <div className={`dl-module-num${isDone ? " dl-module-num--done" : ""}`}>
                        {isDone ? <IconCheck /> : i + 1}
                      </div>
                      <div className="dl-module-info">
                        <p className="dl-module-name">{mod.title}</p>
                        <p className="dl-module-sub">{modLessons} Lektionen · {modPct}% abgeschlossen</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        {modLessons > 0 && <ProgressBar pct={modPct} width={80} isDone={isDone} />}
                        <span style={{ color: "var(--dl-text-faint)" }}><IconChevron /></span>
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