import { useAuth } from "@/context/AuthContext";
import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";

export const ProtectedRoute = () => {
  const { token, requireAuth } = useAuth();
  const location = useLocation();

  const skipModalRef = useRef(false);

  useEffect(() => {
    if (!token && !skipModalRef.current) {
      requireAuth(location.pathname);
    }
    skipModalRef.current = true;
  }, [token, requireAuth, location.pathname]);

  // TO DO: Add template for restricted pages
  if (!token) return <div />;

  return <Outlet />;
};
