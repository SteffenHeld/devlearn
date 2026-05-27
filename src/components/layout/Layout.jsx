import { Box } from "@mui/material";
import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}