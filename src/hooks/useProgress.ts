// useProgress.ts
// Liest und schreibt den Lernfortschritt eines Studenten in Firestore.
//
// Firestore-Struktur:
//   users/{uid}/progress/{courseId}  →  { completed: number, completedLessons: string[], modules: { [moduleId]: number } }
//
// Verwendung:
//   const { progress, markLessonComplete } = useProgress();
//   progress["courseId"].completed       → Anzahl abgeschlossener Lektionen
//   progress["courseId"].completedLessons → Array mit Lektions-IDs
//   markLessonComplete(courseId, moduleId, lessonId) → schreibt nach Firestore

import { useState, useEffect } from "react";
import {
  doc,
  onSnapshot,
  collection,
  setDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";

export interface CourseProgress {
  completed: number;
  completedLessons: string[];
  completedModules: string[];
  modules: Record<string, number>;
}

export interface ProgressMap {
  [courseId: string]: CourseProgress;
}

interface UseProgressReturn {
  progress: ProgressMap;
  loading: boolean;
  markLessonComplete: (
    courseId: string,
    moduleId: string,
    lessonId: string
  ) => Promise<void>;
}

export function useProgress(): UseProgressReturn {
  const { user } = useAuth();
  const [progress, setProgress] = useState<ProgressMap>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!user) {
      setProgress({});
      setLoading(false);
      return;
    }

    // Echtzeit-Listener auf die gesamte progress-Subcollection des Users
    const progressRef = collection(db, "users", user.uid, "progress");
    const unsubscribe = onSnapshot(progressRef, (snapshot) => {
      const map: ProgressMap = {};
      snapshot.docs.forEach((d) => {
        map[d.id] = d.data() as CourseProgress;
      });
      setProgress(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const markLessonComplete = async (
    courseId: string,
    moduleId: string,
    lessonId: string
  ): Promise<void> => {
    if (!user) return;

    const progressRef = doc(db, "users", user.uid, "progress", courseId);
    const snap = await getDoc(progressRef);

    const current: CourseProgress = snap.exists()
      ? (snap.data() as CourseProgress)
      : { completed: 0, completedLessons: [], completedModules: [], modules: {} };

    // Lektion nur einmal zählen
    if (current.completedLessons.includes(lessonId)) return;

    const updatedLessons = [...current.completedLessons, lessonId];
    const updatedModuleCount = (current.modules[moduleId] ?? 0) + 1;

    await setDoc(progressRef, {
      completed: updatedLessons.length,
      completedLessons: updatedLessons,
      completedModules: current.completedModules ?? [],
      modules: {
        ...current.modules,
        [moduleId]: updatedModuleCount,
      },
    });
  };

  return { progress, loading, markLessonComplete };
}
