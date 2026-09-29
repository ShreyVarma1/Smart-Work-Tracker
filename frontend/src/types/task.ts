// Union types stay as `type` — interface cannot express unions
export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "High" | "Medium" | "Low";

// Object shapes become `interface` — they describe the structure of an entity
export interface Task {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
}

// Form values interface — id is "" when the field is empty, number when filled
export interface TaskFormValues {
  id: number | "";
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string; // comma-separated string in the input, split on submit
}

// Filter state interface
export interface Filters {
  globalSearch: string;
  taskSearch: string;
  assigneeSearch: string;
  status: string;
  priority: string;
  tag: string;
}

// Pagination state interface
export interface PaginationState {
  currentPage: number;
  pageSize: number;
}
