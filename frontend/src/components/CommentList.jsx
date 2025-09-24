import React, { useEffect, useState } from 'react'
import CommentForm from './CommentForm'

const API = import.meta.env.VITE_API_URL || 'http://127.0.0.1:5000/api'

export default function CommentList({ taskId }) {
  const [comments, setComments] = useState([])

  async function load() {
    if (!taskId) return
    try {
      const r = await fetch(`${API}/tasks/${taskId}/comments`)
      if (!r.ok) {
        console.error('Failed to fetch comments', await r.text())
        throw new Error('Failed to fetch comments')
      }
      const data = await r.json()
      setComments(Array.isArray(data) ? data : [])
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    if (taskId) load()
    
  }, [taskId])

  async function createComment(payload) {
    try {
      const res = await fetch(`${API}/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) // payload must be { content, author }
      })
      if (!res.ok) {
        const err = await res.json().catch(()=>({ error: 'unknown' }))
        console.error('Create comment failed', err)
        return
      }
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  async function deleteComment(id) {
    try {
      const res = await fetch(`${API}/comments/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        console.error('Delete failed', await res.text())
        return
      }
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  async function updateComment(id, payload) {
    
    try {
      const res = await fetch(`${API}/comments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) {
        console.error('Update failed', await res.text())
        return
      }
      await load()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div>
      <h4 className="text-lg font-medium mb-2">Comments</h4>

      <CommentForm onSubmit={createComment} />

      {comments.length === 0 && <div className="text-gray-500 mt-2">No comments yet.</div>}

      <div className="space-y-3 mt-3">
        {comments.map(c => (
          <div key={c.id} className="p-3 bg-gray-50 rounded border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                <strong>{c.author || 'Anonymous'}</strong>
                <span className="text-xs text-gray-400"> — {c.created_at ? new Date(c.created_at).toLocaleString() : '—'}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                   
                    const currentText = c.content ?? c.text ?? ''
                    const newText = prompt('Edit comment', currentText)
                    if (newText !== null) updateComment(c.id, { content: newText })
                  }}
                  className="text-sm text-blue-600"
                >
                  Edit
                </button>
                <button onClick={() => deleteComment(c.id)} className="text-sm text-red-600">Delete</button>
              </div>
            </div>
            <div className="mt-2 text-gray-800">{c.content ?? c.text ?? ''}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
