import type { Task, Filters, PaginationState } from "../types/task";
import TaskFilters from "./TaskFilters";
import TaskRow from "./TaskRow";
import Pagination from "./Pagination";

// Interface for TaskList props
interface TaskListProps {
  tasks: Task[];
  filters: Filters;
  uniqueTags: string[];
  pagination: PaginationState;
  onFiltersChange: (filters: Filters) => void;
  onPaginationChange: (pagination: PaginationState) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

// Pure filter function — kept here so it's co-located with the list
function applyFilters(tasks: Task[], filters: Filters): Task[] {
  const global = filters.globalSearch.toLowerCase().trim();
  const titleQ = filters.taskSearch.toLowerCase().trim();
  const assigneeQ = filters.assigneeSearch.toLowerCase().trim();

  return tasks.filter((task) => {
    const matchesGlobal =
      !global ||
      [String(task.id), task.title, task.assignee, task.status, task.priority, ...task.tags]
        .some((v) => v.toLowerCase().includes(global));

    const matchesTitle =
      !titleQ || task.title.toLowerCase().includes(titleQ);

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
  pagination,
  onFiltersChange,
  onPaginationChange,
  onEdit,
  onDelete,
}: TaskListProps) {
  // 1. Apply all active filters
  const filtered = applyFilters(tasks, filters);

  // 2. Pagination math
  const totalPages = Math.ceil(filtered.length / pagination.pageSize);

  // 3. Slice — only the rows for the current page
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  const paginated = filtered.slice(start, start + pagination.pageSize);

  // When filters change, reset to page 1 so user isn't on a non-existent page
  function handleFiltersChange(updated: Filters) {
    onFiltersChange(updated);
    onPaginationChange({ ...pagination, currentPage: 1 });
  }

  function handlePageChange(page: number) {
    onPaginationChange({ ...pagination, currentPage: page });
  }

  function handlePageSizeChange(size: number) {
    // Reset to page 1 when page size changes
    onPaginationChange({ currentPage: 1, pageSize: size });
  }

  return (
    <section className="panel">
      <div className="section-heading">
        <p className="section-label">TASK MANAGEMENT</p>
        <h2>Task List</h2>
      </div>

      {/* Search & filter inputs */}
      <TaskFilters
        filters={filters}
        uniqueTags={uniqueTags}
        onChange={handleFiltersChange}
      />

      {/* Table */}
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
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
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

      {/* Pagination controls — only shown when there are results */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          pageSize={pagination.pageSize}
          totalItems={filtered.length}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </section>
  );
}

export default TaskList;
