import Layout from "../components/layout/Layout";
import { Typography } from "@mui/material";

export default function StudentDashboard() {
  return (
    <Layout>
      <Typography variant="h4" fontWeight={700}>
        Willkommen zurück!
      </Typography>
    </Layout>
  );
}