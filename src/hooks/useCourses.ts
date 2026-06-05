import { useState, useEffect } from "react";
import {
  collection, onSnapshot, orderBy, query, FirestoreError,
  addDoc, updateDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Course } from "../types";
import { useAuth } from "../context/AuthContext";

interface NewCourse {
  title: string;
  category?: string;
  description?: string;
}

interface NewModule {
  title: string;
  description?: string;
}

interface NewLesson {
  title: string;
  content?: string;
  duration?: number | null;
}

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  addCourse:  (data: NewCourse)                                    => Promise<{ id: string }>;
  addModule:  (courseId: string, data: NewModule)                  => Promise<{ id: string }>;
  addLesson:  (courseId: string, moduleId: string, data: NewLesson) => Promise<{ id: string }>;
  updateCourse: (courseId: string, data: Partial<NewCourse>)       => Promise<void>;
}

export default function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);
  const { user } = useAuth();

  // ── Echtzeit-Listener (unverändert) ────────────────────────
  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("title"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Course[] = snapshot.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<Course, "id">),
        }));
        setCourses(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  // Kurs erstellen
  const addCourse = async (data: NewCourse): Promise<{ id: string }> => {
    const ref = await addDoc(collection(db, "courses"), {
      title:       data.title,
      category:    data.category ?? "HTML/CSS/JS",
      description: data.description ?? "",
      createdBy:   user?.uid ?? "",
      moduleCount: 0,
      lessonCount: 0,
      createdAt:   serverTimestamp(),
    });
    return { id: ref.id };
  };

  // Modul erstellen
  const addModule = async (
    courseId: string,
    data: NewModule
  ): Promise<{ id: string }> => {
    // Modul in Subcollection anlegen
    const ref = await addDoc(
      collection(db, "courses", courseId, "modules"),
      {
        title:       data.title,
        description: data.description ?? "",
        lessonCount: 0,
        order:       Date.now(), // einfach sortiert
        createdAt:   serverTimestamp(),
      }
    );
    // moduleCount am Kurs hochzählen
    const courseCount = (courses.find((c) => c.id === courseId)?.moduleCount ?? 0) + 1;
    await updateDoc(doc(db, "courses", courseId), { moduleCount: courseCount });
    return { id: ref.id };
  };

  // Lektion erstellen
  const addLesson = async (
    courseId: string,
    moduleId: string,
    data: NewLesson
  ): Promise<{ id: string }> => {
    const ref = await addDoc(
      collection(db, "courses", courseId, "modules", moduleId, "lessons"),
      {
        title:     data.title,
        content:   data.content ?? "",
        duration:  data.duration ?? null,
        order:     Date.now(),
        createdAt: serverTimestamp(),
      }
    );
    // lessonCount am Kurs hochzählen
    const courseCount = (courses.find((c) => c.id === courseId)?.lessonCount ?? 0) + 1;
    await updateDoc(doc(db, "courses", courseId), { lessonCount: courseCount });
    return { id: ref.id };
  };

  // Kurs aktualisieren
  const updateCourse = async (
    courseId: string,
    data: Partial<NewCourse>
  ): Promise<void> => {
    await updateDoc(doc(db, "courses", courseId), { ...data });
  };

  return { courses, loading, error, addCourse, addModule, addLesson, updateCourse };
}