// Order types
export interface OrderItem {
  id?: string;
  order_id?: string;
  food_id: string;
  food_name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  username?: string;
  total_amount: number;
  status: string;
  created_at: string;
  items: OrderItem[];
}

export interface OrderInput {
  items: { food_id: string; quantity: number }[];
}

// Cart item for local state
export interface CartItem {
  food_id: string;
  food_name: string;
  price: number;
  quantity: number;
}
