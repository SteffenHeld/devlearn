import { useState, FormEvent } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  Container, Box, TextField, Button, Typography, Alert
} from "@mui/material";

export default function RegisterPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();

  async function handleRegister(e: FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError("");
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", user.uid), {
        displayName,
        email,
        role: "student",
      });
      navigate("/dashboard");
    } catch {
      setError("Registrierung fehlgeschlagen. Bitte versuche es erneut.");
    }
  }

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 10, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
          DevLearn
        </Typography>
        <Typography variant="body2" sx={{ textAlign: "center", color: "text.secondary" }}>
          Konto erstellen
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <form onSubmit={handleRegister}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              fullWidth
            />
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
              Registrieren
            </Button>
          </Box>
        </form>

        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Bereits ein Konto?{" "}
          <Link to="/login">Anmelden</Link>
        </Typography>
      </Box>
    </Container>
  );
}