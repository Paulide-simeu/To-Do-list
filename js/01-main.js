import TaskManager from "./03-TaskManager.js";

import UI from "./04-UI.js";

import { saveTasks, loadTasks }
from "./05-Storage.js";

import { setMinDate }
from "./06-utils.js";

/*
==========================
TASK MANAGER
==========================
*/
const taskManager = new TaskManager();

/*
==========================
CHARGEMENT LOCALSTORAGE
==========================
*/
const savedTasks = loadTasks();

/*
==========================
RESTAURATION DES TÂCHES
==========================
*/
taskManager.tasks = savedTasks.map(task => {

    return {
        ...task,

        isOverdue() {

            if (!this.dueDate) return false;

            return new Date(this.dueDate)
                < new Date();
        },

        toggleComplete() {
            this.completed = !this.completed;
        },

        update(data) {
            Object.assign(this, data);
        }
    };

});

/*
==========================
UI
==========================
*/
const ui = new UI(taskManager);

/*
==========================
INITIALISATION
==========================
*/
ui.init();
/*
*/
setMinDate();
/*
==========================
AUTO SAVE
==========================
*/
const originalRenderTasks =
    ui.renderTasks.bind(ui);

ui.renderTasks = function (...args) {

    originalRenderTasks(...args);

    saveTasks(taskManager.tasks);
};