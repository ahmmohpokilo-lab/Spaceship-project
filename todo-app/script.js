/* ============================================
   TO-DO LIST APPLICATION - JAVASCRIPT
   Local Storage Persistence Implementation
   ============================================ */

// ============================================
// CONSTANTS & DOM ELEMENTS
// ============================================

const STORAGE_KEY = 'todos_app_tasks';
const MAX_TASK_LENGTH = 100;
const MAX_TASKS = 50;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const tasksList = document.getElementById('tasksList');
const emptyState = document.getElementById('emptyState');
const clearBtn = document.getElementById('clearBtn');
const filterBtns = document.querySelectorAll('.filter-btn');
const totalCountEl = document.getElementById('totalCount');
const activeCountEl = document.getElementById('activeCount');
const completedCountEl = document.getElementById('completedCount');

// ============================================
// STATE MANAGEMENT
// ============================================

let tasks = [];
let currentFilter = 'all';

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    setupEventListeners();
});

function setupEventListeners() {
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
    clearBtn.addEventListener('click', clearCompletedTasks);
    filterBtns.forEach((btn) => {
        btn.addEventListener('click', (e) => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            e.target.classList.add('active');
            currentFilter = e.target.dataset.filter;
            renderTasks();
        });
    });
}

// ============================================
// LOCAL STORAGE OPERATIONS
// ============================================

/**
 * Load tasks from local storage
 * Returns empty array if no tasks exist
 */
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        tasks = stored ? JSON.parse(stored) : [];
        
        // Validate stored data
        if (!Array.isArray(tasks)) {
            tasks = [];
            saveTasks();
        }
    } catch (error) {
        console.error('Error loading tasks:', error);
        tasks = [];
    }
}

/**
 * Save tasks to local storage
 * Handles JSON serialization and error cases
 */
function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error('Error saving tasks:', error);
        alert('Unable to save tasks. Storage may be full.');
    }
}

// ============================================
// TASK OPERATIONS
// ============================================

/**
 * Add a new task
 * Validates input, creates task object, saves to storage
 */
function addTask() {
    const text = taskInput.value.trim();

    // Validation
    if (!text) {
        alert('Please enter a task');
        taskInput.focus();
        return;
    }

    if (text.length > MAX_TASK_LENGTH) {
        alert(`Task must be less than ${MAX_TASK_LENGTH} characters`);
        return;
    }

    if (tasks.length >= MAX_TASKS) {
        alert(`Maximum ${MAX_TASKS} tasks allowed`);
        return;
    }

    // Create task object
    const task = {
        id: Date.now(),
        text: escapeHtml(text),
        completed: false,
        createdAt: formatDate(new Date()),
    };

    // Add to tasks array
    tasks.unshift(task); // Add to beginning for most recent first
    saveTasks();
    renderTasks();

    // Clear input
    taskInput.value = '';
    taskInput.focus();
}

/**
 * Toggle task completion status
 * @param {number} id - Task ID
 */
function toggleTask(id) {
    const task = tasks.find((t) => t.id === id);
    if (task) {
        task.completed = !task.completed;
        saveTasks();
        renderTasks();
    }
}

/**
 * Delete a task
 * @param {number} id - Task ID
 */
function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
}

/**
 * Clear all completed tasks
 */
function clearCompletedTasks() {
    const completedCount = tasks.filter((t) => t.completed).length;
    
    if (completedCount === 0) {
        alert('No completed tasks to clear');
        return;
    }

    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
        tasks = tasks.filter((t) => !t.completed);
        saveTasks();
        renderTasks();
    }
}

// ============================================
// RENDERING
// ============================================

/**
 * Render tasks based on current filter
 * Updates statistics and visibility
 */
function renderTasks() {
    // Filter tasks based on current filter
    const filteredTasks = getFilteredTasks();

    // Update statistics
    updateStats();

    // Clear list
    tasksList.innerHTML = '';

    // Show/hide empty state
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        tasksList.classList.remove('has-items');
    } else {
        emptyState.style.display = 'none';
        tasksList.classList.add('has-items');
    }

    // Render tasks
    filteredTasks.forEach((task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''}
                onchange="toggleTask(${task.id})"
                aria-label="Mark task as ${task.completed ? 'incomplete' : 'complete'}"
            >
            <span class="task-text">${task.text}</span>
            <button class="task-delete" onclick="deleteTask(${task.id})" aria-label="Delete task">
                Delete
            </button>
        `;

        tasksList.appendChild(li);
    });

    // Show/hide clear button
    const hasCompleted = tasks.some((t) => t.completed);
    clearBtn.style.display = hasCompleted ? 'block' : 'none';
}

/**
 * Get filtered tasks based on current filter
 * @returns {Array} Filtered tasks array
 */
function getFilteredTasks() {
    switch (currentFilter) {
        case 'active':
            return tasks.filter((t) => !t.completed);
        case 'completed':
            return tasks.filter((t) => t.completed);
        case 'all':
        default:
            return tasks;
    }
}

/**
 * Update statistics display
 */
function updateStats() {
    const total = tasks.length;
    const active = tasks.filter((t) => !t.completed).length;
    const completed = tasks.filter((t) => t.completed).length;

    totalCountEl.textContent = total;
    activeCountEl.textContent = active;
    completedCountEl.textContent = completed;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Format date for display
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const options = {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    };
    return date.toLocaleDateString('en-US', options);
}

// ============================================
// ADVANCED FEATURES (Optional)
// ============================================

/**
 * Export tasks to JSON file
 * Download tasks as a backup
 */
function exportTasks() {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
}

/**
 * Import tasks from JSON file
 * Restore tasks from a backup
 */
function importTasks(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                tasks = imported;
                saveTasks();
                renderTasks();
                alert('Tasks imported successfully!');
            } else {
                alert('Invalid file format');
            }
        } catch (error) {
            alert('Error importing tasks');
            console.error(error);
        }
    };
    reader.readAsText(file);
}

/**
 * Clear all tasks (dangerous operation)
 * Requires confirmation
 */
function clearAllTasks() {
    if (
        confirm(
            'Are you sure you want to delete ALL tasks? This cannot be undone.'
        )
    ) {
        if (
            confirm(
                'This is your last chance. Really delete everything?'
            )
        ) {
            tasks = [];
            saveTasks();
            renderTasks();
            alert('All tasks have been deleted');
        }
    }
}

/**
 * Sort tasks by completion status
 * Active tasks first, then completed
 */
function sortTasks() {
    tasks.sort((a, b) => {
        if (a.completed === b.completed) return 0;
        return a.completed ? 1 : -1;
    });
    saveTasks();
    renderTasks();
}

/**
 * Get task statistics
 * @returns {Object} Statistics object
 */
function getStatistics() {
    return {
        total: tasks.length,
        active: tasks.filter((t) => !t.completed).length,
        completed: tasks.filter((t) => t.completed).length,
        completionRate: tasks.length > 0
            ? Math.round(
                (tasks.filter((t) => t.completed).length / tasks.length) *
                    100
            )
            : 0,
    };
}

/**
 * Search tasks
 * @param {string} query - Search query
 * @returns {Array} Matching tasks
 */
function searchTasks(query) {
    return tasks.filter((t) =>
        t.text.toLowerCase().includes(query.toLowerCase())
    );
}

// ============================================
// BROWSER CONSOLE API (for developers)
// ============================================

// Make functions available in console
window.todoApp = {
    getTasks: () => tasks,
    getStats: getStatistics,
    search: searchTasks,
    export: exportTasks,
    clearAll: clearAllTasks,
    sort: sortTasks,
};

console.log(
    '%cTo-Do List App Ready! 🚀',
    'color: #667eea; font-size: 16px; font-weight: bold;'
);
console.log('Available commands: window.todoApp.*');
console.log('Try: window.todoApp.getStats()');
