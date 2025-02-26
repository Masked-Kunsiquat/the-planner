import { AppShell } from "@mantine/core";
import Navbar from "./Navbar"; // ✅ Import Navbar component

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell padding="md" header={{ height: 60 }}> {/* ✅ Fix: Define height here */}
      <Navbar />
      {children}
    </AppShell>
  );
}
