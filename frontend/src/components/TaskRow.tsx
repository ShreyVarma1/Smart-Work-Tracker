import type { Task } from "../types/task";

interface TaskRowProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  const statusClass = task.status.toLowerCase().replace(" ", "-");
  const priorityClass = task.priority.toLowerCase();

  return (
    <tr>
      <td>
        <div className="task-row task-id-cell">{task.id.slice(0, 8)}…</div>
      </td>
      <td>{task.title}</td>
      <td>{task.description || "—"}</td>
      <td>
        <span className={`status ${statusClass}`}>{task.status}</span>
      </td>
      <td>
        <span className={`priority ${priorityClass}`}>{task.priority}</span>
      </td>
      <td>
        <button
          type="button"
          className="edit-btn"
          onClick={() => onEdit(task)}
        >
          Edit
        </button>
        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(task.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
