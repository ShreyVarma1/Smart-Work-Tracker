import type { Task, TaskFormValues } from "../types/task";
import { getToken } from "./authService";

const BASE_URL = import.meta.env.VITE_API_URL as string;

function authHeaders(): HeadersInit {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? `Request failed: ${response.status}`);
  }
  return response.json();
}

function parseTagsFromString(tags?: string): string[] {
  if (!tags) return [];
  return tags.split(",").map((t) => t.trim()).filter(Boolean);
}

export async function getTasks(
  status?: string,
  priority?: string,
  search?: string
): Promise<Task[]> {
  const params = new URLSearchParams();
  if (status && status !== "All Statuses") params.set("status", status);
  if (priority && priority !== "All Priorities") params.set("priority", priority);
  if (search) params.set("search", search);

  const query = params.toString() ? `?${params.toString()}` : "";

  const response = await fetch(`${BASE_URL}/tasks${query}`, {
    headers: authHeaders(),
  });

  return handleResponse<Task[]>(response);
}

export async function getTaskById(id: string): Promise<Task> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    headers: authHeaders(),
  });

  return handleResponse<Task>(response);
}

export async function createTask(values: TaskFormValues): Promise<Task> {
  const payload = {
    ...values,
    tags: parseTagsFromString(values.tags),
  };

  const response = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<Task>(response);
}

export async function updateTask(
  id: string,
  values: Partial<TaskFormValues>
): Promise<Task> {
  const payload = {
    ...values,
    ...(values.tags !== undefined && {
      tags: parseTagsFromString(values.tags),
    }),
  };

  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  return handleResponse<Task>(response);
}

export async function deleteTask(id: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.message ?? "Failed to delete task");
  }
}
