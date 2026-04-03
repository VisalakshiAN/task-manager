import { useState, useEffect } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate } from 'react-router-dom'

function DashboardPage() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchTasks()
  }, [])

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
      const res = await axiosClient.post('/tasks/', { title, description })
      setTasks([...tasks, res.data])
      setTitle('')
      setDescription('')
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

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>My Tasks</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
      </div>

      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          style={styles.input}
          type="text"
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button style={styles.addBtn} onClick={createTask} disabled={loading}>
          {loading ? 'Adding...' : 'Add Task'}
        </button>
      </div>

      <div style={styles.taskList}>
        {tasks.length === 0 && <p style={styles.empty}>No tasks yet. Add one above!</p>}
        {tasks.map(task => (
          <div key={task.id} style={styles.taskCard}>
            <div style={styles.taskInfo}>
              <p style={{
                ...styles.taskTitle,
                textDecoration: task.status === 'done' ? 'line-through' : 'none',
                color: task.status === 'done' ? '#999' : '#333'
              }}>
                {task.title}
              </p>
              {task.description && <p style={styles.taskDesc}>{task.description}</p>}
              <span style={{
                ...styles.badge,
                background: task.status === 'done' ? '#d1fae5' : '#e0e7ff',
                color: task.status === 'done' ? '#065f46' : '#3730a3'
              }}>
                {task.status}
              </span>
            </div>
            <div style={styles.taskActions}>
              <button style={styles.doneBtn} onClick={() => toggleStatus(task)}>
                {task.status === 'todo' ? 'Mark Done' : 'Undo'}
              </button>
              <button style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: { maxWidth: '700px', margin: '0 auto', padding: '32px 16px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { fontSize: '24px', color: '#333' },
  logoutBtn: { padding: '8px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' },
  form: { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', marginBottom: '24px' },
  input: { width: '100%', padding: '10px', marginBottom: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', boxSizing: 'border-box' },
  addBtn: { width: '100%', padding: '10px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' },
  taskList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  empty: { textAlign: 'center', color: '#999', marginTop: '40px' },
  taskCard: { background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' },
  taskDesc: { fontSize: '13px', color: '#666', marginBottom: '6px' },
  badge: { fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: '500' },
  taskActions: { display: 'flex', gap: '8px', marginLeft: '16px' },
  doneBtn: { padding: '6px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}

export default DashboardPage