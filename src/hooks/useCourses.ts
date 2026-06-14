import { useState, useEffect } from "react";
import {
  collection, onSnapshot, orderBy, query, FirestoreError,
  addDoc, updateDoc, doc, serverTimestamp, getDocs,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Course, Module } from "../types";
import { useAuth } from "../context/AuthContext";
import { toSlug } from "../utils/slug";

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
  addCourse:    (data: NewCourse) => Promise<{ id: string; slug: string }>; // ← slug ergänzt
  addModule:    (courseId: string, data: NewModule) => Promise<{ id: string }>;
  addLesson:    (courseId: string, moduleId: string, data: NewLesson) => Promise<{ id: string }>;
  updateCourse: (courseId: string, data: Partial<NewCourse>) => Promise<void>;
}

export default function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError]     = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("title"));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        // Subcollections nur laden wenn User eingeloggt ist
        // — Module/Lektionen sind laut Firestore Rules nur für auth != null lesbar
        // — PublicCoursesPage lädt nur Kurse ohne Login, daher kein Subcollection-Read
        const data: Course[] = await Promise.all(
          snapshot.docs.map(async (d) => {
            if (!user) {
              // Nicht eingeloggt — nur Kursdaten ohne Module zurückgeben
              return {
                id: d.id,
                ...(d.data() as Omit<Course, "id">),
                modules: [],
              };
            }

            const modulesSnap = await getDocs(
              query(
                collection(db, "courses", d.id, "modules"),
                orderBy("order")
              )
            );

            // Für jedes Modul auch die Lektionen laden
            const modules: Module[] = await Promise.all(
              modulesSnap.docs.map(async (m) => {
                const lessonsSnap = await getDocs(
                  query(
                    collection(db, "courses", d.id, "modules", m.id, "lessons"),
                    orderBy("order")
                  )
                );
                return {
                  id: m.id,
                  ...(m.data() as Omit<Module, "id">),
                  lessons: lessonsSnap.docs.map((l) => ({
                    id: l.id,
                    ...(l.data() as any),
                  })),
                };
              })
            );

            return {
              id: d.id,
              ...(d.data() as Omit<Course, "id">),
              modules,
            };
          })
        );

        setCourses(data);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  // user als Dependency — wenn User sich einloggt, werden Module nachgeladen
  }, [user]);

  // Kurs erstellen
  const addCourse = async (data: NewCourse): Promise<{ id: string; slug: string }> => {
    const slug = toSlug(data.title);
    const ref = await addDoc(collection(db, "courses"), {
      title:       data.title,
      slug,
      category:    data.category ?? "HTML/CSS/JS",
      description: data.description ?? "",
      createdBy:   user?.uid ?? "",
      moduleCount: 0,
      lessonCount: 0,
      createdAt:   serverTimestamp(),
    });
    return { id: ref.id, slug };
  };

  // Modul erstellen
  const addModule = async (
    courseId: string,
    data: NewModule
  ): Promise<{ id: string }> => {
    const ref = await addDoc(
      collection(db, "courses", courseId, "modules"),
      {
        title:       data.title,
        description: data.description ?? "",
        lessonCount: 0,
        order:       Date.now(),
        createdAt:   serverTimestamp(),
      }
    );
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
        duration:  data.duration ?? 0,
        order:     Date.now(),
        createdAt: serverTimestamp(),
      }
    );
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