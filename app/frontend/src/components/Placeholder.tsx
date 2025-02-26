import { Container, Text, Center } from "@mantine/core";

export default function Placeholder({ pageName }: { pageName: string }) {
  return (
    <Center style={{ height: "100vh", textAlign: "center" }}>
      <Container>
        {/* ✅ Change Title to plain <h2> for instant rendering */}
        <h2 style={{ fontSize: "2rem", fontWeight: 600 }}>{pageName} is Under Construction</h2>
        
        <Text size="md" c="dimmed" mt="sm">
          This page is currently under development. Check back next release! 🚀
        </Text>
      </Container>
    </Center>
  );
}
