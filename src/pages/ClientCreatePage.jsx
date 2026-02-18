import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { clientService } from '../services/clientService'

export default function ClientCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    documentType: 'CC',
    documentNumber: '',
    address: '',
    city: ''
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio'
    }

    if (!formData.documentNumber.trim()) {
      newErrors.documentNumber = 'El número de documento es obligatorio'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      await clientService.create({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        documentType: formData.documentType,
        documentNumber: formData.documentNumber.trim(),
        address: formData.address.trim(),
        city: formData.city.trim()
      })

      alert('✅ Cliente creado exitosamente')
      navigate('/clients')
    } catch (error) {
      console.error('Error creating client:', error)
      alert('❌ Error al crear cliente: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Cliente</h1>
        <p className="mt-2 text-sm text-gray-600">
          Completa los datos del nuevo cliente
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Nombre Completo */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre Completo <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
            placeholder="Ej: Juan Pérez"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
            placeholder="cliente@ejemplo.com"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        {/* Teléfono */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
            Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: +57 300 123 4567"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tipo de Documento */}
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">
              Tipo de Documento <span className="text-red-500">*</span>
            </label>
            <select
              id="documentType"
              name="documentType"
              value={formData.documentType}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="NIT">NIT</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="TI">Tarjeta de Identidad</option>
              <option value="PP">Pasaporte</option>
            </select>
          </div>

          {/* Número de Documento */}
          <div>
            <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">
              Número de Documento <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="documentNumber"
              name="documentNumber"
              value={formData.documentNumber}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.documentNumber ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
              placeholder="Ej: 123456789"
            />
            {errors.documentNumber && <p className="mt-1 text-sm text-red-600">{errors.documentNumber}</p>}
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Dirección
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Calle 123 # 45-67"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            Ciudad
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Ej: Bogotá"
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            to="/clients"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Guardando...' : '✅ Guardar Cliente'}
          </button>
        </div>
      </form>

      {/* Información de ayuda */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-md p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">Información sobre clientes</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Tipo de documento:</strong> CC para personas naturales, NIT para empresas</li>
                <li><strong>Email:</strong> Se usará para enviar notificaciones y facturas</li>
                <li><strong>Teléfono:</strong> Formato: +57 300 123 4567</li>
                <li><strong>Dirección:</strong> Necesaria para facturación electrónica</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
