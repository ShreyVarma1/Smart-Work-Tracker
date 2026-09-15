const D_tasks = [
    {
        id: 101,
        title: "Create Login Page",
        assignee: "Rahul",
        status: "In Progress",
        priority: "High",
        tags: ["Frontend", "React"]
    },
    {
        id: 102,
        title: "Create Payment API",
        assignee: "Aman",
        status: "Todo",
        priority: "Medium",
        tags: ["Backend", "API"]
    },
    {
        id: 103,
        title: "Fix Dashboard Bug",
        assignee: "Priya",
        status: "Completed",
        priority: "Low",
        tags: ["Bug", "Frontend"]
    }
];

// ====================================
// 2. Load tasks from localStorage
// ====================================

function loadTasks() {

    const savedTasks =
        localStorage.getItem("tasks");

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return D_tasks;
}

let tasks = loadTasks();

// ====================================
// 3. Save tasks to localStorage
// ====================================

function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

// ====================================
// 4. DOM elements
// ====================================

// Dashboard
const totalTasksElement =
    document.getElementById("totalTasks");

const todoTasksElement =
    document.getElementById("todoTasks");

const inProgressTasksElement =
    document.getElementById("inProgressTasks");

const completedTasksElement =
    document.getElementById("completedTasks");


// Table
const taskTableBody =
    document.getElementById("taskTableBody");


// Search and filters
const searchInput =
    document.getElementById("search");

const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const tagFilter =
    document.getElementById("tagFilter");


// Form
const taskForm =
    document.querySelector(".task-form");

const addTaskButton =
    document.querySelector(".primary-button");

const taskIdInput =
    document.getElementById("taskId");

const titleInput =
    document.getElementById("title");

const assigneeInput =
    document.getElementById("assignee");

const taskStatusInput =
    document.getElementById("status");

const taskPriorityInput =
    document.getElementById("priority");

const tagsInput =
    document.getElementById("tags");

// ====================================
// 5. Edit state
// ====================================

let editingTaskId = null;

// ====================================
// 6. Dashboard statistics
// ====================================

function countTasksByStatus(status) {

    return tasks.filter(
        task => task.status === status
    ).length;
}


function calculateStatistics() {

    return {
        totalTasks: tasks.length,

        todoTasks:
            countTasksByStatus("Todo"),

        inProgressTasks:
            countTasksByStatus("In Progress"),

        completedTasks:
            countTasksByStatus("Completed")
    };
}


function displayStatistics() {

    const {
        totalTasks,
        todoTasks,
        inProgressTasks,
        completedTasks
    } = calculateStatistics();


    totalTasksElement.textContent =
        totalTasks;

    todoTasksElement.textContent =
        todoTasks;

    inProgressTasksElement.textContent =
        inProgressTasks;

    completedTasksElement.textContent =
        completedTasks;
}


// ====================================
// 7. Display tasks
// ====================================

function displayTasks(taskList = tasks) {

    if (taskList.length === 0) {

        taskTableBody.innerHTML = `
            <tr>
                <td colspan="7">
                    No tasks found.
                </td>
            </tr>
        `;

        return;
    }


    taskTableBody.innerHTML =
        taskList
            .map(task => {

                const statusClass =
                    task.status
                        .toLowerCase()
                        .replace(" ", "-");

                const priorityClass =
                    task.priority.toLowerCase();


                const tagsHTML =
                    task.tags
                        .map(
                            tag =>
                                `<span class="tag">${tag}</span>`
                        )
                        .join("");


                return `
                    <tr>
                        <td>
                            <div class="task-row">
                                ${task.id}
                            </div>
                        </td>

                        <td>${task.title}</td>

                        <td>${task.assignee}</td>

                        <td>
                            <span class="status ${statusClass}">
                                ${task.status}
                            </span>
                        </td>

                        <td>
                            <span class="priority ${priorityClass}">
                                ${task.priority}
                            </span>
                        </td>

                        <td>
                            ${tagsHTML}
                        </td>

                        <td>

                            <button
                                type="button"
                                class="edit-btn"
                                data-id="${task.id}">
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${task.id}">
                                Delete
                            </button>

                        </td>

                    </tr>
                `;
            })
            .join("");
}


// ====================================
// 8. Get unique tags
// ====================================

function getUniqueTags() {

    const allTags =
        tasks.flatMap(
            task => task.tags
        );

    return [
        ...new Set(allTags)
    ];
}

// ====================================
// 9. Display unique tags
// ====================================

function displayUniqueTags() {

    const uniqueTags =
        getUniqueTags();


    tagFilter.innerHTML =
        `<option>All Tags</option>`;


    uniqueTags.forEach(tag => {

        const option =
            document.createElement("option");

        option.value = tag;

        option.textContent = tag;

        tagFilter.appendChild(option);
    });
}


// ====================================
// 10. Check unique Task ID
// ====================================

function isTaskIdUnique(taskId) {

    const existingIds =
        new Set(
            tasks.map(
                task => task.id
            )
        );

    return !existingIds.has(taskId);
}


// ====================================
// 11. Get form data
// ====================================

function getFormData() {

    const tags =
        tagsInput.value
            .trim()
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);


    return {
        id: Number(taskIdInput.value),

        title:
            titleInput.value.trim(),

        assignee:
            assigneeInput.value.trim(),

        status:
            taskStatusInput.value,

        priority:
            taskPriorityInput.value,

        tags
    };
}

// ====================================
// 12. Validate task
// ====================================

function validateTask(task) {

    if (
        !task.id ||
        !task.title ||
        !task.assignee ||
        task.tags.length === 0
    ) {

        alert(
            "Please fill all required fields."
        );

        return false;
    }


    return true;
}


// ====================================
// 13. Reset form
// ====================================

function resetForm() {

    taskForm.reset();

    taskIdInput.disabled = false;

    addTaskButton.textContent =
        "Add Task";

    editingTaskId = null;
}


// ====================================
// 14. Add / Update task
// ====================================

function handleTaskSubmit() {

    const taskData =
        getFormData();


    if (!validateTask(taskData)) {
        return;
    }


    // ====================================
    // UPDATE EXISTING TASK
    // ====================================

    if (editingTaskId !== null) {

        const task =
            tasks.find(
                task => task.id === editingTaskId
            );


        if (!task) {
            return;
        }


        task.title =
            taskData.title;

        task.assignee =
            taskData.assignee;

        task.status =
            taskData.status;

        task.priority =
            taskData.priority;

        task.tags =
            taskData.tags;


        // Save updated task
        saveTasks();


        resetForm();

        refreshUI();

        alert(
            "Task updated successfully."
        );

        return;
    }


    // ====================================
    // CREATE NEW TASK
    // ====================================

    if (!isTaskIdUnique(taskData.id)) {

        alert(
            "Task ID already exists."
        );

        return;
    }


    tasks.push(taskData);


    // Save new task
    saveTasks();


    resetForm();

    refreshUI();

    alert(
        "Task added successfully."
    );
}

// ====================================
// 15. Edit task
// ====================================

function editTask(taskId) {

    const task =
        tasks.find(
            task => task.id === taskId
        );


    if (!task) {
        return;
    }


    taskIdInput.value =
        task.id;

    titleInput.value =
        task.title;

    assigneeInput.value =
        task.assignee;

    taskStatusInput.value =
        task.status;

    taskPriorityInput.value =
        task.priority;

    tagsInput.value =
        task.tags.join(", ");


    editingTaskId =
        task.id;


    // Task ID cannot be changed
    // while editing.
    taskIdInput.disabled = true;


    addTaskButton.textContent =
        "Update Task";


    taskForm.scrollIntoView({
        behavior: "smooth"
    });
}

// ====================================
// 16. Delete task
// ====================================

function deleteTask(taskId) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!confirmed) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    // Save updated task list
    saveTasks();


    // If currently edited task
    // was deleted, reset the form.
    if (editingTaskId === taskId) {
        resetForm();
    }


    refreshUI();
}

// ====================================
// 17. Search + filters
// ====================================

function applyFilters() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const selectedPriority =
        priorityFilter.value;


    const selectedTag =
        tagFilter.value;


    const filteredTasks =
        tasks.filter(task => {

            // Search ID, title,
            // assignee and tags.
            const matchesSearch =
                String(task.id)
                    .includes(searchText) ||

                task.title
                    .toLowerCase()
                    .includes(searchText) ||

                task.assignee
                    .toLowerCase()
                    .includes(searchText) ||

                task.tags.some(
                    tag =>
                        tag
                            .toLowerCase()
                            .includes(searchText)
                );


            const matchesStatus =
                selectedStatus === "All Statuses" ||
                task.status === selectedStatus;


            const matchesPriority =
                selectedPriority === "All Priorities" ||
                task.priority === selectedPriority;


            const matchesTag =
                selectedTag === "All Tags" ||
                task.tags.includes(selectedTag);


            return (
                matchesSearch &&
                matchesStatus &&
                matchesPriority &&
                matchesTag
            );
        });


    displayTasks(filteredTasks);
}

// ====================================
// 18. Refresh UI
// ====================================

function refreshUI() {

    displayStatistics();

    displayUniqueTags();

    applyFilters();
}

// ====================================
// 19. Table button handling
// ====================================

taskTableBody.addEventListener(
    "click",
    event => {

        const button =
            event.target.closest("button");


        if (!button) {
            return;
        }


        const taskId =
            Number(button.dataset.id);


        if (
            button.classList.contains(
                "edit-btn"
            )
        ) {

            editTask(taskId);

            return;
        }


        if (
            button.classList.contains(
                "delete-btn"
            )
        ) {

            deleteTask(taskId);
        }
    }
);

// ====================================
// 20. Add / Update button
// ====================================

addTaskButton.addEventListener(
    "click",
    handleTaskSubmit
);

// ====================================
// 21. Search
// ====================================

searchInput.addEventListener(
    "input",
    applyFilters
);

// ====================================
// 22. Filters
// ====================================

statusFilter.addEventListener(
    "change",
    applyFilters
);

priorityFilter.addEventListener(
    "change",
    applyFilters
);

tagFilter.addEventListener(
    "change",
    applyFilters
);

// ====================================
// 23. Initial application load
// ====================================

refreshUI();
