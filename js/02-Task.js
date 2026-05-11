export default class Task {
    constructor(id, title, description, category, priority, dueDate) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;   // work | personal | urgent
        this.priority = priority;   // low | medium | high
        this.dueDate = dueDate;
        this.createdAt = new Date();
        this.completed = false;
    }

    toggleComplete() {
        this.completed = !this.completed;
    }

    isOverdue() {
        if (!this.dueDate) return false;
        return new Date(this.dueDate) < new Date();
    }

    update(data) {
        Object.assign(this, data);
    }
}