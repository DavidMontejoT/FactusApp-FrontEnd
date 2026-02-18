import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authService } from '../services/authService'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('test@test.com')
  const [password, setPassword] = useState('Password123!')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authService.login(email, password)
      await login(response, response.accessToken, response.refreshToken)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="text-center text-3xl font-bold text-primary-600">FactusApp</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Facturación Electrónica para Colombia
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
              placeholder="•••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={async () => {
                setError('')
                setLoading(true)
                try {
                  // Generar email único con timestamp
                  const timestamp = Date.now()
                  const response = await authService.register({
                    name: 'Usuario Demo',
                    email: `demo${timestamp}@test.com`,
                    password: 'Demo123456'
                  })
                  await login(response, response.accessToken, response.refreshToken)
                  navigate('/dashboard')
                } catch (err) {
                  setError(err.response?.data?.message || 'Error al registrar usuario')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              ¿No tienes cuenta? Crear cuenta de demo
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
