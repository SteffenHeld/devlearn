import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box, Card, CardActionArea, CardContent,
  CircularProgress, Divider, Typography,
} from "@mui/material";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";
import { Course } from "../types";

export default function StudentDashboard() {
  const { user } = useAuth();
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  const grouped = useMemo<Record<string, Course[]>>(() => {
    return courses.reduce<Record<string, Course[]>>((acc, course) => {
      const cat = course.category ?? "Sonstige";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(course);
      return acc;
    }, {});
  }, [courses]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Layout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Willkommen zurück{user?.displayName ? `, ${user.displayName}` : ""}!
      </Typography>
      <Typography variant="body1" sx={{ color: "text.secondary", mb: 4 }}>
        Hier findest du alle verfügbaren Kurse nach Thema sortiert.
      </Typography>

      {Object.entries(grouped).map(([category, items]) => (
        <Box key={category} sx={{ mb: 5 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {category}
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
            {items.map((course) => (
              <Card key={course.id} sx={{ width: 280, flexShrink: 0 }} elevation={2}>
                <CardActionArea onClick={() => navigate(`/kurse/${course.id}`)}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {course.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
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