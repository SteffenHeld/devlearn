import { ReactNode } from "react";
import { Box } from "@mui/material";
import Navbar from "./NavBar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "background.default" }}>
      <Navbar />
      <Box sx={{ p: 3 }}>
        {children}
      </Box>
    </Box>
  );
}