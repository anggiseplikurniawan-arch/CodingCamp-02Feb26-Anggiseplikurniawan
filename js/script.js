// Array to store todos
let todos = [];

// DOM Elements
const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const todoListBody = document.getElementById('todoListBody');
const emptyState = document.getElementById('emptyState');
const filterOption = document.getElementById('filterOption');

// Function: Add Todo
function addTodo() {
    const taskValue = taskInput.value.trim();
    const dateValue = dateInput.value;

    // Validation
    if (taskValue === '' || dateValue === '') {
        alert('Please fill in both the task name and the date!');
        return;
    }

    const newTask = {
        id: Date.now(),
        task: taskValue,
        date: dateValue,
        completed: false
    };

    todos.push(newTask);
    renderTodos();
    resetForm();
}

// Function: Reset Form
function resetForm() {
    taskInput.value = '';
    dateInput.value = '';
    taskInput.focus();
}

// Function: Delete Single Todo
function deleteTodo(id) {
    if(confirm('Are you sure you want to delete this task?')) {
        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
    }
}

// Function: Delete All
function deleteAll() {
    if (todos.length > 0 && confirm('Are you sure you want to delete ALL tasks?')) {
        todos = [];
        renderTodos();
    }
}

// Function: Toggle Status
function toggleStatus(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

// Function: Filter Todos
function filterTodos() {
    renderTodos();
}

// Function: Render List
function renderTodos() {
    todoListBody.innerHTML = ''; 
    const filterValue = filterOption.value;

    let filteredTodos = todos;

    if (filterValue === 'completed') {
        filteredTodos = todos.filter(todo => todo.completed === true);
    } else if (filterValue === 'pending') {
        filteredTodos = todos.filter(todo => todo.completed === false);
    }

    if (filteredTodos.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        
        filteredTodos.forEach(todo => {
            const row = document.createElement('tr');
            
            // Format date to English style (e.g., Feb 5, 2026)
            const dateObj = new Date(todo.date);
            const dateString = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

            row.innerHTML = `
                <td style="${todo.completed ? 'text-decoration: line-through; color: #888;' : ''}">${todo.task}</td>
                <td>${dateString}</td>
                <td>
                    <button 
                        class="status-btn ${todo.completed ? 'status-completed' : 'status-pending'}"
                        onclick="toggleStatus(${todo.id})">
                        ${todo.completed ? 'Done' : 'Pending'}
                    </button>
                </td>
                <td>
                    <button class="btn-delete" onclick="deleteTodo(${todo.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            `;
            todoListBody.appendChild(row);
        });
    }
}

// Enter key listener
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        addTodo();
    }
});

// Initial Render
renderTodos();