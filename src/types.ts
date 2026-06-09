import type { User as FirebaseUser } from "firebase/auth";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type Role = "student" | "teacher";

export interface AuthContextType {
  user: FirebaseUser | null;
  role: Role | null;
  loading: boolean;
}

// ─── Firestore-Dokumente ──────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  category?: string;
  createdBy: string;
  moduleCount?: number;
  lessonCount?: number;
  modules?: Module[];
}

export interface Module {
  id: string;
  title: string;
  description?: string;
  order: number;
  lessonCount?: number;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  teacherContent?: string;
  order?: number;
  duration: number;
}

// ─── Progress ─────────────────────────────────────────────────────────────────
// Struktur die useProgress zurückgibt:
// progress[kursId].completed     → Anzahl abgeschlossener Lektionen (number)
// progress[kursId].completedModules → Liste abgeschlossener Modul-IDs
// progress[kursId].modules[modulId] → Anzahl abgeschlossener Lektionen im Modul

export interface ModuleProgress {
  [modulId: string]: number;
}

export interface CourseProgress {
  completed: number;
  completedLessons: string[];
  completedModules: string[];
  modules: ModuleProgress;
}

export interface ProgressMap {
  [kursId: string]: CourseProgress;
}