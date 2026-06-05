// useAuth.ts
// Dieser Hook ist ein Re-Export aus dem AuthContext.
// Er existiert damit alle Seiten einheitlich aus "../hooks/useAuth" importieren können,
// anstatt direkt aus "../context/AuthContext".
//
// Verwendung:
//   import { useAuth } from "../hooks/useAuth";
//   const { user, role, loading } = useAuth();

export { useAuth } from "../context/AuthContext";
