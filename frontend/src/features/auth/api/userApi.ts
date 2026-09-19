import type { AuthUser } from "./authApi";

const API_URL = "http://localhost:3000/api/users";
const headers = () => ({ "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("akletlmama-token") ?? ""}` });

export type AdminUser = AuthUser & { createdAt: string };

export const getUsers = async (): Promise<AdminUser[]> => {
  const response = await fetch(API_URL, { headers: headers() });
  if (!response.ok) throw new Error("Could not load users");
  return response.json();
};

export const updateUser = async (id: string, data: Partial<Pick<AdminUser, "name" | "phone" | "role">>) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "PATCH", headers: headers(), body: JSON.stringify(data) });
  if (!response.ok) throw new Error("Could not update user");
  return response.json() as Promise<AdminUser>;
};

export const deleteUser = async (id: string) => {
  const response = await fetch(`${API_URL}/${id}`, { method: "DELETE", headers: headers() });
  if (!response.ok) throw new Error((await response.json()).message ?? "Could not delete user");
};
