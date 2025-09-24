import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import CommentList from './CommentList'
import EditTaskModal from './EditTaskModal'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

export default function TaskList() {
  const [tasks, setTasks] = useState([])
  const [selectedTask, setSelectedTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  async function load() {
    try {
      const r = await fetch(`${API}/tasks`)
      if (!r.ok) throw new Error('Failed to fetch tasks')
      const data = await r.json()
      setTasks(data)
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function createTask(payload) {
    await fetch(`${API}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    load()
  }

  async function deleteTask(id) {
    await fetch(`${API}/tasks/${id}`, { method: 'DELETE' })
    if (selectedTask && selectedTask.id === id) setSelectedTask(null)
    load()
  }

  async function updateTask(id, payload) {
    await fetch(`${API}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    load()
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-5">
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-2">Create Task</h2>
          <TaskForm onSubmit={createTask} />
        </div>

        <div>
          <h2 className="text-lg font-medium mb-2">All Tasks</h2>
          {tasks.length === 0 && <div className="text-gray-500">No tasks yet.</div>}
          <div className="space-y-3">
            {tasks.map(t => (
              <div key={t.id} className="p-3 bg-white rounded shadow-sm border">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm text-gray-600">{t.description}</div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedTask(t)}
                      className="px-2 py-1 text-sm bg-blue-500 text-white rounded"
                    >
                      Open
                    </button>
                    <button
                      onClick={() => { setEditingTask(t) }}
                      className="px-2 py-1 text-sm bg-yellow-100 text-yellow-700 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(t.id)}
                      className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="col-span-7">
        {selectedTask ? (
          <div className="bg-white p-4 rounded shadow-sm border">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-xl font-semibold">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600">{selectedTask.description}</p>
              </div>
              <div>
                <button onClick={() => setSelectedTask(null)} className="px-3 py-1 bg-gray-100 rounded">
                  Close
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Edit title</label>
              <input defaultValue={selectedTask.title} id="edit-title" className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Edit description</label>
              <textarea defaultValue={selectedTask.description} id="edit-desc" rows={4} className="w-full px-3 py-2 border rounded" />
            </div>
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => {
                  const title = document.getElementById('edit-title').value
                  const description = document.getElementById('edit-desc').value
                  updateTask(selectedTask.id, { title, description })
                }}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Save
              </button>
              <button onClick={() => setSelectedTask(null)} className="px-4 py-2 bg-gray-100 rounded">
                Cancel
              </button>
            </div>

            <hr className="my-4" />
            <CommentList taskId={selectedTask.id} />
          </div>
        ) : (
          <div className="text-gray-500">Select a task to view comments</div>
        )}
      </div>

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={(payload) => {
          if (!editingTask) return
          updateTask(editingTask.id, payload)
          setEditingTask(null)
        }}
      />
    </div>
  )
}
