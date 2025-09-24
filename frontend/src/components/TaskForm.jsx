import React, { useState } from 'react'

export default function TaskForm({ onSubmit }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!title) return
        onSubmit({ title, description })
        setTitle('')
        setDescription('')
      }}
      className="space-y-3"
    >
      <div>
        <input
          value={title}
          placeholder="Title"
          onChange={e => setTitle(e.target.value)}
          required
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <textarea
          value={description}
          placeholder="Description"
          onChange={e => setDescription(e.target.value)}
          className="w-full px-3 py-2 border rounded"
        />
      </div>
      <div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Create
        </button>
      </div>
    </form>
  )
}
