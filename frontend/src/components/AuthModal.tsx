import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

function AuthModal() {
  const {
    login,
    error,
    clearError,
    showAuthModal,
    toggleShowAuthModal,
    redirectPath,
    clearRedirect,
  } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await login(username, password);
    if (res) {
      clearAllAndToggleModal();
      clearRedirect();
      if (redirectPath) {
        navigate(redirectPath);
      }
    }
  };

  const clearAllAndToggleModal = () => {
    toggleShowAuthModal();
    clearError();
    setUsername("");
    setPassword("");
  };

  return (
    <Dialog open={showAuthModal} onOpenChange={() => clearAllAndToggleModal()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="mb-4">Log In</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleAuth} className="grid gap-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              clearError();
            }}
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              clearError();
            }}
          />
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Something went wrong.</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <Button
            asChild
            variant="link"
            onClick={() => clearAllAndToggleModal()}
          >
            <Link to="/forgot-password">Forgot password?</Link>
          </Button>
          <Button
            asChild
            variant="link"
            onClick={() => clearAllAndToggleModal()}
          >
            <Link to="/register">Sign Up</Link>
          </Button>
          <DialogFooter>
            <Button type="submit">Log In</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AuthModal;
