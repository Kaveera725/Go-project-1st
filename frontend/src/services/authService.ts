import axios from 'axios';
import { AuthResponse, LoginInput, RegisterInput, User } from '../types/auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export const login = async (input: LoginInput): Promise<AuthResponse> => {
  const res = await api.post('/auth/login', input);
  return res.data;
};

export const register = async (input: RegisterInput): Promise<AuthResponse> => {
  const res = await api.post('/auth/register', input);
  return res.data;
};

export const getMe = async (token: string): Promise<User> => {
  const res = await api.get('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.user;
};
