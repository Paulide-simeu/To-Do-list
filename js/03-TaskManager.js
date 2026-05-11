import Task from "./02-Task.js";

export default class TaskManager {
    constructor() {
        this.tasks = [];
    }

    addTask(taskData) {
        const task = new Task(
            Date.now(),
            taskData.title,
            taskData.description,
            taskData.category,
            taskData.priority,
            taskData.dueDate
        );

        this.tasks.push(task);
        return task;
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
    }

    getTaskById(id) {
        return this.tasks.find(task => task.id === id);
    }

    toggleTaskComplete(id) {
        const task = this.getTaskById(id);
        if (task) task.toggleComplete();
    }

    updateTask(id, data) {
        const task = this.getTaskById(id);
        if (task) task.update(data);
    }

    filterTasks(filter) {
        switch (filter) {
            case "completed":
                return this.tasks.filter(t => t.completed);
            case "pending":
                return this.tasks.filter(t => !t.completed);
            case "work":
            case "personal":
            case "urgent":
                return this.tasks.filter(t => t.category === filter);
            default:
                return this.tasks;
        }
    }

    searchTasks(query) {
        return this.tasks.filter(task =>
            task.title.toLowerCase().includes(query.toLowerCase())
        );
    }

    getStats() {
        return {
            total: this.tasks.length,
            completed: this.tasks.filter(t => t.completed).length,
            pending: this.tasks.filter(t => !t.completed).length
        };
    }
}