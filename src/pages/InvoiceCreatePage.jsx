import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { invoiceService } from '../services/invoiceService'
import { clientService } from '../services/clientService'
import { productService } from '../services/productService'

export default function InvoiceCreatePage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState([])
  const [products, setProducts] = useState([])

  const [formData, setFormData] = useState({
    clientId: '',
    paymentMethod: 'CASH',
    notes: '',
    items: [{ productId: '', productName: '', quantity: 1, priceUnit: 0 }]
  })

  useEffect(() => {
    fetchClients()
    fetchProducts()
  }, [])

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const data = await productService.getAll()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { productId: '', productName: '', quantity: 1, priceUnit: 0 }]
    })
  }

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index)
      setFormData({ ...formData, items: newItems })
    }
  }

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items]

    if (field === 'productId') {
      const product = products.find(p => p.id === parseInt(value))
      if (product) {
        newItems[index].productId = product.id
        newItems[index].productName = product.name
        newItems[index].priceUnit = product.price
      }
    } else {
      newItems[index][field] = value
    }

    setFormData({ ...formData, items: newItems })
  }

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => {
      return sum + (item.quantity * item.priceUnit)
    }, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.clientId) {
      alert('Por favor selecciona un cliente')
      return
    }

    const hasEmptyItems = formData.items.some(item => !item.productName)
    if (hasEmptyItems) {
      alert('Por favor completa todos los items')
      return
    }

    setLoading(true)
    try {
      await invoiceService.create({
        clientId: parseInt(formData.clientId),
        paymentMethod: formData.paymentMethod,
        notes: formData.notes,
        items: formData.items.map(item => ({
          productId: item.productId ? parseInt(item.productId) : null,
          productName: item.productName,
          quantity: parseInt(item.quantity),
          priceUnit: parseFloat(item.priceUnit)
        }))
      })

      alert('✅ Factura creada exitosamente!')
      navigate('/invoices')
    } catch (error) {
      alert('❌ Error al crear factura: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Crear Nueva Factura</h1>
        <p className="mt-2 text-sm text-gray-600">
          Completa el formulario para crear una nueva factura
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg border border-gray-200 p-6">
        {/* Cliente */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            value={formData.clientId}
            onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            required
          >
            <option value="">Seleccionar cliente...</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
          {clients.length === 0 && (
            <p className="mt-2 text-sm text-orange-600">
              ⚠️ No tienes clientes. Ve a la sección "Clientes" para crear uno primero.
            </p>
          )}
        </div>

        {/* Items */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Items de la Factura *
            </label>
            <button
              type="button"
              onClick={addItem}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm"
            >
              + Agregar Item
            </button>
          </div>

          {formData.items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Producto */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Producto
                  </label>
                  <select
                    value={item.productId}
                    onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                  >
                    <option value="">Seleccionar producto...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ${product.price?.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cantidad */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                {/* Precio Unitario */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio Unitario
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.priceUnit}
                    onChange={(e) => handleItemChange(index, 'priceUnit', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    required
                  />
                </div>

                {/* Eliminar */}
                <div className="flex items-end">
                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Eliminar
                    </button>
                  )}
                </div>
              </div>

              {/* Subtotal del item */}
              <div className="mt-2 text-right text-sm text-gray-600">
                Subtotal: ${((item.quantity || 0) * (item.priceUnit || 0)).toLocaleString()}
              </div>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="mb-6 bg-gray-50 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total:</span>
            <span className="text-2xl font-bold text-primary-600">
              ${calculateTotal().toLocaleString()}
            </span>
          </div>
        </div>

        {/* Método de Pago */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Método de Pago
          </label>
          <select
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="CASH">Efectivo</option>
            <option value="TRANSFER">Transferencia Bancaria</option>
            <option value="CARD">Tarjeta</option>
            <option value="NEQUI">Nequi</option>
            <option value="DAVIPLATA">Daviplata</option>
          </select>
        </div>

        {/* Notas */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            placeholder="Observaciones adicionales..."
          />
        </div>

        {/* Botones */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/invoices')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading || clients.length === 0}
            className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? 'Guardando...' : 'Crear Factura'}
          </button>
        </div>
      </form>
    </div>
  )
}
