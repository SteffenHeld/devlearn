import { useState } from "react";
import {
  AppBar, Toolbar, Typography, Button, Box,
  IconButton, Tooltip, Drawer, List, ListItem,
  ListItemButton, ListItemText, Divider
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebase";
import { useAuth } from "../../context/AuthContext";
import { useThemeToggle } from "../../context/ThemeContext";

export default function NavBar() {
  const { user, role } = useAuth();
  const { mode, toggleTheme } = useThemeToggle();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout(): Promise<void> {
    setDrawerOpen(false);
    navigate("/");
    await signOut(auth);
  }

  function handleNavigate(path: string): void {
    setDrawerOpen(false);
    navigate(path);
  }

  const studentLinks = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Kurse", path: "/kurse" },
  ];

  const teacherLinks = [
    { label: "Dashboard", path: "/teacher/dashboard" },
    { label: "Kurse", path: "/teacher/kurse" },
  ];

  const navLinks = role === "teacher" ? teacherLinks : studentLinks;
  const dashboardPath = role === "teacher" ? "/teacher/dashboard" : "/dashboard";

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, flexGrow: 1, cursor: "pointer" }}
            onClick={() => navigate(dashboardPath)}
          >
            DevLearn
          </Typography>

          {/* Desktop-Navigation */}
          {user && (
            <Box sx={{ display: { xs: "none", md: "flex" }, gap: 1, alignItems: "center" }}>
              {navLinks.map((link) => (
                <Button key={link.path} color="inherit" onClick={() => navigate(link.path)}>
                  {link.label}
                </Button>
              ))}
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

          {/* Theme-Toggle auch ohne Login (Desktop) */}
          {!user && (
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"}>
                <IconButton color="inherit" onClick={toggleTheme}>
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Hamburger-Button (Mobile) */}
          <Box sx={{ display: { xs: "flex", md: "none" }, alignItems: "center", gap: 0.5 }}>
            <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"}>
              <IconButton color="inherit" onClick={toggleTheme}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      >
        <Box sx={{ width: 240, pt: 2 }} role="presentation">
          <Typography variant="h6" sx={{ fontWeight: 700, px: 2, pb: 1 }}>
            DevLearn
          </Typography>
          <Divider />

          {user && (
            <List>
              {navLinks.map((link) => (
                <ListItem key={link.path} disablePadding>
                  <ListItemButton onClick={() => handleNavigate(link.path)}>
                    <ListItemText primary={link.label} />
                  </ListItemButton>
                </ListItem>
              ))}
              <Divider sx={{ my: 1 }} />
              <ListItem disablePadding>
                <ListItemButton onClick={handleLogout}>
                  <ListItemText primary="Abmelden" />
                </ListItemButton>
              </ListItem>
            </List>
          )}

          {!user && (
            <List>
              <ListItem disablePadding>
                <ListItemButton onClick={() => handleNavigate("/login")}>
                  <ListItemText primary="Anmelden" />
                </ListItemButton>
              </ListItem>
            </List>
          )}
        </Box>
      </Drawer>
    </>
  );
}