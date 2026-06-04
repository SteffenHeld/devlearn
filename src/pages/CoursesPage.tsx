import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Card, CardContent, CardActionArea,
  CircularProgress, Button, Divider, Chip
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export default function ModuleDetailPage() {
  const { kursId, modulId } = useParams();
  const navigate = useNavigate();
  const [module, setModule] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);

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
        onClick={() => navigate(`/kurse/${kursId}`)}
        sx={{ mb: 2 }}
      >
        Zurück zum Kurs
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 700 }} gutterBottom>
        {module?.title}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
        Lektionen
      </Typography>

      {lessons.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          Noch keine Lektionen vorhanden.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {lessons.map((lesson, index) => (
          <Card key={lesson.id}>
            <CardActionArea
              onClick={() => navigate(`/kurse/${kursId}/${modulId}/${lesson.id}`)}
            >
              <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="overline" sx={{ color: "text.secondary" }}>
                    Lektion {index + 1}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {lesson.title}
                  </Typography>
                </Box>
                <Chip
                  icon={<CheckCircleIcon />}
                  label="Offen"
                  size="small"
                  variant="outlined"
                  color="default"
                />
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}