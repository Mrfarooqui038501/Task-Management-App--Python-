const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api';

// Get all tasks
export async function fetchTasks() {
  const r = await fetch(`${API_BASE}/tasks`);
  return r.json();
}

// Create a new task
export async function createTask(payload) {
  const r = await fetch(`${API_BASE}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

// Update an existing task
export async function updateTask(id, payload) {
  const r = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  return r.json();
}

// Delete a task 
export async function deleteTask(id) {
  const r = await fetch(`${API_BASE}/tasks/${id}`, {
    method: 'DELETE',
  });
  return r.json();
}

// Get a single task by ID
export async function getTask(id) {
  const r = await fetch(`${API_BASE}/tasks/${id}`);
  return r.json();
}