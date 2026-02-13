import axios from 'axios';
import { Food, FoodInput } from '../types/food';

// Use environment variable or fallback to localhost for development
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- CRUD operations ----------

export const getAllFoods = async (): Promise<Food[]> => {
  const res = await api.get('/foods');
  return res.data.data;
};

export const getFoodById = async (id: string): Promise<Food> => {
  const res = await api.get(`/foods/${id}`);
  return res.data.data;
};

export const createFood = async (food: FoodInput): Promise<Food> => {
  const res = await api.post('/foods', food);
  return res.data.data;
};

export const updateFood = async (id: string, food: FoodInput): Promise<Food> => {
  const res = await api.put(`/foods/${id}`, food);
  return res.data.data;
};

export const deleteFood = async (id: string): Promise<void> => {
  await api.delete(`/foods/${id}`);
};
