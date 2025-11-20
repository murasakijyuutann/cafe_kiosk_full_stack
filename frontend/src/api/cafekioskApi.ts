import axios from "axios";

const API_BASE_URL = "/api";
export interface Category {
  id: number;
  name: string;
  description: string;
  displayOrder: number;
  createdAt: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  available: boolean;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItemRequest {
  menuItemId: number;
  quantity: number;
  // size, options 등 추가 필드가 있으면 여기에
}

export interface CreateOrderRequest {
  customerName?: string | null;
  items: OrderItemRequest[];
}

export interface OrderItemResponse {
  menuItemId: number;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface OrderResponse {
  orderNumber: number;
  totalAmount: number;
  createdAt: string;
  items: OrderItemResponse[];
  customerName?: string | null;
  status: "PENDING" | "PAID" | "CANCELLED" | "FULFILLED";
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 카테고리 API
export const getCategories = async () : Promise<Category[]> => {
  const response = await api.get("/menu/categories");
  return response.data;
};

// 메뉴 API
export const getAllMenuItems = async (): Promise<MenuItem[]> => {
  const response = await api.get("/menu/items");
  return response.data;
};

export const getMenuItemsByCategory = async (categoryId:number): Promise<MenuItem[]> => {
  const response = await api.get(`/menu/items/category/${categoryId}`);
  return response.data;
};

export const getMenuItemById = async (id:number): Promise<MenuItem> => {
  const response = await api.get(`/menu/items/${id}`);
  return response.data;
};

// 주문 API
export const createOrder = async (orderData:CreateOrderRequest): Promise<OrderResponse> => {
  const { data } = await api.post<OrderResponse>("/orders", orderData);
  return data;
};

export const getOrderByNumber = async (orderNumber:number): Promise<OrderResponse> =>
     {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

export default api;