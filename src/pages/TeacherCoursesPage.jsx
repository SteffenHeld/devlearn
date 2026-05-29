import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Card, CardContent, CardActionArea,
  Button, TextField, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Chip, Grid, MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "HTML / CSS / JavaScript",
  "React / Vite / TypeScript",
  "Figma",
  "Framer",
];

export default function TeacherCoursesPage() {
  const { courses, loading } = useCourses();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!title.trim()) return;
    setSaving(true);
    await addDoc(collection(db, "courses"), {
      title,
      description,
      category,
      createdBy: user.uid,
    });
    setTitle("");
    setDescription("");
    setCategory(CATEGORIES[0]);
    setSaving(false);
    setOpen(false);
  }

  return (
    <Layout>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Kursverwaltung
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
          Neuer Kurs
        </Button>
      </Box>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {!loading && courses.length === 0 && (
        <Typography color="text.secondary">Noch keine Kurse vorhanden.</Typography>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/teacher/kurse/${course.id}`)}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mb={2}>
                    {course.description}
                  </Typography>
                  <Chip
                    label={course.category || "Sonstige"}
                    size="small"
                    color="primary"
                  />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Neuen Kurs erstellen</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField
            label="Titel"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Beschreibung"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
          <TextField
            select
            label="Kategorie"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            fullWidth
          >
            {CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Abbrechen</Button>
          <Button
            variant="contained"
            onClick={handleCreate}
            disabled={saving || !title.trim()}
          >
            {saving ? "Speichern..." : "Erstellen"}
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}