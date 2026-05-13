
import { validateForm } from "./06-utils.js";

export default class UI {

    constructor(taskManager) {

        /*
        ==========================
        TASK MANAGER
        ==========================
        */
        this.taskManager = taskManager;

        /*
        ==========================
        FORMULAIRE
        ==========================
        */
        this.taskForm =
            document.getElementById("task-form");

        this.submitButton =
            this.taskForm.querySelector(
                "button[type='submit']"
            );

        this.cancelEditButton =
            document.getElementById(
                "cancel-edit-btn"
            );

        this.formTitle =
            document.getElementById(
                "form-title"
            );

        /*
        ==========================
        INPUTS
        ==========================
        */
        this.titleInput =
            document.getElementById("title");

        this.descriptionInput =
            document.getElementById(
                "description"
            );

        this.categoryInput =
            document.getElementById(
                "category"
            );

        this.priorityInput =
            document.getElementById(
                "priority"
            );

        this.dueDateInput =
            document.getElementById(
                "dueDate"
            );

        /*
        ==========================
        LISTE
        ==========================
        */
        this.taskList =
            document.getElementById(
                "task-list"
            );

        /*
        ==========================
        RECHERCHE
        ==========================
        */
        this.searchInput =
            document.getElementById(
                "search"
            );

        /*
        ==========================
        FILTRES
        ==========================
        */
        this.filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );

        /*
        ==========================
        STATS
        ==========================
        */
        this.totalTasks =
            document.getElementById(
                "total-tasks"
            );

        this.completedTasks =
            document.getElementById(
                "completed-tasks"
            );

        this.pendingTasks =
            document.getElementById(
                "pending-tasks"
            );

        /*
        ==========================
        ÉTAT
        ==========================
        */
        this.currentFilter = "all";

        this.editingTaskId = null;
    }

    /*
    ==========================
    INITIALISATION
    ==========================
    */
    init() {

        /*
        VALIDATION LIVE
        */
        this.taskForm.addEventListener(
            "input",
            () => this.validateTaskForm()
        );

        /*
        ANNULATION ÉDITION
        */
        this.cancelEditButton.addEventListener(
            "click",
            () => this.resetFormUI()
        );

        /*
        FORMULAIRE
        */
        this.taskForm.addEventListener(
            "submit",
            (event) =>
                this.handleAddTask(event)
        );

        /*
        EVENT DELEGATION
        */
        this.taskList.addEventListener(
            "click",
            (event) =>
                this.handleTaskClick(event)
        );

        /*
        RECHERCHE
        */
        this.searchInput.addEventListener(
            "input",
            (event) =>
                this.handleSearch(event)
        );

        /*
        FILTRES
        */
        this.filterButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        this.currentFilter =
                            button.dataset.filter;

                        this.updateActiveFilter();

                        this.renderTasks();
                    }
                );
            }
        );

        /*
        PREMIER RENDU
        */
        this.renderTasks();

        this.renderStats();
    }

    /*
    ==========================
    AJOUT / MODIFICATION
    ==========================
    */
    handleAddTask(event) {

        event.preventDefault();

        /*
        DONNÉES FORMULAIRE
        */
        const taskData = {

            title:
                this.titleInput.value,

            description:
                this.descriptionInput.value,

            category:
                this.categoryInput.value,

            priority:
                this.priorityInput.value,

            dueDate:
                this.dueDateInput.value
        };

        /*
        MODE ÉDITION
        */
        if (this.editingTaskId) {

            this.taskManager.updateTask(
                this.editingTaskId,
                taskData
            );

        } else {

            this.taskManager.addTask(
                taskData
            );
        }

        /*
        MISE À JOUR UI
        */
        this.renderTasks();

        this.renderStats();

        /*
        RESET
        */
        this.resetFormUI();
    }

    /*
    ==========================
    VALIDATION FORMULAIRE
    ==========================
    */
    validateTaskForm() {

        const formData = {

            title:
                this.titleInput.value,

            description:
                this.descriptionInput.value,

            category:
                this.categoryInput.value,

            priority:
                this.priorityInput.value,

            dueDate:
                this.dueDateInput.value
        };

        const errors =
            validateForm(formData);

        /*
        RESET ERREURS
        */
        document
            .querySelectorAll(
                ".error-message"
            )
            .forEach((error) => {

                error.textContent = "";
            });

        /*
        RESET INPUTS
        */
        const inputs = [

            this.titleInput,
            this.descriptionInput,
            this.categoryInput,
            this.priorityInput,
            this.dueDateInput
        ];

        inputs.forEach((input) => {

            input.classList.remove(
                "input-error",
                "input-success"
            );
        });

        /*
        TITLE
        */
        const titleError =
            document.getElementById(
                "title-error"
            );

        if (errors.title) {

            this.titleInput.classList.add(
                "input-error"
            );

            titleError.textContent =
                errors.title;

        } else {

            this.titleInput.classList.add(
                "input-success"
            );
        }

        /*
        DESCRIPTION
        */
        const descriptionError =
            document.getElementById(
                "description-error"
            );

        if (errors.description) {

            this.descriptionInput.classList.add(
                "input-error"
            );

            descriptionError.textContent =
                errors.description;
        }

        /*
        BOUTON
        */
        this.submitButton.disabled =
            Object.keys(errors).length > 0;
    }

    /*
    ==========================
    RESET FORM UI
    ==========================
    */
    resetFormUI() {

        /*
        RESET FORMULAIRE
        */
        this.taskForm.reset();

        /*
        RESET ERREURS
        */
        document
            .querySelectorAll(
                ".error-message"
            )
            .forEach((error) => {

                error.textContent = "";
            });

        /*
        RESET INPUTS
        */
        const inputs = [

            this.titleInput,
            this.descriptionInput,
            this.categoryInput,
            this.priorityInput,
            this.dueDateInput
        ];

        inputs.forEach((input) => {

            input.classList.remove(
                "input-error",
                "input-success"
            );
        });

        /*
        RESET UI
        */
        this.formTitle.textContent =
            "Ajouter une tâche";

        this.submitButton.textContent =
            "Ajouter";

        this.submitButton.disabled =
            false;

        /*
        REMOVE EDITING
        */
        document
            .querySelectorAll(".task")
            .forEach((task) => {

                task.classList.remove(
                    "editing"
                );
            });

        /*
        RESET MODE ÉDITION
        */
        this.editingTaskId = null;

        /*
        CACHER BOUTON ANNULATION
        */
        this.cancelEditButton.style.display =
            "none";
    }

    /*
    ==========================
    START EDIT TASK
    ==========================
    */
    startEditTask(taskId) {

        const task =
            this.taskManager.getTaskById(
                taskId
            );

        if (!task) return;

        /*
        REMOVE OLD EDITING
        */
        document
            .querySelectorAll(".task")
            .forEach((task) => {

                task.classList.remove(
                    "editing"
                );
            });

        /*
        REMPLIR FORMULAIRE
        */
        this.titleInput.value =
            task.title;

        this.descriptionInput.value =
            task.description;

        this.categoryInput.value =
            task.category;

        this.priorityInput.value =
            task.priority;

        this.dueDateInput.value =
            task.dueDate;

        /*
        AJOUT CLASSE EDITING
        */
        const taskElement =
            document.querySelector(
                `.task[data-id="${taskId}"]`
            );

        if (taskElement) {

            taskElement.classList.add(
                "editing"
            );
        }

        /*
        MODE ÉDITION
        */
        this.editingTaskId = taskId;

        /*
        UI ÉDITION
        */
        this.cancelEditButton.style.display =
            "inline-block";

        this.formTitle.textContent =
            "Modifier une tâche";

        this.submitButton.textContent =
            "Modifier";

        /*
        SCROLL
        */
        this.taskForm.scrollIntoView({

            behavior: "smooth",

            block: "start"
        });
    }

    /*
    ==========================
    CLICS TÂCHES
    ==========================
    */
    handleTaskClick(event) {

        const taskElement =
            event.target.closest(".task");

        if (!taskElement) return;

        const taskId =
            Number(taskElement.dataset.id);

        /*
        CHECKBOX
        */
        if (
            event.target.classList.contains(
                "task-checkbox"
            )
        ) {

            event.stopPropagation();

            this.taskManager.toggleTaskComplete(
                taskId
            );

            this.renderTasks();

            this.renderStats();

            return;
        }

        /*
        EDIT
        */
        if (
            event.target.classList.contains(
                "edit-btn"
            )
        ) {

            event.stopPropagation();

            this.startEditTask(taskId);

            return;
        }

        /*
        DELETE
        */
        if (
            event.target.classList.contains(
                "delete-btn"
            )
        ) {

            event.stopPropagation();

            this.taskManager.deleteTask(
                taskId
            );

            this.renderTasks();

            this.renderStats();

            return;
        }

        /*
        DESCRIPTION
        */
        taskElement.classList.toggle(
            "open"
        );
    }

    /*
    ==========================
    RECHERCHE
    ==========================
    */
    handleSearch(event) {

        const query =
            event.target.value;

        this.renderTasks(query);
    }

    /*
    ==========================
    RENDU TÂCHES
    ==========================
    */
    renderTasks(searchQuery = "") {

        let tasks =
            this.taskManager.filterTasks(
                this.currentFilter
            );

        /*
        RECHERCHE
        */
        if (searchQuery) {

            tasks = tasks.filter(
                (task) => {

                    return (
                        task.title
                            .toLowerCase()
                            .includes(
                                searchQuery.toLowerCase()
                            )
                        ||
                        task.description
                            .toLowerCase()
                            .includes(
                                searchQuery.toLowerCase()
                            )
                    );
                }
            );
        }

        /*
        RESET HTML
        */
        this.taskList.innerHTML = "";

        /*
        GÉNÉRATION HTML
        */
        tasks.forEach((task) => {

            const taskElement =
                document.createElement("li");

            taskElement.className =
                `task ${
                    task.completed
                        ? "completed"
                        : ""
                }`;

            /*
            OVERDUE
            */
            if (task.isOverdue()) {

                taskElement.classList.add(
                    "overdue"
                );
            }

            /*
            ID
            */
            taskElement.dataset.id =
                task.id;

            /*
            HTML
            */
            taskElement.innerHTML = `

                <div class="task-main">

                    <input
                        type="checkbox"
                        class="task-checkbox"
                        ${
                            task.completed
                                ? "checked"
                                : ""
                        }
                    >

                    <div class="task-content">

                        <h3 class="task-title">
                            ${task.title}
                        </h3>

                        <div class="task-meta">

                            <span class="task-category ${task.category}">
                                ${task.category}
                            </span>

                            <span class="task-priority ${task.priority}">
                                ${this.getPriorityIcon(task.priority)}
                                ${task.priority}
                            </span>

                            <span class="task-date">
                                ${
                                    task.dueDate
                                    || "Pas de date"
                                }
                            </span>

                        </div>

                    </div>

                    <div class="task-actions">

                        <button class="edit-btn">
                            ✏️
                        </button>

                        <button class="delete-btn">
                            🗑️
                        </button>

                    </div>

                </div>

                <div class="task-description">
                    ${
                        task.description
                        || "Aucune description"
                    }
                </div>
            `;

            this.taskList.appendChild(
                taskElement
            );
        });
    }

    /*
    ==========================
    STATS
    ==========================
    */
    renderStats() {

        const stats =
            this.taskManager.getStats();

        this.totalTasks.textContent =
            stats.total;

        this.completedTasks.textContent =
            stats.completed;

        this.pendingTasks.textContent =
            stats.pending;
    }

    /*
    ==========================
    FILTRE ACTIF
    ==========================
    */
    updateActiveFilter() {

        this.filterButtons.forEach(
            (button) => {

                button.classList.remove(
                    "active"
                );

                if (
                    button.dataset.filter
                    === this.currentFilter
                ) {

                    button.classList.add(
                        "active"
                    );
                }
            }
        );
    }

    /*
    ==========================
    ICÔNES PRIORITÉ
    ==========================
    */
    getPriorityIcon(priority) {

        switch (priority) {

            case "low":
                return "○";

            case "medium":
                return "▰";

            case "high":
                return "▲";

            default:
                return "";
        }
    }
}