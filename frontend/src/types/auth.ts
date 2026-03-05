// Auth types
export interface User {
  id: string;
  username: string;
  role: 'admin' | 'customer';
}

export interface LoginInput {
  username: string;
  password: string;
}

export interface RegisterInput {
  username: string;
  password: string;
  role: 'admin' | 'customer';
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}
