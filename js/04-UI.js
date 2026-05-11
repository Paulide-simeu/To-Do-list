import { validateForm } from "./06-utils.js";

export default class UI {
  constructor(taskManager) {
    // Gestionnaire de tâches
    this.taskManager = taskManager;

    // FORMULAIRE
    this.taskForm = document.getElementById("task-form");

    //bouton submit
    this.submitButton = this.taskForm.querySelector("button[type='submit']");

    //Reference
    this.cancelEditButton = document.getElementById("cancel-edit-btn");

    //Titre du formulaire
    this.formTitle = document.getElementById("form-title");

    // LISTE
    this.taskList = document.getElementById("task-list");

    // RECHERCHE
    this.searchInput = document.getElementById("search");

    // FILTRES
    this.filterButtons = document.querySelectorAll(".filter-btn");

    // STATS
    this.totalTasks = document.getElementById("total-tasks");
    this.completedTasks = document.getElementById("completed-tasks");
    this.pendingTasks = document.getElementById("pending-tasks");

    // FILTRE ACTUEL
    this.currentFilter = "all";

    // modifie
    this.editingTaskId = "null";
  }

  /*
    ==========================
    INITIALISATION
    ==========================
    */
  init() {
    /*
==========================
VALIDATION LIVE
==========================
*/
    this.taskForm.addEventListener("input", () => this.validateTaskForm());

    //Annulation édition

    this.cancelEditButton.addEventListener("click", () => this.resetFormUI());

    // Formulaire
    this.taskForm.addEventListener("submit", (event) =>
      this.handleAddTask(event),
    );

    // Event delegation sur les tâches
    this.taskList.addEventListener("click", (event) =>
      this.handleTaskClick(event),
    );

    // Recherche
    this.searchInput.addEventListener("input", (event) =>
      this.handleSearch(event),
    );

    // Filtres
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.currentFilter = button.dataset.filter;

        this.updateActiveFilter();

        this.renderTasks();
      });
    });

    // Premier rendu
    this.renderTasks();

    // Stats
    this.renderStats();
  }

  /*
    ==========================
    AJOUT TÂCHE
    ==========================
    */
  handleAddTask(event) {
    event.preventDefault();

    // Récupération données
    const taskData = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      category: document.getElementById("category").value,
      priority: document.getElementById("priority").value,
      dueDate: document.getElementById("dueDate").value,
    };

    // Ajout tâche
    /*
MODE ÉDITION
*/
    if (this.editingTaskId) {
      this.taskManager.updateTask(this.editingTaskId, taskData);

      this.editingTaskId = null;

      this.submitButton.textContent = "Ajouter";
    } else {
      this.taskManager.addTask(taskData);
    }

    document.querySelectorAll("input, textarea").forEach((input) => {
      input.classList.remove("input-success");
    });

    // Mise à jour UI
    this.renderTasks();

    this.renderStats();

    // Reset formulaire
    this.resetFormUI();
  }

  /*
==========================
VALIDATION FORMULAIRE
==========================
*/
  validateTaskForm() {
    const formData = {
      title: document.getElementById("title").value,

      description: document.getElementById("description").value,

      dueDate: document.getElementById("dueDate").value,
    };

    const errors = validateForm(formData);

    /*
    RESET
    */
    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });

    document.querySelectorAll("input, textarea").forEach((input) => {
      input.classList.remove("input-error", "input-success");
    });

    /*
    TITLE
    */
    const titleInput = document.getElementById("title");

    const titleError = document.getElementById("title-error");

    if (errors.title) {
      titleInput.classList.add("input-error");

      titleError.textContent = errors.title;
    } else {
      titleInput.classList.add("input-success");
    }

    /*
    DESCRIPTION
    */
    const descriptionInput = document.getElementById("description");

    const descriptionError = document.getElementById("description-error");

    if (errors.description) {
      descriptionInput.classList.add("input-error");

      descriptionError.textContent = errors.description;
    }

    /*
    BUTTON
    */
    this.submitButton.disabled = Object.keys(errors).length > 0;
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
    document.querySelectorAll(".error-message").forEach((error) => {
      error.textContent = "";
    });

    /*
    RESET INPUTS
    */
    document.querySelectorAll("input, textarea").forEach((input) => {
      input.classList.remove("input-error", "input-success");
    });

    // bouton change
    this.formTitle.textContent = "Ajouter une tâche";

    /*
    RESET BUTTON
    */
    this.submitButton.textContent = "Ajouter";

    this.submitButton.disabled = false;

    /*
REMOVE EDITING CLASS
*/
    document.querySelectorAll(".task").forEach((task) => {
      task.classList.remove("editing");
    });

    /*
    RESET EDIT MODE
    */
    this.editingTaskId = null;

    //Recacher boutton  au reset

    this.cancelEditButton.style.display = "none";
  }

  /*
==========================
START EDIT TASK
==========================
*/
  startEditTask(taskId) {
    const task = this.taskManager.getTaskById(taskId);

    if (!task) return;
    /*
REMOVE OLD EDITING
*/
    document.querySelectorAll(".task").forEach((task) => {
      task.classList.remove("editing");
    });

    /*
    REMPLIR FORMULAIRE
    */
    document.getElementById("title").value = task.title;

    document.getElementById("description").value = task.description;

    document.getElementById("category").value = task.category;

    document.getElementById("priority").value = task.priority;

    document.getElementById("dueDate").value = task.dueDate;

    /*
ADD EDITING CLASS
*/
    const taskElement = document.querySelector(`.task[data-id="${taskId}"]`);

    if (taskElement) {
      taskElement.classList.add("editing");
    }

    /*
    MODE ÉDITION
    */
    this.editingTaskId = taskId;

    //Afficher boutton en mode edition

    this.cancelEditButton.style.display = "inline-block";

    //bordure formulaire change

    this.formTitle.textContent = "Modifier une tâche";

    /*
    CHANGER TEXTE BOUTON
    */
    this.submitButton.textContent = "Modifier";

    /*
SCROLL FORM
*/
    this.taskForm.scrollIntoView({
      behavior: "smooth",

      block: "start",
    });
  }

  /*
    ==========================
    CLICS SUR TÂCHES
    ==========================
    */
  handleTaskClick(event) {
    // CARD
    const taskElement = event.target.closest(".task");

    if (!taskElement) return;

    // ID
    const taskId = Number(taskElement.dataset.id);

    /*
        CHECKBOX
        */
    if (event.target.classList.contains("task-checkbox")) {
      event.stopPropagation();

      this.taskManager.toggleTaskComplete(taskId);

      this.renderTasks();

      this.renderStats();

      return;
    }
    /*
EDIT
*/
    if (event.target.classList.contains("edit-btn")) {
      event.stopPropagation();

      this.startEditTask(taskId);

      return;
    }

    /*
        DELETE
        */
    if (event.target.classList.contains("delete-btn")) {
      event.stopPropagation();

      this.taskManager.deleteTask(taskId);

      this.renderTasks();

      this.renderStats();

      return;
    }

    /*
        DESCRIPTION
        */
    taskElement.classList.toggle("open");
  }

  /*
    ==========================
    RECHERCHE
    ==========================
    */
  handleSearch(event) {
    const query = event.target.value;

    this.renderTasks(query);
  }

  /*
    ==========================
    RENDU TÂCHES
    ==========================
    */
  renderTasks(searchQuery = "") {
    let tasks = this.taskManager.filterTasks(this.currentFilter);

    // Recherche
    if (searchQuery) {
      tasks = tasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    // Reset HTML
    this.taskList.innerHTML = "";

    // Génération HTML
    tasks.forEach((task) => {
      const taskElement = document.createElement("li");

      taskElement.className = `task ${task.completed ? "completed" : ""}`;

      // OVERDUE
      if (task.isOverdue()) {
        taskElement.classList.add("overdue");
      }

      // ID
      taskElement.dataset.id = task.id;

      // HTML
      taskElement.innerHTML = `
            
                <div class="task-main">

                    <input 
                        type="checkbox"
                        class="task-checkbox"
                        ${task.completed ? "checked" : ""}
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
                                ${task.dueDate || "Pas de date"}
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
                    ${task.description || "Aucune description"}
                </div>

            `;

      this.taskList.appendChild(taskElement);
    });
  }

  /*
    ==========================
    STATS
    ==========================
    */
  renderStats() {
    const stats = this.taskManager.getStats();

    this.totalTasks.textContent = stats.total;

    this.completedTasks.textContent = stats.completed;

    this.pendingTasks.textContent = stats.pending;
  }

  /*
    ==========================
    FILTRE ACTIF
    ==========================
    */
  updateActiveFilter() {
    this.filterButtons.forEach((button) => {
      button.classList.remove("active");

      if (button.dataset.filter === this.currentFilter) {
        button.classList.add("active");
      }
    });
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
