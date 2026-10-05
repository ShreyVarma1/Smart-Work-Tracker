import type { Filters } from "../types/task";

interface TaskFiltersProps {
  filters: Filters;
  onChange: (updated: Filters) => void;
}

function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  function handle(field: keyof Filters, value: string) {
    onChange({ ...filters, [field]: value });
  }

  return (
    <div className="filters">
      <div className="field search-field">
        <label htmlFor="search">Global Search</label>
        <input
          id="search"
          type="text"
          placeholder="Search anything..."
          value={filters.globalSearch}
          onChange={(e) => handle("globalSearch", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="taskSearch">Task Title</label>
        <input
          id="taskSearch"
          type="text"
          placeholder="Search task title..."
          value={filters.taskSearch}
          onChange={(e) => handle("taskSearch", e.target.value)}
        />
      </div>

      <div className="field">
        <label htmlFor="statusFilter">Status</label>
        <select
          id="statusFilter"
          value={filters.status}
          onChange={(e) => handle("status", e.target.value)}
        >
          <option>All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="priorityFilter">Priority</label>
        <select
          id="priorityFilter"
          value={filters.priority}
          onChange={(e) => handle("priority", e.target.value)}
        >
          <option>All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
    </div>
  );
}

export default TaskFilters;
