import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Card, CardContent,
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

export default function TeacherModuleDetailPage() {
  const { kursId, modulId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [teacherContent, setTeacherContent] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const moduleSnap = await getDoc(
        doc(db, "courses", kursId, "modules", modulId)
      );
      if (moduleSnap.exists()) {
        setModule({ id: moduleSnap.id, ...moduleSnap.data() });
      }

      const lessonsQuery = query(
        collection(db, "courses", kursId, "modules", modulId, "lessons"),
        orderBy("order")
      );
      const lessonsSnap = await getDocs(lessonsQuery);
      setLessons(lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    fetchData();
  }, [kursId, modulId]);

  async function handleCreateLesson() {
    if (!title.trim()) return;
    setSaving(true);
    await addDoc(
      collection(db, "courses", kursId, "modules", modulId, "lessons"),
      {
        title,
        content,
        teacherContent,
        order: lessons.length + 1,
      }
    );
    const lessonsQuery = query(
      collection(db, "courses", kursId, "modules", modulId, "lessons"),
      orderBy("order")
    );
    const lessonsSnap = await getDocs(lessonsQuery);
    setLessons(lessonsSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
    setTitle("");
    setContent("");
    setTeacherContent("");
    setSaving(false);
    setOpen(false);
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
        onClick={() => navigate(`/teacher/kurse/${kursId}`)}
        sx={{ mb: 2 }}
      >
        Zurück zum Kurs
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        {module?.title}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Lektionen
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Neue Lektion
        </Button>
      </Box>

      {lessons.length === 0 && (
        <Typography color="text.secondary">
          Noch keine Lektionen vorhanden.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {lessons.map((lesson, index) => (
          <Card key={lesson.id}>
            <CardContent>
              <Typography variant="overline" color="text.secondary">
                Lektion {index + 1}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {lesson.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                {lesson.content}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Neue Lektion erstellen</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Lerninhalt (für Schüler)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            multiline
            rows={4}
          />
          <TextField
            label="Lehrerinhalt (nur für Teacher sichtbar)"
            value={teacherContent}
            onChange={(e) => setTeacherContent(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            variant="contained"
            onClick={handleCreateLesson}
            disabled={saving || !title.trim()}
          >
            {saving ? "Speichern..." : "Erstellen"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}