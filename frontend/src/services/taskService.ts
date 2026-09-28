import type { Task } from "../types/task";

const API_URL = "https://jsonplaceholder.typicode.com/todos";

const STATUSES: Task["status"][] = ["Todo", "In Progress", "Completed"];
const PRIORITIES: Task["priority"][] = ["High", "Medium", "Low"];
const TAG_POOL = [
  ["Frontend", "React"],
  ["Backend", "API"],
  ["Bug", "Frontend"],
  ["DevOps", "CI/CD"],
  ["Design", "UI/UX"],
];

/**
 * Maps a raw JSONPlaceholder todo into our Task shape.
 * We use the todo's id/title and derive status, priority, tags
 * deterministically so the seed data looks realistic.
 */
function mapTodoToTask(todo: {
  id: number;
  title: string;
  completed: boolean;
}): Task {
  const statusIndex = todo.completed ? 2 : todo.id % 2 === 0 ? 0 : 1;
  const priorityIndex = todo.id % 3;
  const tagsIndex = todo.id % TAG_POOL.length;

  // Capitalise the first letter of the title from the API
  const title =
    todo.title.charAt(0).toUpperCase() + todo.title.slice(1);

  // Assignee names cycled from a small pool
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

/* ─── Local Storage helpers ─────────────────────────────────────── */

const STORAGE_KEY = "swt_tasks";

function saveToStorage(tasks: Task[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function loadFromStorage(): Task[] | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? (JSON.parse(raw) as Task[]) : null;
}

/* ─── Public API ────────────────────────────────────────────────── */

/**
 * GET – fetch first 10 todos from JSONPlaceholder, map them to Tasks,
 * and persist to localStorage. On subsequent loads the stored data is
 * returned directly so local edits are not lost.
 */
export async function getTasks(): Promise<Task[]> {
  const cached = loadFromStorage();
  if (cached) return cached;

  const response = await fetch(`${API_URL}?_limit=10`);

  if (!response.ok) {
    throw new Error("Failed to fetch tasks from API");
  }

  const todos: { id: number; title: string; completed: boolean }[] =
    await response.json();

  const tasks = todos.map(mapTodoToTask);
  saveToStorage(tasks);
  return tasks;
}

/**
 * POST – simulate creating a task.
 * JSONPlaceholder accepts the request and returns a fake id (201).
 * We use the caller-supplied id and persist locally.
 */
export async function createTask(task: Task): Promise<Task> {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error("Failed to create task");
  }

  // JSONPlaceholder echoes back the body; we trust our local data.
  const cached = loadFromStorage() ?? [];
  const updated = [...cached, task];
  saveToStorage(updated);
  return task;
}

/**
 * PUT – simulate updating a task.
 */
export async function updateTask(task: Task): Promise<Task> {
  // JSONPlaceholder only has ids 1-100; fall back gracefully.
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
  const updated = cached.map((t) => (t.id === task.id ? task : t));
  saveToStorage(updated);
  return task;
}

/**
 * DELETE – simulate deleting a task.
 */
export async function deleteTask(id: number): Promise<void> {
  const safeId = id <= 100 ? id : 1;

  const response = await fetch(`${API_URL}/${safeId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete task");
  }

  const cached = loadFromStorage() ?? [];
  const updated = cached.filter((t) => t.id !== id);
  saveToStorage(updated);
}
