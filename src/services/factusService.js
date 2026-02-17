import api from '../utils/api'

/**
 * Servicio para integración con Factus API
 * Documentación: https://developers.factus.com.co/
 */

/**
 * Emitir factura a DIAN
 * @param {number} invoiceId - ID de la factura a emitir
 * @returns {Promise} Response con datos de la factura emitida
 */
export const emitInvoiceToDIAN = async (invoiceId) => {
  const response = await api.post(`/invoices/${invoiceId}/emit`)
  return response.data
}

/**
 * Sincronizar estado de factura con DIAN
 * @param {number} invoiceId - ID de la factura
 * @returns {Promise} Response con estado actualizado
 */
export const syncInvoiceStatus = async (invoiceId) => {
  const response = await api.post(`/invoices/${invoiceId}/sync-dian`)
  return response.data
}

/**
 * Descargar XML de factura emitida
 * @param {number} invoiceId - ID de la factura
 * @returns {Promise} Response con URL del XML
 */
export const downloadInvoiceXml = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}/download/xml`)
  return response.data
}

/**
 * Descargar PDF de factura emitida
 * @param {number} invoiceId - ID de la factura
 * @returns {Promise} Response con URL del PDF
 */
export const downloadInvoicePdf = async (invoiceId) => {
  const response = await api.get(`/invoices/${invoiceId}/download/pdf`)
  return response.data
}

/**
 * Enviar factura por email
 * @param {number} invoiceId - ID de la factura
 * @param {string} email - Email del destinatario
 * @returns {Promise} Response de confirmación
 */
export const sendInvoiceByEmail = async (invoiceId, email) => {
  const response = await api.post(`/invoices/${invoiceId}/send-email`, { email })
  return response.data
}

/**
 * Test de conexión con Factus API
 * @returns {Promise} Response con estado de conexión
 */
export const testFactusConnection = async () => {
  const response = await api.get('/factus/test-auth')
  return response.data
}
