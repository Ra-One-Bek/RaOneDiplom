export type UserRole = 'user' | 'admin';

export type AvatarGender = 'male' | 'female';
export type AvatarBuild = 'slim' | 'medium' | 'full';
export type AvatarMuscle = 'min' | 'mid' | 'max';
export type AvatarHeightPreset = 'short' | 'medium' | 'tall';
export type AvatarSkinTone = 'light' | 'medium' | 'dark';

export interface AvatarProfile {
  gender: AvatarGender;
  build: AvatarBuild;
  muscle: AvatarMuscle;
  heightPreset: AvatarHeightPreset;
  skinTone: AvatarSkinTone;

  // Расширенные реальные morph-параметры текущего male-export
  morphAsianMaleYoung: number;
  morphCaucasianMaleYoung: number;
  morphAfricanMaleYoung: number;

  morphMaleMaxMuscleAvgWeight: number;
  morphMaleMaxMuscleAvgWeightMaxHeight: number;
  morphMaleMaxMuscleMaxWeight: number;
  morphMaleMaxMuscleMaxWeightMaxHeight: number;
  morphMaleAvgMuscleAvgWeight: number;

  morphMaleMaxMuscleAvgWeightIdealProportions: number;
  morphMaleMaxMuscleMaxWeightIdealProportions: number;
  morphMaleAvgMuscleAvgWeightIdealProportions: number;
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