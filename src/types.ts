import type { User as FirebaseUser } from "firebase/auth";
import { Timestamp } from "firebase/firestore";

// ─── Auth ────────────────────────────────────────────────────────────────────

export type Role = "student" | "teacher";

export interface AuthContextType {
  user: FirebaseUser | null;
  role: Role | null;
  loading: boolean;
}

// ─── Firestore-Dokumente ─────────────────────────────────────────────────────

export interface Course {
  id: string;
  title: string;
  description: string;
  category?: string;
  createdBy: string;
}

export interface Module {
  id: string;
  title: string;
  order: number;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  teacherContent?: string;
  order?: number;
}

export interface Progress {
  completed: boolean;
  completedAt: Timestamp;
}