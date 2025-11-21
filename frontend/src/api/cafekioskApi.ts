import axios from "axios";

// Base URL uses Vite proxy configuration
const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for session-based cart
});

// Menu interfaces
export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
    description: string;
  };
  imageUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
}

// Cart interfaces
export interface CartItem {
  menuItemId: number;
  menuItemName: string;
  price: number;
  quantity: number;
  subtotal: number;
}

// Order interfaces
export interface OrderRequest {
  customerName: string | null;
  items: CartItem[];
}

export interface OrderResponse {
  orderNumber: string;
  customerName: string;
  status: string;
}

// ===== MENU API =====

// FIXED: Backend uses /menu not /menu/items
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get("/menu");
  return response.data;
};

// FIXED: Backend uses /menu?categoryId= not /menu/items/category/{id}
export const getMenuItemsByCategory = async (categoryId: number): Promise<MenuItem[]> => {
  const response = await api.get(`/menu?categoryId=${categoryId}`);
  return response.data;
};

export const getMenuItemById = async (id: number): Promise<MenuItem> => {
  const response = await api.get(`/menu/${id}`);
  return response.data;
};

// ===== CATEGORY API =====

// FIXED: Backend uses /categories not /menu/categories
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await api.get("/categories");
  return response.data;
};

// ===== CART API (Session-based) =====

export const getCart = async (): Promise<CartItem[]> => {
  const response = await api.get("/cart");
  return response.data;
};

export const addToCart = async (menuItemId: number, quantity: number): Promise<void> => {
  await api.post("/cart/add", null, {
    params: { menuItemId, quantity }
  });
};

export const clearCart = async (): Promise<void> => {
  await api.post("/cart/clear");
};

// ===== ORDER API =====

// FIXED: Backend uses /order/checkout not /orders
export const createOrder = async (orderRequest: OrderRequest): Promise<OrderResponse> => {
  // Note: Backend expects cart to be in session, but we'll send items anyway
  // You may need to modify backend to accept this, or switch to session-based cart
  const response = await api.post("/order/checkout", orderRequest);
  return response.data;
};

export const getOrderByNumber = async (orderNumber: string): Promise<OrderResponse> => {
  const response = await api.get(`/order/${orderNumber}`);
  return response.data;
};

export default api;