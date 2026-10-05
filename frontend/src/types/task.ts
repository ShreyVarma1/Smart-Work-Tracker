// ─── Task types ──────────────────────────────────────────────────

// Union types stay as `type` — interface cannot express unions
export type TaskStatus = "pending" | "in-progress" | "completed";
export type TaskPriority = "low" | "medium" | "high";

// Task shape matches the NestJS backend response exactly
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: string;
  tags?: string[];
  userId: string;
}

export interface TaskFormValues {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string;
  tags: string;
}

export interface Filters {
  globalSearch: string;
  taskSearch: string;
  assigneeSearch: string;
  status: string;
  priority: string;
  tag: string;
}

// Pagination state
export interface PaginationState {
  currentPage: number;
  pageSize: number;
}

// ─── Auth types ───────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

// Form values for Login
export interface LoginFormValues {
  email: string;
  password: string;
}

// Form values for Register
export interface RegisterFormValues {
  name: string;
  email: string;
  password: string;
}
