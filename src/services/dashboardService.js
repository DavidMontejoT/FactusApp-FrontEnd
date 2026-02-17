import api from '../utils/api'

export const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  getRecentInvoices: async (limit = 5) => {
    const response = await api.get(`/dashboard/recent-invoices?limit=${limit}`)
    return response.data
  }
}
