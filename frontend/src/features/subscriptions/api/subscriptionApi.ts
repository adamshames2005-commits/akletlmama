import type { Subscription, SubscriptionSelectionInput } from "../types/subscription.types";

const API_URL = "http://localhost:3000/api/subscriptions";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("akletlmama-token") ?? ""}`,
});

const getError = async (response: Response, fallback: string) => {
  try {
    const data = await response.json() as { message?: string };
    return data.message ?? fallback;
  } catch {
    return fallback;
  }
};

export const getSubscriptionDiscount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/discount`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await getError(response, "Could not load subscription discount"));
  return (await response.json() as { discountPercentage: number }).discountPercentage;
};

export const createSubscription = async (selections: SubscriptionSelectionInput[]): Promise<Subscription> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ selections }),
  });
  if (!response.ok) throw new Error(await getError(response, "Could not create subscription"));
  return response.json();
};

export const getMySubscriptions = async (): Promise<Subscription[]> => {
  const response = await fetch(`${API_URL}/mine`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await getError(response, "Could not load subscriptions"));
  return response.json();
};

export const getAdminSubscriptionDiscount = async (): Promise<number> => {
  const response = await fetch(`${API_URL}/admin/discount`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await getError(response, "Could not load subscription discount"));
  return (await response.json() as { discountPercentage: number }).discountPercentage;
};

export const updateAdminSubscriptionDiscount = async (discountPercentage: number): Promise<number> => {
  const response = await fetch(`${API_URL}/admin/discount`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ discountPercentage }),
  });
  if (!response.ok) throw new Error(await getError(response, "Could not save subscription discount"));
  return (await response.json() as { discountPercentage: number }).discountPercentage;
};

export const getAdminSubscriptions = async (): Promise<Subscription[]> => {
  const response = await fetch(`${API_URL}/admin`, { headers: authHeaders() });
  if (!response.ok) throw new Error(await getError(response, "Could not load subscriptions"));
  return response.json();
};