import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { productService } from '../services/productService'

export default function ProductCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sku: '',
    price: '',
    taxRate: 19,
    stock: 0,
    unit: 'UNIDAD' // UNIDAD, GRAMOS, KILOGRAMOS, LITROS, METROS, etc.
  })

  const [errors, setErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'taxRate' || name === 'stock' ? parseFloat(value) || 0 : value
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

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'El precio debe ser mayor a 0'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es obligatorio'
    }

    if (formData.taxRate < 0 || formData.taxRate > 100) {
      newErrors.taxRate = 'El impuesto debe estar entre 0 y 100'
    }

    if (formData.stock < 0) {
      newErrors.stock = 'El stock no puede ser negativo'
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
      await productService.create({
        name: formData.name.trim(),
        description: formData.description.trim(),
        sku: formData.sku.trim(),
        price: parseFloat(formData.price),
        taxRate: parseFloat(formData.taxRate),
        stock: parseInt(formData.stock),
        unit: formData.unit
      })

      alert('✅ Producto creado exitosamente')
      navigate('/products')
    } catch (error) {
      console.error('Error creating product:', error)
      alert('❌ Error al crear producto: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Producto</h1>
        <p className="mt-2 text-sm text-gray-600">
          Completa los datos del nuevo producto o servicio
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.name ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
            placeholder="Ej: Servicio de Consultoría"
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Descripción detallada del producto o servicio..."
          />
        </div>

        {/* SKU */}
        <div>
          <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
            SKU <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formData.sku}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.sku ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
            placeholder="Ej: PROD-001"
          />
          {errors.sku && <p className="mt-1 text-sm text-red-600">{errors.sku}</p>}
          <p className="mt-1 text-xs text-gray-500">Código único de identificación del producto</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Precio */}
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Precio <span className="text-red-500">*</span>
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={handleChange}
                className={`mt-1 block w-full pl-7 rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.price ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
                placeholder="0.00"
              />
            </div>
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>

          {/* Tasa de Impuesto */}
          <div>
            <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
              Impuesto (%)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                id="taxRate"
                name="taxRate"
                step="0.01"
                min="0"
                max="100"
                value={formData.taxRate}
                onChange={handleChange}
                className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.taxRate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">%</span>
              </div>
            </div>
            {errors.taxRate && <p className="mt-1 text-sm text-red-600">{errors.taxRate}</p>}
            <p className="mt-1 text-xs text-gray-500">IVA en Colombia (default: 19%)</p>
          </div>

          {/* Stock */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
              Stock Inicial
            </label>
            <input
              type="number"
              id="stock"
              name="stock"
              min="0"
              value={formData.stock}
              onChange={handleChange}
              className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm px-4 py-2 border ${errors.stock ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'}`}
            />
            {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
          </div>
        </div>

        {/* Unidad */}
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Unidad de Medida
          </label>
          <select
            id="unit"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm sm:text-sm px-4 py-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="UNIDAD">Unidad</option>
            <option value="GRAMOS">Gramos</option>
            <option value="KILOGRAMOS">Kilogramos</option>
            <option value="LITROS">Litros</option>
            <option value="MILILITROS">Mililitros</option>
            <option value="METROS">Metros</option>
            <option value="CENTIMETROS">Centímetros</option>
            <option value="HORA">Hora</option>
            <option value="DIA">Día</option>
            <option value="MES">Mes</option>
            <option value="SERVICIO">Servicio</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <Link
            to="/products"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? '⏳ Guardando...' : '✅ Guardar Producto'}
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
            <h3 className="text-sm font-medium text-blue-800">Información sobre productos</h3>
            <div className="mt-2 text-sm text-blue-700">
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>SKU:</strong> Código único que identifica el producto (ej: PROD-001)</li>
                <li><strong>Impuesto:</strong> IVA en Colombia es 19% para la mayoría de productos</li>
                <li><strong>Stock:</strong> Cantidad disponible en inventario (0 para servicios)</li>
                <li><strong>Unidad:</strong> Unidad de medida para venta y facturación</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
