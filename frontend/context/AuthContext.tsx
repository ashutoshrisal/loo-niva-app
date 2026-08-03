'use client';

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export type Role =
  | 'super_admin'
  | 'project_manager'
  | 'field_staff'
  | 'viewer';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();

  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (
      storedUser &&
      storedUser !== 'undefined' &&
      storedUser !== 'null'
    ) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (err) {
        console.error('Invalid stored user:', err);
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

 const login = async (email: string, password: string): Promise<boolean> => {
  try {
    console.log("STEP 1 - login() called");
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      console.log("STEP 2 - API returned");
console.log(response.data);

      console.log('LOGIN RESPONSE:', response.data);

      const {
        user,
        accessToken,
        refreshToken,
      } = response.data.data;

      localStorage.setItem(
        'user',
        JSON.stringify(user)
      );

      localStorage.setItem(
        'loo_niva_access_token',
        accessToken
      );

      localStorage.setItem(
        'loo_niva_refresh_token',
        refreshToken
      );

      setUser(user);
      console.log("STEP 3 - User saved");
      console.log("STEP 4 - Redirecting");

      router.push('/dashboard');

      return true;
    } catch (error: any) {
      console.error('Login error:', error);

      if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
      } else if (error.request) {
        console.log('No response from server');
      } else {
        console.log(error.message);
      }

      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('loo_niva_access_token');
    localStorage.removeItem('loo_niva_refresh_token');

    setUser(null);

    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return ctx;
}