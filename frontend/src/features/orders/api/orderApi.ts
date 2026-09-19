import type { OrderItem } from "../../../App";

const API_URL = "http://localhost:3000/api/orders";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("akletlmama-token") ?? ""}`,
});

export const createOrder = async (items: OrderItem[], deliveryLocation: string, alternatePhone?: string) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      items: items.map(({ meal, size, price }) => ({ mealId: meal._id, mealName: meal.name, size, price })),
      deliveryLocation,
      alternatePhone: alternatePhone || undefined,
    }),
  });
  if (!response.ok) throw new Error((await response.json()).message ?? "Could not place order");
  return response.json();
};

export type AdminOrder = {
  _id: string;
  customerName: string;
  customerPhone: string;
  deliveryLocation: string;
  total: number;
  status: string;
  createdAt: string;
  items: { mealName: string; size: string; price: number }[];
};

export type MonthlyTotal = { _id: string; total: number; count: number };

export const getOrders = async (): Promise<AdminOrder[]> => {
  const response = await fetch(API_URL, { headers: authHeaders() });
  if (!response.ok) throw new Error("Could not load orders");
  return response.json();
};

export const getMonthlyTotals = async (): Promise<MonthlyTotal[]> => {
  const response = await fetch(`${API_URL}/monthly-totals`, { headers: authHeaders() });
  if (!response.ok) throw new Error("Could not load monthly totals");
  return response.json();
};
