import type { AuthUser, AvatarProfile, LoginPayload, RegisterPayload } from '../../types/auth';

export const DEFAULT_AVATAR_PROFILE: AvatarProfile = {
  gender: 'neutral',
  bodyType: 'regular',
  hairStyle: 'short',
  skinTone: 'medium',
  hairColor: '#2f1b14',
};

export const createMockUserFromLogin = (payload: LoginPayload): AuthUser => {
  const isAdmin = payload.email.trim().toLowerCase() === 'admin@raone.com';

  return {
    id: crypto.randomUUID(),
    name: isAdmin ? 'Администратор' : 'Пользователь',
    email: payload.email,
    role: isAdmin ? 'admin' : 'user',
    avatarConfigured: false,
    avatarProfile: null,
  };
};

export const createMockUserFromRegister = (payload: RegisterPayload): AuthUser => {
  return {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    role: 'user',
    avatarConfigured: false,
    avatarProfile: null,
  };
};