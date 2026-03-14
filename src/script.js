// MEMO LOG Todo App - Core Logic
// Inspired by Frontend Mentor Todo App

document.addEventListener('DOMContentLoaded', initTodoApp);

function initTodoApp() {
  const themeToggle = document.getElementById('theme-toggle');
  const todoInput = document.getElementById('todo-input');
  const addBtn = document.getElementById('add-btn');
  const todosContainer = document.getElementById('todos-container');
  const filters = document.querySelectorAll('.filter-btn');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const itemsLeft = document.getElementById('items-left');

  let todos = JSON.parse(localStorage.getItem('memolog-todos')) || [];
  let currentFilter = 'all';

  // Theme toggle
  const isDark = localStorage.getItem('memolog-theme') === 'dark';
  if (isDark) {
    document.body.classList.add('dark-theme');
    themeToggle.src = 'images/icon-sun.svg';
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const isDarkTheme = document.body.classList.contains('dark-theme');
    themeToggle.src = isDarkTheme ? 'images/icon-sun.svg' : 'images/icon-moon.svg';
    localStorage.setItem('memolog-theme', isDarkTheme ? 'dark' : 'light');
  });

  // Add todo
  function addTodo(text) {
    if (text.trim() === '') return;
    const todo = {
      id: Date.now(),
      text: text.trim(),
      completed: false
    };
    todos.unshift(todo);
    renderTodos();
    todoInput.value = '';
    localStorage.setItem('memolog-todos', JSON.stringify(todos));
  }

  addBtn.addEventListener('click', () => addTodo(todoInput.value));
  todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo(todoInput.value);
  });

  // Toggle complete, delete
  function renderTodos() {
    todosContainer.innerHTML = '';
    let filteredTodos = todos;
    if (currentFilter === 'active') filteredTodos = todos.filter(t => !t.completed);
    if (currentFilter === 'completed') filteredTodos = todos.filter(t => t.completed);

    filteredTodos.forEach(todo => {
      const todoEl = document.createElement('div');
      todoEl.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      todoEl.draggable = true;
      todoEl.innerHTML = `
        <div class="todo-content">
          <input type="checkbox" ${todo.completed ? 'checked' : ''} onchange="toggleTodo(${todo.id})">
          <label>${todo.text}</label>
        </div>
        <img src="images/icon-cross.svg" alt="Delete" onclick="deleteTodo(${todo.id})" class="delete-btn">
      `;
      todosContainer.appendChild(todoEl);
    });

    itemsLeft.textContent = todos.filter(t => !t.completed).length;
  }

  window.toggleTodo = function(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      localStorage.setItem('memolog-todos', JSON.stringify(todos));
      renderTodos();
    }
  };

  window.deleteTodo = function(id) {
    todos = todos.filter(t => t.id !== id);
    localStorage.setItem('memolog-todos', JSON.stringify(todos));
    renderTodos();
  };

  // Filters
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      filters.forEach(f => f.classList.remove('active'));
      filter.classList.add('active');
      currentFilter = filter.dataset.filter;
      renderTodos();
    });
  });

  // Clear completed
  clearCompletedBtn.addEventListener('click', () => {
    todos = todos.filter(t => !t.completed);
    localStorage.setItem('memolog-todos', JSON.stringify(todos));
    renderTodos();
  });

  renderTodos();
}

