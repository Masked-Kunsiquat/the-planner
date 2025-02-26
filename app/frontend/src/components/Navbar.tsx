import { AppShell, Container, Button, Group } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { AuthAPI } from "../lib/api";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    AuthAPI.logout();
    navigate("/signin"); // ✅ Redirect to sign-in page after logout
  };

  return (
    <AppShell.Header> {/* ✅ FIX: Removed height prop */}
      <Container>
        <Group justify="space-between"> {/* ✅ Fix: Use justify instead of position */}
          <strong>The Planner</strong>
          <Button variant="outline" color="red" size="sm" onClick={handleLogout}>
            Logout
          </Button>
        </Group>
      </Container>
    </AppShell.Header>
  );
}
