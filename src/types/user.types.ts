// User role types
export type UserRole = 'admin' | 'operator' | 'user';

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  address?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// User profile update payload
export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  address?: string;
  avatarUrl?: string;
}

// User list item (for table display)
export interface UserListItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'banned';
  isVerified: boolean;
}

// User statistics
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

