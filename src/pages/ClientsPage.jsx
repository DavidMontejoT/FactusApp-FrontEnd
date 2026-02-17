import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { clientService } from '../services/clientService'

export default function ClientsPage() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este cliente?')) return

    try {
      await clientService.delete(id)
      setClients(clients.filter(c => c.id !== id))
    } catch (error) {
      alert('Error al eliminar cliente')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
    </div>
  }

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <Link
          to="/clients/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          + Nuevo Cliente
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <p className="text-sm text-gray-600">{clients.length} cliente(s)</p>
        </div>
        <div className="divide-y divide-gray-200">
          {clients.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No hay clientes. Crea tu primer cliente.
            </div>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{client.name}</p>
                    <p className="text-sm text-gray-500">{client.email}</p>
                    {client.identificationNumber && (
                      <p className="text-xs text-gray-400">NIT: {client.identificationNumber}</p>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(client.id)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
