export type UserRole = 'user' | 'admin';

export type AvatarGender = 'female' | 'male' | 'neutral';
export type AvatarBodyType = 'slim' | 'regular' | 'curvy';
export type AvatarHairStyle = 'short' | 'bob' | 'long';
export type AvatarSkinTone = 'light' | 'medium' | 'dark';

export interface AvatarProfile {
  gender: AvatarGender;
  bodyType: AvatarBodyType;
  hairStyle: AvatarHairStyle;
  skinTone: AvatarSkinTone;
  hairColor: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarConfigured: boolean;
  avatarProfile: AvatarProfile | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}