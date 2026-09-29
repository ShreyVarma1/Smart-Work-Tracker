import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Task, TaskFormValues, TaskPriority, TaskStatus } from "../types/task";

// ─── Yup validation schema ───────────────────────────────────────
// Yup checks each field and returns messages we display inline
const buildSchema = (existingIds: number[], isEditing: boolean) =>
  Yup.object({
    id: Yup.number()
      .typeError("Task ID must be a number")
      .required("Task ID is required")
      .positive("Task ID must be positive")
      .integer("Task ID must be a whole number")
      .test(
        "unique-id",
        "Task ID already exists",
        (value) => isEditing || !existingIds.includes(value ?? 0)
      ),
    title: Yup.string()
      .trim()
      .required("Title is required")
      .min(3, "Title must be at least 3 characters"),
    assignee: Yup.string()
      .trim()
      .required("Assignee is required")
      .min(2, "Assignee name must be at least 2 characters"),
    status: Yup.string()
      .oneOf(["Todo", "In Progress", "Completed"] as const)
      .required(),
    priority: Yup.string()
      .oneOf(["High", "Medium", "Low"] as const)
      .required(),
    tags: Yup.string()
      .trim()
      .required("At least one tag is required")
      .test(
        "has-tags",
        "Enter at least one tag",
        (value) => (value ?? "").split(",").map((t) => t.trim()).filter(Boolean).length > 0
      ),
  });

// ─── Initial empty form values ───────────────────────────────────
const EMPTY_VALUES: TaskFormValues = {
  id: "",
  title: "",
  assignee: "",
  status: "Todo",
  priority: "High",
  tags: "",
};

// ─── Props ───────────────────────────────────────────────────────
interface TaskFormProps {
  editingTask: Task | null;
  existingIds: number[];
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

function TaskForm({ editingTask, existingIds, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = editingTask !== null;

  // ── Formik setup ────────────────────────────────────────────────
  // useFormik wires up values, touched, errors, handleChange, handleBlur
  const formik = useFormik<TaskFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema: buildSchema(existingIds, isEditing),
    validateOnBlur: true,   // validate a field when user leaves it
    validateOnChange: false, // don't validate on every keystroke (less noisy)
    onSubmit: (values, { resetForm }) => {
      const tags = values.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      onSubmit({
        id: Number(values.id),
        title: values.title.trim(),
        assignee: values.assignee.trim(),
        status: values.status as TaskStatus,
        priority: values.priority as TaskPriority,
        tags,
      });

      resetForm();
    },
  });

  // ── Populate form when editing task changes ──────────────────────
  // useEffect watches editingTask; when it changes, we reset Formik
  // with the task's values so the form reflects what's being edited
  useEffect(() => {
    if (editingTask) {
      formik.resetForm({
        values: {
          id: editingTask.id,
          title: editingTask.title,
          assignee: editingTask.assignee,
          status: editingTask.status,
          priority: editingTask.priority,
          tags: editingTask.tags.join(", "),
        },
      });
    } else {
      formik.resetForm({ values: EMPTY_VALUES });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask]);

  // ── Helper: show error only after field has been touched ─────────
  const fieldError = (name: keyof TaskFormValues) =>
    formik.touched[name] && formik.errors[name] ? (
      <span className="field-error">{formik.errors[name]}</span>
    ) : null;

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="section-label">{isEditing ? "EDIT TASK" : "NEW TASK"}</p>
        <h2>{isEditing ? "Update Task" : "Add Task"}</h2>
      </div>

      {/* Formik's handleSubmit runs Yup validation then calls onSubmit */}
      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="form-grid">

          {/* Task ID */}
          <div className="field">
            <label htmlFor="id">Task ID</label>
            <input
              id="id"
              name="id"
              type="number"
              placeholder="e.g. 104"
              value={formik.values.id}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              disabled={isEditing}
            />
            {fieldError("id")}
          </div>

          {/* Title */}
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="Task title"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {fieldError("title")}
          </div>

          {/* Assignee */}
          <div className="field">
            <label htmlFor="assignee">Assignee</label>
            <input
              id="assignee"
              name="assignee"
              type="text"
              placeholder="Assignee name"
              value={formik.values.assignee}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {fieldError("assignee")}
          </div>

          {/* Status */}
          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
            {fieldError("status")}
          </div>

          {/* Priority */}
          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
            {fieldError("priority")}
          </div>

          {/* Tags */}
          <div className="field">
            <label htmlFor="tags">Tags</label>
            <input
              id="tags"
              name="tags"
              type="text"
              placeholder="e.g. Frontend, React"
              value={formik.values.tags}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {fieldError("tags")}
          </div>

        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button type="submit" className="primary-button">
            {isEditing ? "Update Task" : "Add Task"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="primary-button"
              style={{ background: "#64748b" }}
              onClick={() => {
                formik.resetForm({ values: EMPTY_VALUES });
                onCancel();
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;
