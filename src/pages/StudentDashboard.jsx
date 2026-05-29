import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  const grouped = useMemo(() => {
    return courses.reduce((acc, course) => {
      const cat = course.category || "Sonstige";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(course);
      return acc;
    }, {});
  }, [courses]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Layout>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Willkommen zurück{user?.displayName ? `, ${user.displayName}` : ""}!
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Hier findest du alle verfügbaren Kurse nach Thema sortiert.
      </Typography>

      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} mb={5}>
          <Typography variant="h6" fontWeight={600} mb={1}>
            {category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {items.map((course) => (
              <Card
                key={course.id}
                sx={{ width: 280, flexShrink: 0 }}
                elevation={2}
              >
                <CardActionArea
                  onClick={() => navigate(`/courses/${course.id}`)}
                >
                  <CardContent>
                    <Typography variant="subtitle1" fontWeight={600} mb={0.5}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {course.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            ))}
          </Box>
        </Box>
      ))}
    </Layout>
  );
}