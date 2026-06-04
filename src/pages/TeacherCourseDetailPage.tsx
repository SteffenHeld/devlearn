import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, addDoc, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { Course, Module } from "../types";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Card, CardContent, CardActionArea,
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";

export default function TeacherCourseDetailPage() {
  const { kursId } = useParams<{ kursId: string }>();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (!kursId) return;

    async function fetchData(): Promise<void> {
      const courseSnap = await getDoc(doc(db, "courses", kursId!));
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...(courseSnap.data() as Omit<Course, "id">) });
      }

      const modulesQuery = query(
        collection(db, "courses", kursId!, "modules"),
        orderBy("order")
      );
      const modulesSnap = await getDocs(modulesQuery);
      setModules(modulesSnap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Module, "id">),
      })));
      setLoading(false);
    }

    fetchData();
  }, [kursId]);

  async function handleCreateModule(): Promise<void> {
    if (!title.trim() || !kursId) return;
    setSaving(true);
    await addDoc(collection(db, "courses", kursId, "modules"), {
      title,
      order: modules.length + 1,
    });
    const modulesQuery = query(
      collection(db, "courses", kursId, "modules"),
      orderBy("order")
    );
    const modulesSnap = await getDocs(modulesQuery);
    setModules(modulesSnap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Module, "id">),
    })));
    setTitle("");
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
        onClick={() => navigate("/teacher/kurse")}
        sx={{ mb: 2 }}
      >
        Zurück zur Kursverwaltung
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        {course?.title}
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 2 }}>
        {course?.description}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Module
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Neues Modul
        </Button>
      </Box>

      {modules.length === 0 && (
        <Typography color="text.secondary">Noch keine Module vorhanden.</Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {modules.map((module, index) => (
          <Card key={module.id}>
            <CardActionArea onClick={() => navigate(`/teacher/kurse/${kursId}/${module.id}`)}>
              <CardContent>
                <Typography variant="overline" sx={{color:"text.secondary"}}>
                  Modul {index + 1}
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {module.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Neues Modul erstellen</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            variant="contained"
            onClick={handleCreateModule}
            disabled={saving || !title.trim()}
          >
            {saving ? "Speichern..." : "Erstellen"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}