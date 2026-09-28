export type TaskStatus = "Todo" | "In Progress" | "Completed";
export type TaskPriority = "High" | "Medium" | "Low";

export type Task = {
  id: number;
  title: string;
  assignee: string;
  status: TaskStatus;
  priority: TaskPriority;
  tags: string[];
};

export type TaskFormData = Omit<Task, "id"> & { id: number | "" };

export type Filters = {
  globalSearch: string;
  taskSearch: string;
  assigneeSearch: string;
  status: string;
  priority: string;
  tag: string;
};
