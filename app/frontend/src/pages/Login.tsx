import { Button, Label, TextInput, Card } from "flowbite-react";

export default function Login() {
  return (
    <Card className="w-full max-w-sm mx-auto">
      <h2 className="text-xl font-semibold text-center">Login</h2>
      <form className="flex flex-col gap-4">
        <div>
          <Label htmlFor="email" value="Email" />
          <TextInput id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div>
          <Label htmlFor="password" value="Password" />
          <TextInput id="password" type="password" required />
        </div>
        <Button type="submit">Login</Button>
      </form>
    </Card>
  );
}
