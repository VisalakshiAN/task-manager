import { useNavigate } from 'react-router-dom'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/')
  }

  return (
    <div style={styles.navbar}>
      <h2 style={styles.logo}>Task Manager</h2>
      <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
    </div>
  )
}

const styles = {
  navbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 32px', background: '#4f46e5', color: 'white' },
  logo: { margin: 0, fontSize: '20px' },
  logoutBtn: { padding: '8px 16px', background: 'white', color: '#4f46e5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }
}

export default Navbar