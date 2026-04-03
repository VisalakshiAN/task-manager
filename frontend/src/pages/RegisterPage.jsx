import { useState } from 'react'
import axiosClient from '../api/axiosClient'
import { useNavigate, Link } from 'react-router-dom'

function RegisterPage() {
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async () => {
    setLoading(true)
    setError('')
    try {
      await axiosClient.post('/auth/register', { email, full_name: fullName, password })
      navigate('/')
    } catch (err) {
      setError('Registration failed. Email may already exist.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-10 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-8">Task Manager</h2>
        <h3 className="text-xl font-semibold text-gray-700 mb-6 text-center">Create Account</h3>
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition duration-200"
          onClick={handleRegister}
          disabled={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </button>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-indigo-600 font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage