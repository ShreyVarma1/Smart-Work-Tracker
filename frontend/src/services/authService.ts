import type { User, LoginFormValues, RegisterFormValues } from "../types/task";

const BASE_URL = import.meta.env.VITE_API_URL as string;

const TOKEN_KEY = "swt_token";
const USER_KEY = "swt_user";

// ─── localStorage helpers ────────────────────────────────────────

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): User | null {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as User) : null;
}

function saveAuth(token: string, user: User): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem("swt_tasks");
}

// ─── Register ────────────────────────────────────────────────────

export async function register(values: RegisterFormValues): Promise<User> {
  const response = await fetch(`${BASE_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Registration failed");
  }

  return response.json();
}

// ─── Login ───────────────────────────────────────────────────────

export async function login(
  values: LoginFormValues
): Promise<{ user: User; token: string }> {
  const response = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Invalid email or password");
  }

  const data: { access_token: string; user: User } = await response.json();

  saveAuth(data.access_token, data.user);

  return { user: data.user, token: data.access_token };
}

// ─── Logout ──────────────────────────────────────────────────────

export function logout(): void {
  clearAuth();
}
