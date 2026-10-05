import { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import type { Task, TaskFormValues, TaskPriority, TaskStatus } from "../types/task";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: Yup.string().optional(),
  status: Yup.string()
    .oneOf(["pending", "in-progress", "completed"] as const)
    .required(),
  priority: Yup.string()
    .oneOf(["low", "medium", "high"] as const)
    .required(),
});

const EMPTY_VALUES: TaskFormValues = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
};

interface TaskFormProps {
  editingTask: Task | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}

function TaskForm({ editingTask, onSubmit, onCancel }: TaskFormProps) {
  const isEditing = editingTask !== null;

  const formik = useFormik<TaskFormValues>({
    initialValues: EMPTY_VALUES,
    validationSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: (values, { resetForm }) => {
      onSubmit({
        title: values.title.trim(),
        description: values.description?.trim() ?? "",
        status: values.status as TaskStatus,
        priority: values.priority as TaskPriority,
      });
      resetForm();
    },
  });

  useEffect(() => {
    if (editingTask) {
      formik.resetForm({
        values: {
          title: editingTask.title,
          description: editingTask.description ?? "",
          status: editingTask.status,
          priority: editingTask.priority,
        },
      });
    } else {
      formik.resetForm({ values: EMPTY_VALUES });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingTask]);

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

      <form onSubmit={formik.handleSubmit} noValidate>
        <div className="form-grid">

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

          <div className="field">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              placeholder="Optional description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {fieldError("description")}
          </div>

          <div className="field">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formik.values.status}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {fieldError("status")}
          </div>

          <div className="field">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {fieldError("priority")}
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
              onClick={() => { formik.resetForm({ values: EMPTY_VALUES }); onCancel(); }}
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
