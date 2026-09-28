import { useEffect, useState } from "react";
import type { Task, TaskFormData, TaskPriority, TaskStatus } from "../types/task";

const EMPTY_FORM: TaskFormData = {
  id: "",
  title: "",
  assignee: "",
  status: "Todo",
  priority: "High",
  tags: [],
};

type TaskFormProps = {
  editingTask: Task | null;
  existingIds: number[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
};

function TaskForm({ editingTask, existingIds, onSubmit, onCancel }: TaskFormProps) {
  const [form, setForm] = useState<TaskFormData>(EMPTY_FORM);
  const [tagsInput, setTagsInput] = useState<string>("");
  const [error, setError] = useState<string>("");

  /* Populate form when editing */
  useEffect(() => {
    if (editingTask) {
      setForm(editingTask);
      setTagsInput(editingTask.tags.join(", "));
    } else {
      setForm(EMPTY_FORM);
      setTagsInput("");
    }
    setError("");
  }, [editingTask]);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit() {
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const id = Number(form.id);

    if (!id || !form.title.trim() || !form.assignee.trim() || tags.length === 0) {
      setError("Please fill all required fields.");
      return;
    }

    /* Duplicate ID check — only for new tasks */
    if (!editingTask && existingIds.includes(id)) {
      setError("Task ID already exists. Please use a unique ID.");
      return;
    }

    setError("");
    onSubmit({
      id,
      title: form.title.trim(),
      assignee: form.assignee.trim(),
      status: form.status as TaskStatus,
      priority: form.priority as TaskPriority,
      tags,
    });

    setForm(EMPTY_FORM);
    setTagsInput("");
  }

  const isEditing = editingTask !== null;

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="section-label">{isEditing ? "EDIT TASK" : "NEW TASK"}</p>
        <h2>{isEditing ? "Update Task" : "Add Task"}</h2>
      </div>

      {error && (
        <p style={{ color: "#dc2626", marginBottom: "16px", fontSize: "14px" }}>
          {error}
        </p>
      )}

      <div className="form-grid">
        {/* Task ID */}
        <div className="field">
          <label htmlFor="id">Task ID</label>
          <input
            id="id"
            name="id"
            type="number"
            placeholder="e.g. 104"
            value={form.id}
            onChange={handleChange}
            disabled={isEditing}
            required
          />
        </div>

        {/* Title */}
        <div className="field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="Task title"
            value={form.title}
            onChange={handleChange}
            required
          />
        </div>

        {/* Assignee */}
        <div className="field">
          <label htmlFor="assignee">Assignee</label>
          <input
            id="assignee"
            name="assignee"
            type="text"
            placeholder="Assignee name"
            value={form.assignee}
            onChange={handleChange}
            required
          />
        </div>

        {/* Status */}
        <div className="field">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option>Todo</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div className="field">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            name="priority"
            value={form.priority}
            onChange={handleChange}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>

        {/* Tags */}
        <div className="field">
          <label htmlFor="tags">Tags</label>
          <input
            id="tags"
            type="text"
            placeholder="e.g. Frontend, React"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            required
          />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="button" className="primary-button" onClick={handleSubmit}>
          {isEditing ? "Update Task" : "Add Task"}
        </button>

        {isEditing && (
          <button
            type="button"
            className="primary-button"
            style={{ background: "#64748b" }}
            onClick={onCancel}
          >
            Cancel
          </button>
        )}
      </div>
    </section>
  );
}

export default TaskForm;
