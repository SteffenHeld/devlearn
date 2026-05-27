import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/firebase";
import Layout from "../components/layout/Layout";
import {
  Typography, Box, Card, CardContent, CardActionArea,
  CircularProgress, Chip, Divider
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Button } from "@mui/material";

export default function CourseDetailPage() {
  const { kursId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const courseSnap = await getDoc(doc(db, "courses", kursId));
      if (courseSnap.exists()) {
        setCourse({ id: courseSnap.id, ...courseSnap.data() });
      }

      const modulesQuery = query(
        collection(db, "courses", kursId, "modules"),
        orderBy("order")
      );
      const modulesSnap = await getDocs(modulesQuery);
      setModules(modulesSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }

    fetchData();
  }, [kursId]);

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
        onClick={() => navigate("/kurse")}
        sx={{ mb: 2 }}
      >
        Zurück zu den Kursen
      </Button>

      <Typography variant="h4" fontWeight={700} gutterBottom>
        {course?.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        {course?.description}
      </Typography>
      <Chip label="Web Development" color="primary" size="small" sx={{ mb: 3 }} />
      <Divider sx={{ mb: 3 }} />

      <Typography variant="h5" fontWeight={600} mb={2}>
        Module
      </Typography>

      {modules.length === 0 && (
        <Typography color="text.secondary">
          Noch keine Module vorhanden.
        </Typography>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {modules.map((module, index) => (
          <Card key={module.id}>
            <CardActionArea onClick={() => navigate(`/kurse/${kursId}/${module.id}`)}>
              <CardContent>
                <Typography variant="overline" color="text.secondary">
                  Modul {index + 1}
                </Typography>
                <Typography variant="h6" fontWeight={600}>
                  {module.title}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Layout>
  );
}