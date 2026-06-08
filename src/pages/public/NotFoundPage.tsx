import { useNavigate } from "react-router-dom";
import { useThemeToggle } from "../../context/ThemeContext";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const { mode } = useThemeToggle();
  const darkMode = mode === "dark";

  return (
    <div className={`dl-auth-page${darkMode ? " dl-dark" : ""}`}>
      <svg className="dl-auth-bg" viewBox="0 0 1440 900" preserveAspectRatio="none" aria-hidden="true">
        <polygon points="0,0 1440,0 720,900 0,900" style={{ fill: "#c8c4f8", opacity: 0.25 }} />
        <polygon points="720,900 1440,900 1440,200"  style={{ fill: "#b8eed8", opacity: 0.25 }} />
        <circle cx="160"  cy="200" r="300" style={{ fill: "none", stroke: "#a8a4e8", strokeWidth: 0.8, opacity: 0.3 }} />
        <circle cx="1300" cy="700" r="240" style={{ fill: "none", stroke: "#5dbca0", strokeWidth: 0.8, opacity: 0.25 }} />
      </svg>

      <div className="dl-auth-content" style={{ textAlign: "center" }}>
        <div className="dl-auth-logo">Dev<span>Learn</span></div>

        <div style={{
          fontSize: 96, fontWeight: 600, letterSpacing: "-4px",
          color: "var(--dl-violet-200)", lineHeight: 1,
          marginBottom: 8, userSelect: "none",
        }}>
          404
        </div>

        <h1 style={{
          fontSize: 26, fontWeight: 600, color: "var(--dl-text-primary)",
          letterSpacing: "-0.5px", marginBottom: 10,
        }}>
          Seite nicht gefunden
        </h1>
        <p style={{
          fontSize: 15, color: "var(--dl-text-muted)", maxWidth: 340,
          lineHeight: 1.7, marginBottom: 32, textAlign: "center",
        }}>
          Die Seite, die du suchst, existiert nicht oder wurde verschoben.
        </p>

        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="dl-btn dl-btn--primary" onClick={() => navigate("/dashboard")}>
            Zum Dashboard
          </button>
          <button className="dl-btn dl-btn--ghost" onClick={() => navigate("/")}>
            Zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}