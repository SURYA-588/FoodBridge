
export enum UserRole {
  PROVIDER = 'PROVIDER',
  NGO = 'NGO',
  ADMIN = 'ADMIN'
}

export enum FoodType {
  VEG = 'Veg',
  NON_VEG = 'Non-Veg'
}

export enum PostStatus {
  AVAILABLE = 'Available',
  COLLECTED = 'Collected',
  EXPIRED = 'Expired'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  district?: string;
  organization?: string;
  phone?: string;
  isVerified: boolean;
  token?: string; // JWT Token
}

export interface FoodPost {
  id: string;
  providerId: string;
  providerName: string;
  foodItems: string;
  type: FoodType;
  quantity: number;
  district: string;
  location: string;
  expiryTime: string;
  contactNumber: string;
  status: PostStatus;
  ngoId?: string;
  ngoName?: string;
  collectedAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface DashboardStats {
  totalMealsServed: number;
  activeDonations: number;
  totalDonors: number;
  activeNGOs: number;
}
