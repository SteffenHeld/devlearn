import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Container, Box, TextField, Button, Typography, Alert
} from "@mui/material";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { user, role, loading } = useAuth();
    

    useEffect(() => {
      if (loading) return;
      if (user && role === "teacher") navigate("/teacher/dashboard");
      if (user && role === "student") navigate("/dashboard");
    }, [user, role, loading, navigate]);
  
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (_err) {
      setError("E-Mail oder Passwort falsch.");
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center">
          DevLearn
        </Typography>
        <Typography variant="body2" textAlign="center" color="text.secondary">
          Melde dich an
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="E-Mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          <TextField
            label="Passwort"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            fullWidth
          />
          <Button type="submit" variant="contained" fullWidth size="large">
            Anmelden
          </Button>
        </Box>

        <Typography variant="body2" textAlign="center">
          Noch kein Konto?{" "}
          <Link to="/register">Registrieren</Link>
        </Typography>
      </Box>
    </Container>
  );
}