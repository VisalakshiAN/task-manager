function TaskCard({ task, onDelete, onToggle }) {
  return (
    <div style={styles.card}>
      <div style={styles.info}>
        <p style={{
          ...styles.title,
          textDecoration: task.status === 'done' ? 'line-through' : 'none',
          color: task.status === 'done' ? '#999' : '#333'
        }}>
          {task.title}
        </p>
        {task.description && <p style={styles.desc}>{task.description}</p>}
        <span style={{
          ...styles.badge,
          background: task.status === 'done' ? '#d1fae5' : '#e0e7ff',
          color: task.status === 'done' ? '#065f46' : '#3730a3'
        }}>
          {task.status}
        </span>
      </div>
      <div style={styles.actions}>
        <button style={styles.doneBtn} onClick={() => onToggle(task)}>
          {task.status === 'todo' ? 'Mark Done' : 'Undo'}
        </button>
        <button style={styles.deleteBtn} onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  )
}

const styles = {
  card: { background: 'white', padding: '16px 20px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  info: { flex: 1 },
  title: { fontSize: '16px', fontWeight: '500', marginBottom: '4px' },
  desc: { fontSize: '13px', color: '#666', marginBottom: '6px' },
  badge: { fontSize: '12px', padding: '2px 10px', borderRadius: '20px', fontWeight: '500' },
  actions: { display: 'flex', gap: '8px', marginLeft: '16px' },
  doneBtn: { padding: '6px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' },
  deleteBtn: { padding: '6px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }
}

export default TaskCard