import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 카테고리 API
export const getCategories = async () => {
  const response = await api.get("/menu/categories");
  return response.data;
};

// 메뉴 API
export const getAllMenuItems = async () => {
  const response = await api.get("/menu/items");
  return response.data;
};

export const getMenuItemsByCategory = async (categoryId:number) => {
  const response = await api.get(`/menu/items/category/${categoryId}`);
  return response.data;
};

export const getMenuItemById = async (id:number) => {
  const response = await api.get(`/menu/items/${id}`);
  return response.data;
};

// 주문 API
export const createOrder = async (orderData:String) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrderByNumber = async (orderNumber:number) => {
  const response = await api.get(`/orders/${orderNumber}`);
  return response.data;
};

export default api;