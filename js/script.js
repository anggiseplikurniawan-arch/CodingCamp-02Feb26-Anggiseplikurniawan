// To-Do List Application
class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
        this.render();
    }

    cacheElements() {
        this.form = document.getElementById('todoForm');
        this.todoInput = document.getElementById('todoInput');
        this.dateInput = document.getElementById('dateInput');
        this.todoList = document.getElementById('todoList');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.inputError = document.getElementById('inputError');
        this.dateError = document.getElementById('dateError');
    }

    bindEvents() {
        this.form.addEventListener('submit', (e) => this.handleAddTodo(e));
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.handleFilter(e));
        });
    }

    validateInput() {
        let isValid = true;
        
        // Clear previous errors
        this.inputError.classList.remove('show');
        this.dateError.classList.remove('show');

        // Validate task input
        const taskValue = this.todoInput.value.trim();
        if (!taskValue) {
            this.inputError.textContent = 'Please enter a task description.';
            this.inputError.classList.add('show');
            isValid = false;
        } else if (taskValue.length < 3) {
            this.inputError.textContent = 'Task must be at least 3 characters long.';
            this.inputError.classList.add('show');
            isValid = false;
        }

        // Validate date input
        const dateValue = this.dateInput.value;
        if (!dateValue) {
            this.dateError.textContent = 'Please select a due date.';
            this.dateError.classList.add('show');
            isValid = false;
        } else {
            const selectedDate = new Date(dateValue);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (selectedDate < today) {
                this.dateError.textContent = 'Due date cannot be in the past.';
                this.dateError.classList.add('show');
                isValid = false;
            }
        }

        return isValid;
    }

    handleAddTodo(e) {
        e.preventDefault();

        if (!this.validateInput()) {
            return;
        }

        const todo = {
            id: Date.now(),
            text: this.todoInput.value.trim(),
            date: this.dateInput.value,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.render();
        this.form.reset();
    }

    handleDeleteTodo(id) {
        this.todos = this.todos.filter(todo => todo.id !== id);
        this.saveTodos();
        this.render();
    }

    handleToggleTodo(id) {
        const todo = this.todos.find(todo => todo.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    handleFilter(e) {
        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        this.currentFilter = e.target.dataset.filter;
        this.render();
    }

    getFilteredTodos() {
        switch (this.currentFilter) {
            case 'pending':
                return this.todos.filter(todo => !todo.completed);
            case 'completed':
                return this.todos.filter(todo => todo.completed);
            default:
                return this.todos;
        }
    }

    formatDate(dateString) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    }

    render() {
        const filteredTodos = this.getFilteredTodos();

        if (filteredTodos.length === 0) {
            this.todoList.innerHTML = '<p class="empty-message">No tasks to display. Add one to get started!</p>';
            return;
        }

        this.todoList.innerHTML = filteredTodos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <input 
                    type="checkbox" 
                    class="todo-checkbox" 
                    ${todo.completed ? 'checked' : ''}
                    onchange="app.handleToggleTodo(${todo.id})">
                <div class="todo-content">
                    <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                    <div class="todo-date">Due: ${this.formatDate(todo.date)}</div>
                </div>
                <button class="btn-delete" onclick="app.handleDeleteTodo(${todo.id})">Delete</button>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TodoApp();
});