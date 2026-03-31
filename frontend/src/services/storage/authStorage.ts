import { STORAGE_KEYS } from '../../constants/storage';
import type { AuthUser } from '../../types/auth';

export const authStorage = {
  getUser(): AuthUser | null {
    const rawUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);

    if (!rawUser) return null;

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      return null;
    }
  },

  setUser(user: AuthUser) {
    localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
  },

  clearUser() {
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
  },
};