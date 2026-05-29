import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
} from "@mui/material";
import CodeIcon from "@mui/icons-material/Code";
import BrushIcon from "@mui/icons-material/Brush";
import DevicesIcon from "@mui/icons-material/Devices";
import AccountTreeIcon from "@mui/icons-material/AccountTree";

const CATEGORIES = [
  {
    title: "HTML / CSS / JavaScript",
    description: "Die Grundlagen des Webs – Struktur, Design und Interaktivität.",
    icon: <CodeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "React / Vite / TypeScript",
    description: "Moderne Frontend-Entwicklung mit den beliebtesten Tools.",
    icon: <DevicesIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Figma",
    description: "UI/UX Design – von der Idee zum klickbaren Prototypen.",
    icon: <BrushIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
  {
    title: "Framer",
    description: "Interaktive Webseiten ohne Code – Design trifft Animation.",
    icon: <AccountTreeIcon sx={{ fontSize: 40, color: "primary.main" }} />,
  },
];

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Navbar */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          px: 4,
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="primary">
          DevLearn
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate("/login")}>
            Anmelden
          </Button>
          <Button variant="contained" onClick={() => navigate("/register")}>
            Registrieren
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          textAlign: "center",
          py: 10,
          px: 2,
          background: "linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)",
          color: "white",
        }}
      >
        <Typography variant="h3" fontWeight={700} mb={4}>
          Lerne Web Development – Schritt für Schritt.
        </Typography>
        <Typography variant="h6" mb={6} sx={{ opacity: 0.9 }}>
          Strukturierte Kurse für Einsteiger und Fortgeschrittene.
        </Typography>
        <Button
          variant="contained"
          size="large"
          onClick={() => navigate("/register")}
          sx={{
            mt: 4,
            bgcolor: "white",
            color: "primary.main",
            fontWeight: 700,
            "&:hover": { bgcolor: "#f0f0f0" },
          }}
        >
          Jetzt kostenlos starten
        </Button>
      </Box>

      {/* Kategorien */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>
          Was du lernst
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={5}
        >
          Vier Themenbereiche – von den Grundlagen bis zu modernen Tools.
        </Typography>

        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {CATEGORIES.map((cat) => (
            <Card
              key={cat.title}
              elevation={2}
              sx={{ width: 260, textAlign: "center" }}
            >
              <CardContent sx={{ py: 4 }}>
                {cat.icon}
                <Typography variant="h6" fontWeight={600} mt={2} mb={1}>
                  {cat.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {cat.description}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          textAlign: "center",
          py: 4,
          mt: "auto",
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © 2026 DevLearn – Alle Rechte vorbehalten.
        </Typography>
      </Box>
    </Box>
  );
}