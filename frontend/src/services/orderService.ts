import axios from 'axios';
import { Order, OrderInput } from '../types/order';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = async (input: OrderInput): Promise<Order> => {
  const res = await axios.post(`${API_BASE}/orders`, input, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const res = await axios.get(`${API_BASE}/orders/my`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};

export const getAllOrders = async (): Promise<Order[]> => {
  const res = await axios.get(`${API_BASE}/orders`, {
    headers: getAuthHeaders(),
  });
  return res.data.data;
};
