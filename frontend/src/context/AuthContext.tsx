import { createContext, useContext, useState, type ReactNode } from "react";
import axios from "axios";
import {
  API_LOGIN_URL,
  API_REGISTER_URL,
  API_ME_URL,
  API_LOGOUT_URL,
} from "../config";
import type {
  AuthContextType,
  AuthResponse,
  AuthMeResponse,
} from "@/types/auth_types";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const res = await axios.post<AuthResponse>(
        API_LOGIN_URL,
        { username, password },
        { withCredentials: true }
      );

      setToken(res.data.access_token);
      setUser(res.data.username);
      setError(null);

      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Login failed");

      return false;
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      const res = await axios.post<AuthResponse>(
        API_REGISTER_URL,
        { username, email, password },
        { withCredentials: true }
      );
      setToken(res.data.access_token);
      setUser(res.data.username);
      setError(null);

      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Registration failed");

      return false;
    }
  };

  const me = async () => {
    try {
      if (!token) {
        throw new Error("No token available");
      }

      const res = await axios.get<AuthMeResponse>(API_ME_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      setUser(res.data.username);
      setError(null);

      return true;
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to fetch user");

      return false;
    }
  };

  const logout = () => {
    try {
      if (!token) {
        throw new Error("No token available");
      }

      axios.post<{ message: String }>(
        API_LOGOUT_URL,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      setToken(null);
      setUser(null);
      setError(null);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Logout failed");
    }
  };

  const clearError = () => setError(null);

  const toggleShowAuthModal = () => setShowAuthModal(!showAuthModal);

  const requireAuth = (redirectTo?: string) => {
    if (redirectTo) setRedirectPath(redirectTo);
    setShowAuthModal(true);
  };

  const clearRedirect = () => setRedirectPath(null);

  return (
    <AuthContext.Provider
      value={{
        token,
        login,
        register,
        me,
        logout,
        user,
        error,
        clearError,
        showAuthModal,
        toggleShowAuthModal,
        requireAuth,
        redirectPath,
        clearRedirect,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
