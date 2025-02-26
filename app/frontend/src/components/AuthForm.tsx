import { useNavigate } from "react-router-dom";
import { useForm, isEmail, hasLength } from "@mantine/form";
import { Button, Group, TextInput, PasswordInput, Container, Card, Center } from "@mantine/core";
import { AuthAPI } from "../lib/api";
import { showNotification } from "../lib/notify";

export default function AuthForm() {
  const navigate = useNavigate();
  const form = useForm({
    mode: "uncontrolled",
    initialValues: { email: "", password: "" },
    validate: {
      email: isEmail("Invalid email"),
      password: hasLength({ min: 6 }, "Password must be at least 6 characters long"),
    },
  });

  const handleLogin = async (values: { email: string; password: string }) => {
    console.log("🔍 Attempting login with:", values);
    try {
      const response = await AuthAPI.login(values.email, values.password);
      if (response.success) {
        showNotification("success", "Login Successful", "Welcome back!");
        navigate("/dashboard");
      } else {
        showNotification("error", "Login Failed", response.message);
      }
    } catch (err) {
      showNotification("error", "Login Failed", "Unexpected error");
    }
  };

  return (
    <Center style={{ height: "100vh" }}>
      <Container size={420}>
        <Card shadow="sm" p="xl" radius="md" withBorder>
          {/* ✅ Replace Mantine Title with plain h2 */}
          <h2 style={{ fontSize: "2rem", fontWeight: "bold", textAlign: "center" }}>Sign In</h2>

          <form onSubmit={form.onSubmit(handleLogin)}>
            <TextInput label="Email" placeholder="Your email" withAsterisk {...form.getInputProps("email")} />
            <PasswordInput label="Password" placeholder="Your password" withAsterisk mt="md" {...form.getInputProps("password")} />
            <Group justify="flex-end" mt="md">
              <Button type="submit" fullWidth>Sign In</Button>
            </Group>
          </form>
        </Card>
      </Container>
    </Center>
  );
}
