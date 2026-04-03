import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      const res = await axiosClient.get('/tasks/')
      setTasks(res.data)
    } catch (err) {
      navigate('/')
    }
  }

  const createTask = async () => {
    if (!title) return
    setLoading(true)
    try {
      const res = await axiosClient.post('/tasks/', {
        title,
        description,
        due_date: dueDate || null
      })
      setTasks([...tasks, res.data])
      setTitle('')
      setDescription('')
      setDueDate('')
    } catch (err) {
      alert('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const deleteTask = async (id) => {
    try {
      await axiosClient.delete(`/tasks/${id}`)
      setTasks(tasks.filter(t => t.id !== id))
    } catch (err) {
      alert('Failed to delete task')
    }
  }

  const toggleStatus = async (task) => {
    const newStatus = task.status === 'todo' ? 'done' : 'todo'
    try {
      const res = await axiosClient.put(`/tasks/${task.id}`, { status: newStatus })
      setTasks(tasks.map(t => t.id === task.id ? res.data : t))
    } catch (err) {
      alert('Failed to update task')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'todo') return task.status === 'todo'
    if (filter === 'done') return task.status === 'done'
    return true
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-indigo-600 text-white px-8 py-4 flex justify-between items-center shadow">
        <h1 className="text-xl font-bold">Task Manager</h1>
        <button onClick={handleLogout} className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium hover:bg-indigo-50 transition">Logout</button>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Add New Task</h2>
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="text"
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <input
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
          <button
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition"
            onClick={createTask}
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add Task'}
          </button>
        </div>

        <div className="flex gap-3 mb-6">
          {['all', 'todo', 'done'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition ${filter === f ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600 border border-indigo-300 hover:bg-indigo-50'}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)} ({f === 'all' ? tasks.length : tasks.filter(t => t.status === f).length})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {filteredTasks.length === 0 && (
            <p className="text-center text-gray-400 mt-10">No tasks here. Add one above!</p>
          )}
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-white rounded-2xl shadow px-6 py-4 flex justify-between items-center">
              <div className="flex-1">
                <p className={`font-medium text-base ${task.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {task.title}
                </p>
                {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                {task.due_date && <p className="text-xs text-gray-400 mt-1">Due: {task.due_date}</p>}
                <span className={`text-xs px-3 py-1 rounded-full font-medium mt-2 inline-block ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-indigo-100 text-indigo-700'}`}>
                  {task.status}
                </span>
              </div>
              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => toggleStatus(task)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-2 rounded-lg transition"
                >
                  {task.status === 'todo' ? 'Mark Done' : 'Undo'}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-2 rounded-lg transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage