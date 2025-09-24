import React, { useState } from 'react'

export default function CommentForm({ onSubmit }) {
  const [text, setText] = useState('')
  const [author, setAuthor] = useState('')

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (!text || !text.trim()) return
        // send object with `content` (preferred) and `author`
        onSubmit({ content: text.trim(), author: author ? author.trim() : 'Anonymous' })
        setText('')
        setAuthor('')
      }}
    >
      <div className="flex gap-2">
        <input
          placeholder="Your name (optional)"
          value={author}
          onChange={e => setAuthor(e.target.value)}
          className="px-2 py-1 border rounded flex-1"
        />
        <input
          placeholder="Write a comment"
          value={text}
          onChange={e => setText(e.target.value)}
          required
          className="px-2 py-1 border rounded flex-2"
        />
        <button type="submit" className="px-3 py-1 bg-indigo-600 text-white rounded">Add</button>
      </div>
    </form>
  )
}
