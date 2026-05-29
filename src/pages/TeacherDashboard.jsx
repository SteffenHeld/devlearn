import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/AuthContext";
import useCourses from "../hooks/useCourses";

export default function TeacherDashboard() {
  const { user } = useAuth();
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  const myCourses = useMemo(() => {
    return courses.filter((course) => course.createdBy === user?.uid);
  }, [courses, user]);

  const grouped = useMemo(() => {
    return myCourses.reduce((acc, course) => {
      const cat = course.category || "Sonstige";
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(course);
      return acc;
    }, {});
  }, [myCourses]);

  if (loading) return <CircularProgress sx={{ m: 4 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Layout>
      <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", sm: "center" },
        gap: 2,
        mb: 2,
      }}
      >
      <Typography variant="h4" fontWeight={700}>
        Teacher Dashboard
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => navigate("/teacher/kurse")}
      >
        Neuer Kurs
      </Button>
    </Box>
      <Typography variant="body1" color="text.secondary" mb={4}>
        Hier siehst du alle Kurse die du erstellt hast.
      </Typography>

      {myCourses.length === 0 ? (
        <Typography color="text.secondary">
          Du hast noch keine Kurse erstellt.
        </Typography>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <Box key={category} mb={5} mt={3}>
            <Typography variant="h6" fontWeight={600} mb={1}>
              {category}
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {items.map((course) => (
                <Card key={course.id} sx={{ width: 280, flexShrink: 0 }} elevation={2}>
                  <CardActionArea onClick={() => navigate(`/teacher/courses/${course.id}`)}>
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
        ))
      )}
    </Layout>
  );
}