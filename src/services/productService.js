import api from '../utils/api'

export const productService = {
  getAll: async () => {
    const response = await api.get('/products')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/products/${id}`)
    return response.data
  },

  create: async (productData) => {
    const response = await api.post('/products', productData)
    return response.data
  },

  update: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/products/${id}`)
    return response.data
  },

  getLowStock: async () => {
    const response = await api.get('/products/low-stock')
    return response.data
  },

  getOutOfStock: async () => {
    const response = await api.get('/products/out-of-stock')
    return response.data
  },

  search: async (term) => {
    const response = await api.get(`/products/search?term=${term}`)
    return response.data
  }
}
