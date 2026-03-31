import type { AuthUser, LoginPayload, RegisterPayload } from '../../types/auth';

export const createMockUserFromLogin = (payload: LoginPayload): AuthUser => {
  const isAdmin = payload.email.trim().toLowerCase() === 'admin@raone.com';

  return {
    id: crypto.randomUUID(),
    name: isAdmin ? 'Администратор' : 'Пользователь',
    email: payload.email,
    role: isAdmin ? 'admin' : 'user',
    avatarConfigured: false,
  };
};

export const createMockUserFromRegister = (
  payload: RegisterPayload
): AuthUser => {
  return {
    id: crypto.randomUUID(),
    name: payload.name,
    email: payload.email,
    role: 'user',
    avatarConfigured: false,
  };
};