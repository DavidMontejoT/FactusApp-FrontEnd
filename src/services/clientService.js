import api from '../utils/api'

export const clientService = {
  getAll: async () => {
    const response = await api.get('/clients')
    return response.data
  },

  getById: async (id) => {
    const response = await api.get(`/clients/${id}`)
    return response.data
  },

  create: async (clientData) => {
    const response = await api.post('/clients', clientData)
    return response.data
  },

  update: async (id, clientData) => {
    const response = await api.put(`/clients/${id}`, clientData)
    return response.data
  },

  delete: async (id) => {
    const response = await api.delete(`/clients/${id}`)
    return response.data
  },

  search: async (term) => {
    const response = await api.get(`/clients/search?term=${term}`)
    return response.data
  }
}
