import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useThemeToggle } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import DevLearnLogo from "./DevLearnLogo";

const IconDashboard = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconBook = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconAward = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const IconUsers = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconLogout = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
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

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  /** "none" für Detailseiten, die ihr eigenes contextItem hervorheben */
  activePage?: "dashboard" | "kurse" | "none";
  /** Seitenspezifischer Eintrag direkt in der Hauptnav (z.B. aktueller Kurs/Modul/Lektion) */
  contextItem?: ReactNode;
  /** Seitenspezifischer Abschnitt unterhalb der Hauptnav (z.B. Modul- oder Lektionsliste) */
  subNav?: ReactNode;
}

export default function Sidebar({ open, onClose, activePage = "none", contextItem, subNav }: SidebarProps) {
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeToggle();
  const { user, role } = useAuth();
  const isTeacher = role === "teacher";

  const dashboardPath = "/dashboard"; // DashboardRoute verzweigt selbst nach Rolle
  const coursesPath = isTeacher ? "/teacher/kurse" : "/kurse";

  function handleNavigate(path: string): void {
    onClose();
    navigate(path);
  }

  async function handleLogout(): Promise<void> {
    onClose();
    navigate("/");
    await signOut(auth);
  }

  const initials = (user?.displayName ?? (isTeacher ? "L" : "S"))
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <aside className={`dl-sidebar${open ? " dl-sidebar--open" : ""}`} aria-label="Navigation">
      <DevLearnLogo />

      <p className="dl-sidebar-section">{isTeacher ? "Lehrer-Panel" : "Menü"}</p>
      <nav className="dl-sidebar-nav">
        <button
          className={`dl-sidebar-link${activePage === "dashboard" ? " active" : ""}`}
          aria-current={activePage === "dashboard" ? "page" : undefined}
          onClick={() => handleNavigate(dashboardPath)}
        >
          <IconDashboard /> Dashboard
        </button>
        <button
          className={`dl-sidebar-link${activePage === "kurse" ? " active" : ""}`}
          aria-current={activePage === "kurse" ? "page" : undefined}
          onClick={() => handleNavigate(coursesPath)}
        >
          <IconBook /> {isTeacher ? "Kurse verwalten" : "Kurse"}
        </button>

        {isTeacher ? (
          <button className="dl-sidebar-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            <IconUsers /> Schüler
          </button>
        ) : (
          <button className="dl-sidebar-link" disabled style={{ opacity: 0.4, cursor: "not-allowed" }}>
            <IconAward /> Zertifikate
          </button>
        )}

        {contextItem}

        <div style={{ height: 1, background: "var(--dl-border)", margin: "8px 0" }} />
        <button className="dl-sidebar-link" onClick={toggleTheme}>
          {mode === "dark" ? <IconSun /> : <IconMoon />}
          {mode === "dark" ? "Light Mode" : "Dark Mode"}
        </button>
        <button className="dl-sidebar-link" onClick={handleLogout} style={{ color: "var(--dl-coral-400)" }}>
          <IconLogout /> Abmelden
        </button>
      </nav>

      {subNav}

      <div className="dl-sidebar-footer">
        <div className="dl-sidebar-user">
          <div className="dl-avatar">{initials}</div>
          <div>
            <div className="dl-sidebar-user-name">{user?.displayName ?? (isTeacher ? "Lehrer" : "Student")}</div>
            <div className="dl-sidebar-user-role">{isTeacher ? "Lehrer" : "Student"}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}