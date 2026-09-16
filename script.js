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

/* =========================
   Local Storage
========================= */

function loadTasks() {
    const savedTasks =
        localStorage.getItem("tasks");

    if (savedTasks) {
        return JSON.parse(savedTasks);
    }

    return D_tasks;
}

let tasks = loadTasks();

function saveTasks() {
    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );
}

/* =========================
   DOM Elements
========================= */

const totalTasksElement =
    document.getElementById("totalTasks");

const todoTasksElement =
    document.getElementById("todoTasks");

const inProgressTasksElement =
    document.getElementById("inProgressTasks");

const completedTasksElement =
    document.getElementById("completedTasks");


const taskTableBody =
    document.getElementById("taskTableBody");


const searchInput =
    document.getElementById("search");

const taskSearchInput =
    document.getElementById("taskSearch");

const assigneeSearchInput =
    document.getElementById("assigneeSearch");


const statusFilter =
    document.getElementById("statusFilter");

const priorityFilter =
    document.getElementById("priorityFilter");

const tagFilter =
    document.getElementById("tagFilter");


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


let editingTaskId = null;

/* =========================
   Dashboard Statistics
========================= */

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

/* =========================
   Display Tasks
========================= */

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

                        <td>
                            ${task.title}
                        </td>

                        <td>
                            ${task.assignee}
                        </td>

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
                                data-id="${task.id}"
                            >
                                Edit
                            </button>

                            <button
                                type="button"
                                class="delete-btn"
                                data-id="${task.id}"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>
                `;
            })
            .join("");
}

/* =========================
   Unique Tags
========================= */

function getUniqueTags() {

    const allTags =
        tasks.flatMap(
            task => task.tags
        );


    return [
        ...new Set(allTags)
    ];
}


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

/* =========================
   Unique Task ID
========================= */

function isTaskIdUnique(taskId) {

    const existingIds =
        new Set(
            tasks.map(
                task => task.id
            )
        );


    return !existingIds.has(taskId);
}

/* =========================
   Form Data
========================= */

function getFormData() {

    const tags =
        tagsInput.value
            .trim()
            .split(",")
            .map(tag => tag.trim())
            .filter(Boolean);


    return {

        id:
            Number(taskIdInput.value),

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

/* =========================
   Validation
========================= */

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

/* =========================
   Reset Form
========================= */

function resetForm() {

    taskForm.reset();

    taskIdInput.disabled = false;

    addTaskButton.textContent =
        "Add Task";

    editingTaskId = null;
}

/* =========================
   Add / Update Task
========================= */

function handleTaskSubmit() {

    const task =
        getFormData();


    if (!validateTask(task)) {
        return;
    }


    /* Update existing task */

    if (editingTaskId !== null) {

        const existingTask =
            tasks.find(
                task =>
                    task.id === editingTaskId
            );


        if (existingTask) {

            existingTask.title =
                task.title;

            existingTask.assignee =
                task.assignee;

            existingTask.status =
                task.status;

            existingTask.priority =
                task.priority;

            existingTask.tags =
                task.tags;
        }


        saveTasks();

        resetForm();

        refreshUI();

        alert(
            "Task updated successfully."
        );

        return;
    }


    /* Create new task */

    if (!isTaskIdUnique(task.id)) {

        alert(
            "Task ID already exists."
        );

        return;
    }


    tasks.push(task);

    saveTasks();

    resetForm();

    refreshUI();

    alert(
        "Task added successfully."
    );
}

/* =========================
   Edit Task
========================= */

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


    taskIdInput.disabled = true;

    addTaskButton.textContent =
        "Update Task";


    taskForm.scrollIntoView({
        behavior: "smooth"
    });
}

/* =========================
   Delete Task
========================= */

function deleteTask(taskId) {

    const shouldDelete =
        confirm(
            "Are you sure you want to delete this task?"
        );


    if (!shouldDelete) {
        return;
    }


    tasks =
        tasks.filter(
            task => task.id !== taskId
        );


    if (editingTaskId === taskId) {
        resetForm();
    }


    saveTasks();

    refreshUI();

    alert(
        "Task deleted successfully."
    );
}


/* =========================
   Search & Filters
========================= */

function applyFilters() {

    const globalSearch =
        searchInput.value
            .toLowerCase()
            .trim();


    const taskSearch =
        taskSearchInput.value
            .toLowerCase()
            .trim();


    const assigneeSearch =
        assigneeSearchInput.value
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

            /*
             * Global Search
             * Searches ID, title, assignee,
             * status, priority and tags.
             */

            const matchesGlobalSearch =
                !globalSearch ||
                [
                    String(task.id),
                    task.title,
                    task.assignee,
                    task.status,
                    task.priority,
                    ...task.tags
                ].some(
                    value =>
                        value
                            .toLowerCase()
                            .includes(globalSearch)
                );


            /*
             * Task Title Search
             * Searches only the title.
             */

            const matchesTask =
                !taskSearch ||
                task.title
                    .toLowerCase()
                    .includes(taskSearch);


            /*
             * Assignee Search
             * Searches only the assignee.
             */

            const matchesAssignee =
                !assigneeSearch ||
                task.assignee
                    .toLowerCase()
                    .includes(assigneeSearch);


            /*
             * Status Filter
             */

            const matchesStatus =
                selectedStatus === "All Statuses" ||
                task.status === selectedStatus;


            /*
             * Priority Filter
             */

            const matchesPriority =
                selectedPriority === "All Priorities" ||
                task.priority === selectedPriority;


            /*
             * Tag Filter
             */

            const matchesTag =
                selectedTag === "All Tags" ||
                task.tags.includes(selectedTag);


            /*
             * All active conditions
             * must be true.
             */

            return (
                matchesGlobalSearch &&
                matchesTask &&
                matchesAssignee &&
                matchesStatus &&
                matchesPriority &&
                matchesTag
            );
        });


    displayTasks(filteredTasks);
}

/* =========================
   Refresh UI
========================= */

function refreshUI() {

    displayStatistics();

    displayUniqueTags();

    applyFilters();
}

/* =========================
   Table Event Delegation
========================= */

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

/* =========================
   Add / Update Button
========================= */

addTaskButton.addEventListener(
    "click",
    handleTaskSubmit
);

/* =========================
   Search Listeners
========================= */

[
    searchInput,
    taskSearchInput,
    assigneeSearchInput
].forEach(input => {

    input.addEventListener(
        "input",
        applyFilters
    );

});

/* =========================
   Filter Listeners
========================= */

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

/* =========================
   Initial Load
========================= */

refreshUI();