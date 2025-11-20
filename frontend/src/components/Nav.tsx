import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

function Nav() {
  const { token, logout, requireAuth } = useAuth();

  return (
    <>
      <nav className="flex items-center justify-between p-4 shadow-md">
        <div className="text-xl font-bold">
          <Link to="/">quizloop</Link>
        </div>

        <div className="hidden md:flex gap-4">
          {!token ? (
            <Button variant="ghost" onClick={() => requireAuth()}>
              Log In
            </Button>
          ) : (
            <div>
              <Button asChild variant="ghost">
                <Link to="/upload">Upload</Link>
              </Button>

              <Button variant="ghost" onClick={logout}>
                Log Out
              </Button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}

export default Nav;
