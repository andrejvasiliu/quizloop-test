import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";

function Register() {
  const { token, register, error, clearError } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await register(username, email, password);
      setUsername("");
      setEmail("");
      setPassword("");

      if (res) navigate("/");
    } catch (err: any) {
      console.error("Registration error:", err.response?.data || err.message);
    }
  };

  return (
    <>
      {!token ? (
        <Card>
          <CardHeader>
            <CardTitle>Sign Up to Quizloop</CardTitle>
          </CardHeader>
          <form onSubmit={handleRegister} className="grid gap-4">
            <CardContent>
              <div className="grid gap-1.5">
                <Label>Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Pick a username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    clearError();
                  }}
                />
                <Label>Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                />
                <Label>Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Pick a password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    clearError();
                  }}
                />
              </div>
              {error && <p className="text-sm text-red-500">{error}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit">Sign Up</Button>
            </CardFooter>
          </form>
        </Card>
      ) : (
        <Navigate to="/" />
      )}
    </>
  );
}

export default Register;
