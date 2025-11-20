export interface AuthContextType {
  token: string | null;
  login: (username: string, password: string) => Promise<Boolean>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<Boolean>;
  me: () => Promise<Boolean>;
  logout: () => void;
  user: string | null;
  error: string | null;
  clearError: () => void;
  showAuthModal: boolean;
  toggleShowAuthModal: () => void;
  requireAuth: (redirectTo?: string) => void;
  redirectPath: string | null;
  clearRedirect: () => void;
}

export interface AuthResponse {
  access_token: string;
  username: string;
  message?: string;
}

export interface AuthMeResponse {
  username: string;
  message?: string;
}
