import { useEffect, useMemo, useState } from "react";
import StatsCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import type { Filters, Task } from "../types/task";
import {
  createTask,
  deleteTask,
  getTasks,
  updateTask,
} from "../services/taskService";

const DEFAULT_FILTERS: Filters = {
  globalSearch: "",
  taskSearch: "",
  assigneeSearch: "",
  status: "All Statuses",
  priority: "All Priorities",
  tag: "All Tags",
};

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  /* ── Initial load ─────────────────────────────────────────── */
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch {
        setError("Failed to load tasks. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  /* ── Derived stats ────────────────────────────────────────── */
  const stats = useMemo(
    () => ({
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "Todo").length,
      inProgress: tasks.filter((t) => t.status === "In Progress").length,
      completed: tasks.filter((t) => t.status === "Completed").length,
    }),
    [tasks]
  );

  /* ── Unique tags for filter dropdown ─────────────────────── */
  const uniqueTags = useMemo(
    () => [...new Set(tasks.flatMap((t) => t.tags))],
    [tasks]
  );

  const existingIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

  /* ── CRUD handlers ────────────────────────────────────────── */
  async function handleSubmit(task: Task) {
    try {
      if (editingTask) {
        const updated = await updateTask(task);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        const created = await createTask(task);
        setTasks((prev) => [...prev, created]);
      }
    } catch {
      setError("Failed to save task. Please try again.");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));

      if (editingTask?.id === id) setEditingTask(null);
    } catch {
      setError("Failed to delete task. Please try again.");
    }
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <main className="container">
      {/* Error banner */}
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>
            ✕
          </button>
        </div>
      )}

      {/* Stats */}
      <section className="dashboard-section">
        <div className="section-heading">
          <p className="section-label">OVERVIEW</p>
          <h2>Dashboard</h2>
        </div>

        <div className="stats-grid">
          <StatsCard label="Total Tasks" value={stats.total} />
          <StatsCard label="Todo" value={stats.todo} />
          <StatsCard label="In Progress" value={stats.inProgress} />
          <StatsCard label="Completed" value={stats.completed} />
        </div>
      </section>

      {/* Task list */}
      {loading ? (
        <div className="loading-state">
          <p>Loading tasks…</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          filters={filters}
          uniqueTags={uniqueTags}
          onFiltersChange={setFilters}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Add / Edit form */}
      <TaskForm
        editingTask={editingTask}
        existingIds={existingIds}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />
    </main>
  );
}

export default Dashboard;
