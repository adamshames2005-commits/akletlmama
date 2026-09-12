const API_URL = "http://localhost:3000/api/auth";

export type AuthUser = {
  id: string;
  name: string;
  phone: string;
  role: "customer" | "admin";
};

type AuthResponse = {
  token: string;
  user: AuthUser;
};

const requestAuth = async (path: string, body: Record<string, string>) => {
  const response = await fetch(`${API_URL}/${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const responseText = await response.text();
  let data: { message?: string } & Partial<AuthResponse> = {};
  if (responseText) {
    try {
      data = JSON.parse(responseText) as { message?: string } & Partial<AuthResponse>;
    } catch {
      data = { message: responseText };
    }
  }
  if (!response.ok) throw new Error(data.message ?? "Authentication failed");
  return data as AuthResponse;
};

export const signUp = (name: string, phone: string, password: string) =>
  requestAuth("signup", { name, phone, password });

export const login = (phone: string, password: string) =>
  requestAuth("login", { phone, password });
