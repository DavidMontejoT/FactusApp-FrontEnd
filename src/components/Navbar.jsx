import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const location = useLocation()

  const handleLogout = async () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      await logout()
      window.location.href = '/login'
    }
  }

  const navItems = [
    { path: '/dashboard', label: 'Inicio' },
    { path: '/invoices', label: 'Facturas' },
    { path: '/clients', label: 'Clientes' },
    { path: '/products', label: 'Productos' },
    { path: '/settings', label: 'Configuración' }
  ]

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-primary-600">FactusApp</h1>
          </div>

          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-primary-600 border-b-2 border-primary-600 pb-1'
                    : 'text-gray-600 hover:text-primary-600'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">
              {user?.name || 'Usuario'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Mobile Layout - Menú horizontal arriba */}
        <div className="md:hidden">
          {/* Logo y Usuario - Primera fila */}
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <h1 className="text-lg font-bold text-primary-600">FactusApp</h1>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-600 max-w-[100px] truncate">
                {user?.name || 'Usuario'}
              </span>
              <button
                onClick={handleLogout}
                className="px-3 py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                Salir
              </button>
            </div>
          </div>

          {/* Menú de navegación horizontal - Segunda fila */}
          <div className="flex items-center space-x-1 py-2 overflow-x-auto scrollbar-hide">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex-shrink-0 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Estilo para ocultar scrollbar en móvil */}
      <style>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  )
}
