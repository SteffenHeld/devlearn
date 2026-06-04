import { useState, useEffect } from "react";
import { collection, onSnapshot, orderBy, query, FirestoreError } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Course } from "../types";

interface UseCoursesReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
}

export default function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "courses"), orderBy("title"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data: Course[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Course, "id">),
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

  return { courses, loading, error };
}