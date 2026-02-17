import { useAuth } from '../context/AuthContext'

export default function SettingsPage() {
  const { user } = useAuth()

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Configuración</h1>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Información del Usuario</h2>
        </div>
        <div className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <p className="mt-1 text-sm text-gray-900">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rol</label>
            <p className="mt-1 text-sm text-gray-900">{user?.role || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Plan</label>
            <p className="mt-1 text-sm text-gray-900">{user?.plan || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Plan Actual</h2>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-gray-600">Estás en el plan <strong className="text-gray-900">{user?.plan || 'FREE'}</strong></p>
          <button className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Actualizar Plan
          </button>
        </div>
      </div>
    </div>
  )
}
