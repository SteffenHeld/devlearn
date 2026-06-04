import Layout from "../components/layout/Layout";
import useCourses from "../hooks/useCourses";
import {
  Typography, Grid, Card, CardContent, CardActionArea,
  CircularProgress, Box, Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CoursesPage() {
  const { courses, loading, error } = useCourses();
  const navigate = useNavigate();

  return (
    <Layout>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
        Alle Kurse
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography sx={{ color: "error" }}>{error}</Typography>
      )}

      {!loading && courses.length === 0 && (
        <Typography sx={{ color: "text.secondary" }}>
          Noch keine Kurse verfügbar.
        </Typography>
      )}

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={course.id}>
            <Card>
              <CardActionArea onClick={() => navigate(`/kurse/${course.id}`)}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {course.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                    {course.description}
                  </Typography>
                  <Chip label="Web Development" size="small" color="primary" />
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Layout>
  );
}