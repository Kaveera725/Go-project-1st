// Food item type that matches the backend model
export interface Food {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  created_at: string;
}

// Payload for creating / updating a food item
export interface FoodInput {
  name: string;
  category: string;
  price: number;
  available: boolean;
}

export const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Drinks'] as const;
