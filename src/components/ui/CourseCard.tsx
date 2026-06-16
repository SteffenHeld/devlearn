import { useNavigate } from "react-router-dom";
import type { Course, CourseProgress } from "../../types";

interface CourseCardProps {
  course: Course;
  progress?: CourseProgress;
}

const bannerColor: Record<string, string> = {
  "HTML/CSS/JS":   "--violet",
  "React/Vite/TS": "--teal",
  "Figma":         "--amber",
  "Framer":        "--coral",
};
const bannerEmoji: Record<string, string> = {
  "HTML/CSS/JS":   "🌐",
  "React/Vite/TS": "⚛️", 
  "Figma":         "🎨",
  "Framer":        "🪄",
};

const IconArrow = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconCheck = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

/**
 * CourseCard
 * Zeigt eine Kurskarte mit Banner, Fortschrittsbalken und Navigation.
 * Klick navigiert zu /kurse/:kursSlug
 *
 * Verwendung:
 *   <CourseCard course={course} progress={progress[course.slug ?? course.id]} />
 */
export default function CourseCard({ course, progress }: CourseCardProps) {
  const navigate = useNavigate();

  const total      = course.lessonCount ?? 0;
  const done       = progress?.completed ?? 0;
  const pct        = total > 0 ? Math.round((done / total) * 100) : 0;
  const cat        = course.category ?? "HTML/CSS/JS";
  const variant    = bannerColor[cat] ?? "--violet";
  const started    = done > 0;
  const isComplete = pct === 100;

  return (
    <div
      className="dl-course-card"
      onClick={() => navigate(`/kurse/${course.slug ?? course.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/kurse/${course.slug ?? course.id}`)}
      aria-label={`Kurs: ${course.title}`}
    >
      {/* Banner */}
      <div className={`dl-course-banner dl-course-banner${variant}`}>
        <span className="dl-course-icon">{bannerEmoji[cat] ?? "📖"}</span>
        {isComplete && (
          <span className="dl-badge dl-badge--teal" style={{ marginLeft: "auto" }}>
            <IconCheck /> Fertig
          </span>
        )}
        {!isComplete && started && (
          <span className="dl-badge dl-badge--violet" style={{ marginLeft: "auto" }}>
            In Arbeit
          </span>
        )}
      </div>

      {/* Body */}
      <div className="dl-course-body">
        <p className="dl-course-title">{course.title}</p>
        <p className="dl-course-meta">
          {course.description
            ? course.description.slice(0, 60) + (course.description.length > 60 ? "…" : "")
            : `${course.moduleCount ?? 0} Module · ${total} Lektionen`}
        </p>

        {/* Fortschrittsbalken */}
        <div className="dl-progress">
          <div
            className={`dl-progress-fill dl-progress-fill${isComplete ? "--teal" : "--violet"}`}
            style={{ width: `${pct}%` }}
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <p className="dl-progress-label">{pct}% abgeschlossen</p>
          <span style={{ fontSize: 13, color: "var(--dl-violet-400)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
            {started ? "Weiter" : "Starten"} <IconArrow />
          </span>
        </div>
      </div>
    </div>
  );
}