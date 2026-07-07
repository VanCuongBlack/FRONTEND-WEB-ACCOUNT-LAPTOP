export interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  province: string;
  district: string;
  avatarUrl: string;
  memberSince: string;
}

export const PROFILE_STORAGE_KEY = "userProfile";

export const DEFAULT_USER_PROFILE: UserProfile = {
  fullName: "Kim Ngân",
  email: "kimngan@gmail.com",
  phone: "0901234567",
  password: "12345678",
  address: "Phan Văn Trị",
  province: "Hồ Chí Minh",
  district: "Quận 7",
  avatarUrl:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=220&auto=format&fit=crop&q=80",
  memberSince: "2026",
};

export function getStoredUserProfile(): UserProfile {
  try {
    const rawProfile = localStorage.getItem(PROFILE_STORAGE_KEY);

    if (!rawProfile) {
      return DEFAULT_USER_PROFILE;
    }

    const parsedProfile = JSON.parse(rawProfile) as Partial<UserProfile>;

    return {
      ...DEFAULT_USER_PROFILE,
      ...parsedProfile,
    };
  } catch {
    return DEFAULT_USER_PROFILE;
  }
}

export function saveUserProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
}