import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Button, CircularProgress,
  Divider, Paper, Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function LessonPage() {
  const { kursId, modulId, lektionId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const lessonSnap = await getDoc(
        doc(db, "courses", kursId, "modules", modulId, "lessons", lektionId)
      );
      if (lessonSnap.exists()) {
        setLesson({ id: lessonSnap.id, ...lessonSnap.data() });
      }

      const progressSnap = await getDoc(
        doc(db, "users", user.uid, "progress", lektionId)
      );
      if (progressSnap.exists()) {
        setCompleted(progressSnap.data().completed);
      }

      setLoading(false);
    }

    fetchData();
  }, [kursId, modulId, lektionId, user.uid]);

  async function handleComplete() {
    await setDoc(doc(db, "users", user.uid, "progress", lektionId), {
      completed: true,
      completedAt: new Date(),
    });
    setCompleted(true);
  }

  if (loading) return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    </Layout>
  );

  return (
    <Layout>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}
        sx={{ mb: 2 }}
      >
        Zurück zum Modul
      </Button>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1 }}>
        <Typography variant="h4" fontWeight={700}>
          {lesson?.title}
        </Typography>
        {completed && (
          <Chip
            icon={<CheckCircleIcon />}
            label="Abgeschlossen"
            color="success"
            size="small"
          />
        )}
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Paper elevation={0} sx={{ p: 3, mb: 4, backgroundColor: "background.paper", borderRadius: 2 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
          {lesson?.content}
        </Typography>
      </Paper>

      {!completed && (
        <Button
          variant="contained"
          size="large"
          startIcon={<CheckCircleIcon />}
          onClick={handleComplete}
        >
          Lektion abschließen
        </Button>
      )}

      {completed && (
        <Button
          variant="outlined"
          size="large"
          onClick={() => navigate(`/kurse/${kursId}/${modulId}`)}
        >
          Weiter zum Modul
        </Button>
      )}
    </Layout>
  );
}