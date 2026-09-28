import type { Task } from "../types/task";

type TaskRowProps = {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

function TaskRow({ task, onEdit, onDelete }: TaskRowProps) {
  const statusClass = task.status.toLowerCase().replace(" ", "-");
  const priorityClass = task.priority.toLowerCase();

  return (
    <tr>
      <td>
        <div className="task-row">{task.id}</div>
      </td>
      <td>{task.title}</td>
      <td>{task.assignee}</td>
      <td>
        <span className={`status ${statusClass}`}>{task.status}</span>
      </td>
      <td>
        <span className={`priority ${priorityClass}`}>{task.priority}</span>
      </td>
      <td>
        {task.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
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
