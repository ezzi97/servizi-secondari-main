import type { User } from 'src/types';
import type { ReactNode } from 'react';

import { useMemo, useState, useEffect, useContext, useCallback, createContext } from 'react';

import { authService } from 'src/services';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithToken: (token: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string) => Promise<void>;
  updateUser: (user: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Initialize auth state from localStorage and verify token
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      const storedUser = localStorage.getItem(USER_KEY);

      if (storedToken && storedUser) {
        try {
          // Verify the token is still valid
          const response = await authService.verifyToken();

          if (response.success && response.data?.user) {
            const user = response.data.user as unknown as User;
            localStorage.setItem(USER_KEY, JSON.stringify(user));

            setState({
              user,
              token: storedToken,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        } catch {
          // Token verification failed
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          setState({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          });
          return;
        }

        // Verification failed or unauthorized — clear stored data and log out
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }

      setState(prev => ({ ...prev, isLoading: false }));
    };

    initAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const response = await authService.login({ email, password });

    if (!response.success) {
      throw new Error(response.message || 'Login fallito');
    }

    const { token, user: userData } = response.data!;
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as User['role'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const loginWithGoogle = useCallback(async () => {
    const response = await authService.getGoogleOAuthUrl();

    if (!response.success || !response.data?.url) {
      throw new Error(response.message || 'Impossibile avviare il login con Google');
    }

    // Redirect the browser to Google OAuth
    window.location.href = response.data.url;
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    // Store token first so the verify call includes it in the Authorization header
    localStorage.setItem(TOKEN_KEY, token);

    const response = await authService.verifyToken();

    if (!response.success || !response.data?.user) {
      localStorage.removeItem(TOKEN_KEY);
      throw new Error('Token non valido');
    }

    const userData = response.data.user as unknown as User;
    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role as User['role'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(USER_KEY, JSON.stringify(user));

    setState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();

    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    const response = await authService.register({ email, password, name });

    if (!response.success) {
      throw new Error(response.message || 'Registrazione fallita');
    }

    // Don't auto-login after register - let the user sign in
    // (Supabase may require email confirmation)
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setState(prev => {
      if (!prev.user) return prev;

      const updatedUser = { ...prev.user, ...updates };
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));

      return { ...prev, user: updatedUser };
    });
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    ...state,
    login,
    loginWithGoogle,
    loginWithToken,
    logout,
    register,
    updateUser,
  }), [state, login, loginWithGoogle, loginWithToken, logout, register, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
