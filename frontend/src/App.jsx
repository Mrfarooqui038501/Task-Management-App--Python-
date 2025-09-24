import React from 'react'
import TaskList from './components/TaskList'

export default function App() {
  return (
    <div className="min-h-screen p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Tasks & Comments</h1>
        <TaskList />
      </div>
    </div>
  )
}
