import type { Task } from "../types/task";

interface TaskRowProps {
  task: Task;
  displayNumber: number;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function TaskRow({ task, displayNumber, onEdit, onDelete }: TaskRowProps) {
  const statusClass = task.status.toLowerCase().replace(" ", "-");
  const priorityClass = task.priority.toLowerCase();

  return (
    <tr>
      <td>
        <div className="task-row">{displayNumber}</div>
      </td>
      <td>{task.title}</td>
      <td>{task.assignee || "—"}</td>
      <td>
        <span className={`status ${statusClass}`}>{task.status}</span>
      </td>
      <td>
        <span className={`priority ${priorityClass}`}>{task.priority}</span>
      </td>
      <td>
        {(task.tags ?? []).length > 0
          ? task.tags!.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))
          : "—"}
      </td>
      <td>
        <button type="button" className="edit-btn" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button type="button" className="delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
