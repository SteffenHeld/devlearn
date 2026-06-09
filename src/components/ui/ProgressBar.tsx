// Wiederverwendbare Fortschrittsanzeige für Kurse und Module.
//
// Props:
//   pct        — Prozentwert 0–100
//   showLabel  — zeigt "{pct}% abgeschlossen" unter der Bar (default: false)
//   width      — feste Breite in px, z.B. 80 für Modul-Items (default: undefined = flex)
//   isDone     — teal wenn abgeschlossen, violet wenn nicht (default: false)

interface ProgressBarProps {
  pct: number;
  showLabel?: boolean;
  width?: number;
  isDone?: boolean;
}

export default function ProgressBar({
  pct,
  showLabel = false,
  width,
  isDone = false,
}: ProgressBarProps) {
  return (
    <div style={{ width: width ?? undefined }}>
      <div
        className="dl-progress"
        style={{ marginBottom: showLabel ? 6 : 0 }}
      >
        <div
          className={`dl-progress-fill dl-progress-fill${isDone ? "--teal" : "--violet"}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showLabel && (
        <p className="dl-progress-label">{pct}% abgeschlossen</p>
      )}
    </div>
  );
}
