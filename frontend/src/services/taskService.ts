import type { Task } from "../types/task";

// Read from .env — Vite exposes VITE_ prefixed vars via import.meta.env
const API_URL = import.meta.env.VITE_API_URL as string;
const API_LIMIT = import.meta.env.VITE_API_LIMIT as string;

const STATUSES: Task["status"][] = ["Todo", "In Progress", "Completed"];
const PRIORITIES: Task["priority"][] = ["High", "Medium", "Low"];
const TAG_POOL = [
  ["Frontend", "React"],
  ["Backend", "API"],
  ["Bug", "Frontend"],
  ["DevOps", "CI/CD"],
  ["Design", "UI/UX"],
];

function mapTodoToTask(todo: {
  id: number;
  title: string;
  completed: boolean;
}): Task {
  const statusIndex = todo.completed ? 2 : todo.id % 2 === 0 ? 0 : 1;
  const priorityIndex = todo.id % 3;
  const tagsIndex = todo.id % TAG_POOL.length;

  const title = todo.title.charAt(0).toUpperCase() + todo.title.slice(1);
  const assignees = ["Rahul", "Aman", "Priya", "Sara", "Dev"];
  const assignee = assignees[todo.id % assignees.length];

  return {
    id: todo.id,
    title,
    assignee,
    status: STATUSES[statusIndex],
    priority: PRIORITIES[priorityIndex],
    tags: TAG_POOL[tagsIndex],
  };
}

/* ─── localStorage helpers ──────────────────────────────────────── */

const STORAGE_KEY = "swt_tasks";

function saveToStorage(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromStorage(): Task[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : null;
}

/* ─── Public service functions ──────────────────────────────────── */

export async function getTasks(): Promise<Task[]> {
  const cached = loadFromStorage();
  if (cached) return cached;

  const response = await fetch(`${API_URL}?_limit=${API_LIMIT}`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks from API");
  }

  const todos: { id: number; title: string; completed: boolean }[] =
    await response.json();

  const tasks = todos.map(mapTodoToTask);
  saveToStorage(tasks);
  return tasks;
}

export async function createTask(task: Task): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  const cached = loadFromStorage() ?? [];
  saveToStorage([...cached, task]);
  return task;
}

export async function updateTask(task: Task): Promise<Task> {
  const safeId = task.id <= 100 ? task.id : 1;

  const response = await fetch(`${API_URL}/${safeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to update task");
  }

  const cached = loadFromStorage() ?? [];
  saveToStorage(cached.map((t) => (t.id === task.id ? task : t)));
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  const safeId = id <= 100 ? id : 1;

  const response = await fetch(`${API_URL}/${safeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  const cached = loadFromStorage() ?? [];
  saveToStorage(cached.filter((t) => t.id !== id));
}
