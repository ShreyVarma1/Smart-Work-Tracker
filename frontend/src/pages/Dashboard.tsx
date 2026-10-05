import { useEffect, useMemo, useState } from "react";
import StatsCard from "../components/StatsCard";
import TaskList from "../components/TaskList";
import TaskForm from "../components/TaskForm";
import type { Filters, PaginationState, Task, TaskFormValues } from "../types/task";
import { getTasks, createTask, updateTask, deleteTask } from "../services/taskService";

const INITIAL_PAGE_SIZE = Number(import.meta.env.VITE_PAGE_SIZE) || 5;

const DEFAULT_FILTERS: Filters = {
  globalSearch: "",
  taskSearch: "",
  assigneeSearch: "",
  status: "All Statuses",
  priority: "All Priorities",
  tag: "All Tags",
};

const DEFAULT_PAGINATION: PaginationState = {
  currentPage: 1,
  pageSize: INITIAL_PAGE_SIZE,
};

function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [pagination, setPagination] = useState<PaginationState>(DEFAULT_PAGINATION);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

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

  const stats = useMemo(
    () => ({
      total: tasks.length,
      pending: tasks.filter((t) => t.status === "pending").length,
      inProgress: tasks.filter((t) => t.status === "in-progress").length,
      completed: tasks.filter((t) => t.status === "completed").length,
    }),
    [tasks]
  );

  async function handleSubmit(values: TaskFormValues) {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, values);
        setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
        setEditingTask(null);
      } else {
        await createTask(values);
        // Re-fetch from backend so the list is always in sync
        const data = await getTasks();
        setTasks(data);
        // Go to last page so the newly added task is visible
        setPagination((prev) => ({ ...prev, currentPage: 99999 }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task.");
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
      if (editingTask?.id === id) setEditingTask(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task.");
    }
  }

  function handleEdit(task: Task) {
    setEditingTask(task);
    window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  return (
    <main className="container">
      {error && (
        <div className="error-banner">
          <p>{error}</p>
          <button type="button" onClick={() => setError("")}>✕</button>
        </div>
      )}

      <section className="dashboard-section">
        <div className="section-heading">
          <p className="section-label">OVERVIEW</p>
          <h2>Dashboard</h2>
        </div>
        <div className="stats-grid">
          <StatsCard label="Total Tasks" value={stats.total} />
          <StatsCard label="Pending" value={stats.pending} />
          <StatsCard label="In Progress" value={stats.inProgress} />
          <StatsCard label="Completed" value={stats.completed} />
        </div>
      </section>

      {loading ? (
        <div className="loading-state">
          <p>Loading tasks…</p>
        </div>
      ) : (
        <TaskList
          tasks={tasks}
          filters={filters}
          pagination={pagination}
          onFiltersChange={(f) => {
            setFilters(f);
            setPagination((prev) => ({ ...prev, currentPage: 1 }));
          }}
          onPaginationChange={setPagination}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TaskForm
        editingTask={editingTask}
        onSubmit={handleSubmit}
        onCancel={handleCancelEdit}
      />
    </main>
  );
}

export default Dashboard;
