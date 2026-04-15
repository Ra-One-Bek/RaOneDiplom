import type {
  AuthUser,
  AvatarProfile,
  LoginPayload,
  RegisterPayload,
} from '../../types/auth';

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  updateAvatar: (avatarProfile: AvatarProfile) => void;
  logout: () => void;
}