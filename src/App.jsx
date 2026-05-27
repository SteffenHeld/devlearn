import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import StudentDashboard from "./pages/StudentDashboard";
import CoursesPage from "./pages/CoursesPage";
import LessonPage from "./pages/LessonPage";
import TeacherDashboard from "./pages/TeacherDashboard";
import NotFoundPage from "./pages/NotFoundPage";
import CourseDetailPage from "./pages/CourseDetailPage";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, role } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(role)) return <Navigate to="/" />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Öffentlich */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Schüler */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentDashboard />
          </ProtectedRoute>
        } />
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
        <Route path="/kurse/:kursId/:modulId/:lektionId" element={
          <ProtectedRoute allowedRoles={["student"]}>
            <LessonPage />
          </ProtectedRoute>
        } />

        {/* Teacher */}
        <Route path="/teacher/dashboard" element={
          <ProtectedRoute allowedRoles={["teacher"]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}