import type { Task, Filters, PaginationState } from "../types/task";
import TaskFilters from "./TaskFilters";
import TaskRow from "./TaskRow";
import Pagination from "./Pagination";

interface TaskListProps {
  tasks: Task[];
  filters: Filters;
  pagination: PaginationState;
  onFiltersChange: (filters: Filters) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

function applyFilters(tasks: Task[], filters: Filters): Task[] {
  const global = filters.globalSearch.toLowerCase().trim();
  const titleQ = filters.taskSearch.toLowerCase().trim();

  return tasks.filter((task) => {
    const matchesGlobal =
      !global ||
      [task.id, task.title, task.description ?? "", task.status, task.priority]
        .some((v) => v.toLowerCase().includes(global));

    const matchesTitle =
      !titleQ || task.title.toLowerCase().includes(titleQ);

    const matchesStatus =
      filters.status === "All Statuses" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "All Priorities" || task.priority === filters.priority;

    return matchesGlobal && matchesTitle && matchesStatus && matchesPriority;
  });
}

function TaskList({
  tasks,
  filters,
  pagination,
  onFiltersChange,
  onPaginationChange,
  onEdit,
  onDelete,
}: TaskListProps) {
  const filtered = applyFilters(tasks, filters);
  const totalPages = Math.ceil(filtered.length / pagination.pageSize);
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const paginated = filtered.slice(start, start + pagination.pageSize);

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="section-label">TASK MANAGEMENT</p>
        <h2>Task List</h2>
      </div>

      <TaskFilters filters={filters} onChange={onFiltersChange} />

      <div className="task-table-wrapper">
        <table className="task-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Description</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", color: "#94a3b8" }}>
                  No tasks found.
                </td>
              </tr>
            ) : (
              paginated.map((task) => (
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

      {filtered.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          pageSize={pagination.pageSize}
          totalItems={filtered.length}
          onPageChange={(page) =>
            onPaginationChange({ ...pagination, currentPage: page })
          }
          onPageSizeChange={(size) =>
            onPaginationChange({ currentPage: 1, pageSize: size })
          }
        />
      )}
    </section>
  );
}

export default TaskList;
