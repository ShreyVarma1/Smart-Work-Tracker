import type { Task, Filters } from "../types/task";
import TaskFilters from "./TaskFilters";
import TaskRow from "./TaskRow";

type TaskListProps = {
  tasks: Task[];
  filters: Filters;
  uniqueTags: string[];
  onFiltersChange: (filters: Filters) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
};

function applyFilters(tasks: Task[], filters: Filters): Task[] {
  const global = filters.globalSearch.toLowerCase().trim();
  const titleQ = filters.taskSearch.toLowerCase().trim();
  const assigneeQ = filters.assigneeSearch.toLowerCase().trim();

  return tasks.filter((task) => {
    const matchesGlobal =
      !global ||
      [String(task.id), task.title, task.assignee, task.status, task.priority, ...task.tags]
        .some((v) => v.toLowerCase().includes(global));

    const matchesTitle = !titleQ || task.title.toLowerCase().includes(titleQ);

    const matchesAssignee =
      !assigneeQ || task.assignee.toLowerCase().includes(assigneeQ);

    const matchesStatus =
      filters.status === "All Statuses" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "All Priorities" || task.priority === filters.priority;

    const matchesTag =
      filters.tag === "All Tags" || task.tags.includes(filters.tag);

    return (
      matchesGlobal &&
      matchesTitle &&
      matchesAssignee &&
      matchesStatus &&
      matchesPriority &&
      matchesTag
    );
  });
}

function TaskList({
  tasks,
  filters,
  uniqueTags,
  onFiltersChange,
  onEdit,
  onDelete,
}: TaskListProps) {
  const filtered = applyFilters(tasks, filters);

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="section-label">TASK MANAGEMENT</p>
        <h2>Task List</h2>
      </div>

      <TaskFilters
        filters={filters}
        uniqueTags={uniqueTags}
        onChange={onFiltersChange}
      />

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Task</th>
              <th>Assignee</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>No tasks found.</td>
              </tr>
            ) : (
              filtered.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default TaskList;
