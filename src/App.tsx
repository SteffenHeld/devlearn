import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth } from "./context/AuthContext";
import { Role } from "./types";

// ─── Seiten ───────────────────────────────────────────────────────────────────
import LandingPage            from "./pages/LandingPage";
import LoginPage              from "./pages/LoginPage";
import RegisterPage           from "./pages/RegisterPage";
import ContactPage            from "./pages/ContactPage";
import PublicCoursesPage      from "./pages/PublicCoursesPage";
import NotFoundPage           from "./pages/NotFoundPage";

import StudentDashboard       from "./pages/StudentDashboard";
import CoursesPage            from "./pages/CoursesPage";
import CourseDetailPage       from "./pages/CourseDetailPage";
import ModuleDetailPage       from "./pages/ModuleDetailPage";
import LessonPage             from "./pages/LessonPage";

import TeacherDashboard       from "./pages/TeacherDashboard";
import TeacherCoursesPage     from "./pages/TeacherCoursesPage";
import TeacherCourseDetailPage from "./pages/TeacherCourseDetailPage";
import TeacherModuleDetailPage from "./pages/TeacherModuleDetailPage";

// ─── Protected Route ──────────────────────────────────────────────────────────

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Role[];
}

function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, role, loading } = useAuth();

  // Noch am Laden — nichts rendern damit kein falsches Redirect passiert
  if (loading) return null;

  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role as Role)) {
    // Falsche Rolle → zur eigenen Dashboard-Startseite
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
}

// ─── Dashboard-Weiche ─────────────────────────────────────────────────────────
// Eine einzige /dashboard-Route die je nach Rolle die richtige Seite zeigt

function DashboardRoute() {
  const { role, loading } = useAuth();
  if (loading) return null;
  if (role === "teacher") return <TeacherDashboard />;
  return <StudentDashboard />;
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ── Öffentlich ──────────────────────────────────────── */}
        <Route path="/"          element={<LandingPage />} />
        <Route path="/login"     element={<LoginPage />} />
        <Route path="/register"  element={<RegisterPage />} />
        <Route path="/contact"   element={<ContactPage />} />
        <Route path="/kurse-entdecken" element={<PublicCoursesPage />} />

        {/* ── Dashboard (role-basiert, eine Route für alle) ────── */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        } />

        {/* ── Student ─────────────────────────────────────────── */}
        <Route path="/kurse" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CoursesPage />
          </ProtectedRoute>
        } />
        <Route path="/kurse/:kursId" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CourseDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/kurse/:kursId/:modulId" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ModuleDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/kurse/:kursId/:modulId/:lektionId" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <LessonPage />
          </ProtectedRoute>
        } />

        {/* ── Teacher ─────────────────────────────────────────── */}
        <Route path="/teacher/kurse" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherCoursesPage />
          </ProtectedRoute>
        } />
        <Route path="/teacher/kurse/:kursId" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherCourseDetailPage />
          </ProtectedRoute>
        } />
        <Route path="/teacher/kurse/:kursId/:modulId" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherModuleDetailPage />
          </ProtectedRoute>
        } />

        {/* ── Fallback ────────────────────────────────────────── */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  );
}
