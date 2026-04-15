import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type {
  AuthUser,
  AvatarProfile,
  LoginPayload,
  RegisterPayload,
} from '../../types/auth';
import type { AuthContextValue } from './auth.types';
import { authStorage } from '../../services/storage/authStorage';
import {
  createMockUserFromLogin,
  createMockUserFromRegister,
} from './auth.utils';

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = authStorage.getUser();

    if (savedUser) {
      setUser(savedUser);
    }

    setIsLoading(false);
  }, []);

  const login = async (payload: LoginPayload) => {
    const mockUser = createMockUserFromLogin(payload);
    setUser(mockUser);
    authStorage.setUser(mockUser);
  };

  const register = async (payload: RegisterPayload) => {
    const mockUser = createMockUserFromRegister(payload);
    setUser(mockUser);
    authStorage.setUser(mockUser);
  };

  const updateAvatar = (avatarProfile: AvatarProfile) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;

      const nextUser: AuthUser = {
        ...prevUser,
        avatarConfigured: true,
        avatarProfile,
      };

      authStorage.setUser(nextUser);
      return nextUser;
    });
  };

  const logout = () => {
    setUser(null);
    authStorage.clearUser();
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      updateAvatar,
      logout,
    }),
    [user, isLoading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};