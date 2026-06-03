import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Tooltip
} from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useThemeToggle } from "../../context/ThemeContext";

export default function Navbar() {
  const { user, role } = useAuth();
  const { mode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();

  async function handleLogout() {
    navigate("/");
    await signOut(auth);
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ flexGrow: 1, cursor: "pointer" }}
          onClick={() =>
            navigate(role === "teacher" ? "/teacher/dashboard" : "/dashboard")
          }
        >
          DevLearn
        </Typography>

        {user && role === "student" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" onClick={() => navigate("/dashboard")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/kurse")}>
              Kurse
            </Button>
          </Box>
        )}

        {user && role === "teacher" && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button color="inherit" onClick={() => navigate("/teacher/dashboard")}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={() => navigate("/teacher/kurse")}>
              Kurse
            </Button>
          </Box>
        )}

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, ml: 2 }}>
            <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Button color="inherit" onClick={handleLogout}>
              Abmelden
            </Button>
          </Box>
        )}

      </Toolbar>
    </AppBar>
  );
}