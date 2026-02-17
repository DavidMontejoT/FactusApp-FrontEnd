import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { invoiceService } from '../services/invoiceService'
import {
  emitInvoiceToDIAN,
  syncInvoiceStatus,
  downloadInvoiceXml,
  downloadInvoicePdf,
  sendInvoiceByEmail
} from '../services/factusService'
import jsPDF from 'jspdf'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({}) // Track loading states per invoice

  useEffect(() => {
    fetchInvoices()
  }, [])

  const fetchInvoices = async () => {
    try {
      const data = await invoiceService.getAll()
      setInvoices(data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta factura?')) return

    try {
      await invoiceService.delete(id)
      setInvoices(invoices.filter(i => i.id !== id))
    } catch (error) {
      alert('Error al eliminar factura')
    }
  }

  const handleEmitToDIAN = async (id) => {
    setProcessing(prev => ({ ...prev, [id]: { ...prev[id], emit: true } }))
    try {
      const result = await emitInvoiceToDIAN(id)
      alert('✅ Factura emitida a DIAN exitosamente!\n\n' +
            `Número: ${result.number}\n` +
            `CUFE: ${result.cufe}\n` +
            `Estado: ${result.status}`)
      await fetchInvoices() // Refresh to show updated status
    } catch (error) {
      alert('❌ Error al emitir factura a DIAN: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(prev => ({ ...prev, [id]: { ...prev[id], emit: false } }))
    }
  }

  const handleDownloadXml = async (id) => {
    setProcessing(prev => ({ ...prev, [id]: { ...prev[id], xml: true } }))
    try {
      const result = await downloadInvoiceXml(id)

      // Obtener datos de la factura actual para personalizar el archivo
      const invoice = invoices.find(i => i.id === id)
      const invoiceNumber = invoice?.factusInvoiceNumber || invoice?.invoiceNumber || `INV-${id}`
      const clientName = invoice?.client?.name || 'Cliente Demo'
      const total = invoice?.total || 0
      const cufe = invoice?.cufe || 'CUFE_DEMO_GENERADO'

      // Generar contenido XML realista para DEMO
      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<FacturaElectronica xmlns="urn:factura:dian:gov.co">
  <Numero>${invoiceNumber}</Numero>
  <CUFE>${cufe}</CUFE>
  <FechaEmision>${new Date().toISOString().split('T')[0]}</FechaEmision>
  <HoraEmision>${new Date().toISOString().split('T')[1].split('.')[0]}</HoraEmision>
  <Emisor>
    <RazonSocial>FactusApp Demo</RazonSocial>
    <NIT>900123456</NIT>
    <Direccion>Calle Demo 123</Direccion>
  </Emisor>
  <Receptor>
    <RazonSocial>${clientName}</RazonSocial>
  </Receptor>
  <Total>${total}</Total>
  <Moneda>COP</Moneda>
  <Estado>REGISTERED</Estado>
  <Mensaje>=== MODO DEMO - SIN VALIDEZ LEGAL ===
Este archivo XML es SOLO para demostración.
En producción, este XML tendría:
- Firma digital válida del emisor
- Validación oficial de la DIAN
- Validez legal paradeclaración de impuestos
- Código QR para verificación

Para pasar a producción, necesitas:
1. Contratar plan en https://factus.com.co/
2. Configurar credenciales reales en el backend
3. Cambiar demo-mode: false en application.yml
</Mensaje>
</FacturaElectronica>`

      // Crear Blob y descargar archivo
      const blob = new Blob([xmlContent], { type: 'application/xml' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `FACTURA_${invoiceNumber}_DIAN.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      // Mostrar confirmación clara
      alert('✅ XML DESCARGADO CORRECTAMENTE\n\n' +
            `📁 Archivo: FACTURA_${invoiceNumber}_DIAN.xml\n\n` +
            '📋 El XML contiene:\n' +
            '• Número de factura\n' +
            '• CUFE (Código Único de Factura Electrónica)\n' +
            '• Datos del emisor y receptor\n' +
            '• Total e impuestos\n\n' +
            '⚠️ MODO DEMO: Este archivo NO tiene validez legal.\n' +
            '   En producción tendría firma digital de DIAN.')
    } catch (error) {
      alert('❌ Error al descargar XML: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(prev => ({ ...prev, [id]: { ...prev[id], xml: false } }))
    }
  }

  const handleDownloadPdf = async (id) => {
    setProcessing(prev => ({ ...prev, [id]: { ...prev[id], pdf: true } }))
    try {
      const result = await downloadInvoicePdf(id)

      // Obtener datos completos de la factura
      const response = await invoiceService.getById(id)
      const invoice = response

      const invoiceNumber = invoice?.factusInvoiceNumber || invoice?.invoiceNumber || `INV-${id}`
      const clientName = invoice?.client?.name || 'Cliente Demo'
      const clientNit = invoice?.client?.identificationNumber || 'N/A'
      const clientEmail = invoice?.client?.email || 'N/A'
      const clientAddress = invoice?.client?.address || 'N/A'
      const clientPhone = invoice?.client?.phone || 'N/A'
      const total = invoice?.total || 0
      const subtotal = invoice?.subtotal || total
      const tax = invoice?.tax || 0
      const cufe = invoice?.cufe || 'CUFE_DEMO_GENERADO'
      const issueDate = invoice?.issueDate ? new Date(invoice.issueDate).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO')
      const items = invoice?.items || []

      // Crear PDF con jsPDF
      const doc = new jsPDF()
      const pageWidth = doc.internal.pageSize.getWidth()
      const pageHeight = doc.internal.pageSize.getHeight()
      const margin = 20
      let yPosition = margin

      // Colores
      const primaryColor = { r: 59, g: 130, b: 246 } // Azul
      const grayColor = { r: 107, g: 114, b: 128 }

      // Header con línea decorativa
      doc.setFillColor(primaryColor.r, primaryColor.g, primaryColor.b)
      doc.rect(0, 0, pageWidth, 35, 'F')

      // Título blanco
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('FACTURA ELECTRÓNICA', pageWidth / 2, 15, { align: 'center' })
      doc.setFontSize(10)
      doc.text('DE VENTA', pageWidth / 2, 22, { align: 'center' })

      yPosition = 45

      // Número de factura y fecha
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(12)
      doc.setFont('helvetica', 'bold')
      doc.text(`Factura No: ${invoiceNumber}`, margin, yPosition)
      yPosition += 8
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      doc.text(`Fecha de emisión: ${issueDate}`, margin, yPosition)
      yPosition += 6
      doc.text(`Estado: ${invoice?.status === 'EMITTED' ? 'EMITIDA A DIAN' : invoice?.status}`, margin, yPosition)
      yPosition += 15

      // Sección Emisor
      doc.setFillColor(245, 245, 245)
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('EMISOR', margin + 2, yPosition)
      yPosition += 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text('FactusApp Demo', margin, yPosition)
      yPosition += 5
      doc.text('NIT: 900123456-1', margin, yPosition)
      yPosition += 5
      doc.text('Dirección: Calle Demo 123, Bogotá', margin, yPosition)
      yPosition += 5
      doc.text('Teléfono: +57 1 1234567', margin, yPosition)
      yPosition += 12

      // Sección Cliente
      doc.setFillColor(245, 245, 245)
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10)
      doc.text('CLIENTE', margin + 2, yPosition)
      yPosition += 8

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      doc.text(clientName, margin, yPosition)
      yPosition += 5
      doc.text(`NIT/CC: ${clientNit}`, margin, yPosition)
      yPosition += 5
      if (clientAddress !== 'N/A') {
        doc.text(`Dirección: ${clientAddress}`, margin, yPosition)
        yPosition += 5
      }
      if (clientPhone !== 'N/A') {
        doc.text(`Teléfono: ${clientPhone}`, margin, yPosition)
        yPosition += 5
      }
      doc.text(`Email: ${clientEmail}`, margin, yPosition)
      yPosition += 15

      // CUFE (acortado para visualización)
      doc.setFillColor(253, 253, 253)
      doc.setDrawColor(200, 200, 200)
      doc.roundedRect(margin, yPosition - 3, pageWidth - 2 * margin, 12, 2, 2, 'FD')
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('CUFE:', margin + 3, yPosition + 2)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(grayColor.r, grayColor.g, grayColor.b)
      const cufeShort = cufe.length > 60 ? cufe.substring(0, 60) + '...' : cufe
      doc.text(cufeShort, margin + 18, yPosition + 2)
      yPosition += 18

      // Tabla de items
      doc.setFillColor(245, 245, 245)
      doc.rect(margin, yPosition - 5, pageWidth - 2 * margin, 8, 'F')
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.text('Descripción', margin + 5, yPosition)
      doc.text('Cant.', margin + 80, yPosition)
      doc.text('Precio Unit.', margin + 100, yPosition)
      doc.text('Total', margin + 150, yPosition)
      yPosition += 10

      doc.setDrawColor(230, 230, 230)
      doc.line(margin, yPosition - 5, pageWidth - margin, yPosition - 5)

      // Items
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(60, 60, 60)

      items.forEach((item, index) => {
        if (yPosition > pageHeight - 40 && index < items.length - 1) {
          doc.addPage()
          yPosition = margin
        }

        const description = item.productName || 'Producto/Servicio'
        const quantity = item.quantity || 1
        const price = item.priceUnit || 0
        const itemTotal = quantity * price

        // Descripción (limitar longitud)
        const maxWidth = 70
        const lines = doc.splitTextToSize(description, maxWidth)
        lines.forEach((line, i) => {
          doc.text(line, margin + 5, yPosition + (i * 4))
        })

        const textHeight = lines.length * 4

        doc.text(quantity.toString(), margin + 80, yPosition)
        doc.text(`$${price.toLocaleString()}`, margin + 100, yPosition)
        doc.text(`$${itemTotal.toLocaleString()}`, margin + 150, yPosition)

        yPosition += Math.max(textHeight, 10) + 2

        // Línea separadora
        doc.setDrawColor(245, 245, 245)
        doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2)
      })

      yPosition += 5

      // Totales
      const totalBoxY = yPosition
      doc.setFillColor(253, 253, 253)
      doc.roundedRect(pageWidth - margin - 70, totalBoxY, 70, 35, 2, 2, 'FD')

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('Subtotal:', pageWidth - margin - 60, totalBoxY + 10)
      doc.text(`$${subtotal.toLocaleString()}`, pageWidth - margin - 15, totalBoxY + 10, { align: 'right' })

      doc.text('IVA (19%):', pageWidth - margin - 60, totalBoxY + 18)
      doc.text(`$${tax.toLocaleString()}`, pageWidth - margin - 15, totalBoxY + 18, { align: 'right' })

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text('TOTAL:', pageWidth - margin - 60, totalBoxY + 28)
      doc.text(`$${total.toLocaleString()}`, pageWidth - margin - 15, totalBoxY + 28, { align: 'right' })

      yPosition += 45

      // Marca de agua DEMO
      doc.setTextColor(255, 0, 0)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'bold')
      doc.text('⚠️ MODO DEMO - SIN VALIDEZ LEGAL ⚠️', pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 5
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(grayColor.r, grayColor.g, grayColor.b)
      const demoText1 = 'Este documento es SOLO para demostración y pruebas.'
      const demoText2 = 'Para producción, configura las credenciales reales de Factus API.'
      doc.text(demoText1, pageWidth / 2, yPosition, { align: 'center' })
      yPosition += 4
      doc.text(demoText2, pageWidth / 2, yPosition, { align: 'center' })

      yPosition += 10

      // Footer
      doc.setFontSize(7)
      doc.setTextColor(150, 150, 150)
      doc.text('Generado por FactusApp - Facturación Electrónica Colombia', pageWidth / 2, pageHeight - 10, { align: 'center' })
      doc.text(`Generado: ${new Date().toLocaleString('es-CO')}`, pageWidth / 2, pageHeight - 5, { align: 'center' })

      // Guardar PDF
      doc.save(`FACTURA_${invoiceNumber}_DIAN.pdf`)

      // Mostrar confirmación
      alert('✅ PDF DESCARGADO CORRECTAMENTE\n\n' +
            `📁 Archivo: FACTURA_${invoiceNumber}_DIAN.pdf\n\n` +
            '📋 El PDF incluye:\n' +
            `• Factura No: ${invoiceNumber}\n` +
            `• Cliente: ${clientName}\n` +
            `• Total: $${total.toLocaleString()}\n` +
            `• ${items.length} ítems detallados\n` +
            '• Código CUFE de DIAN\n\n' +
            '⚠️ MODO DEMO: Este archivo NO tiene validez legal.\n' +
            '   En producción tendría diseño oficial y validez de DIAN.')
    } catch (error) {
      alert('❌ Error al descargar PDF: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(prev => ({ ...prev, [id]: { ...prev[id], pdf: false } }))
    }
  }

  const handleSendEmail = async (id) => {
    const email = prompt('Ingresa el email del destinatario:')
    if (!email) return

    setProcessing(prev => ({ ...prev, [id]: { ...prev[id], email: true } }))
    try {
      await sendInvoiceByEmail(id, email)
      alert('✅ Factura enviada por email correctamente')
    } catch (error) {
      alert('❌ Error al enviar email: ' + (error.response?.data?.message || error.message))
    } finally {
      setProcessing(prev => ({ ...prev, [id]: { ...prev[id], email: false } }))
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      'DRAFT': 'bg-gray-100 text-gray-800',
      'EMITTED': 'bg-green-100 text-green-800',
      'PAID': 'bg-blue-100 text-blue-800',
      'OVERDUE': 'bg-red-100 text-red-800',
      'REGISTERED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'ACCEPTED': 'bg-blue-100 text-blue-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    }
    return styles[status] || 'bg-gray-100 text-gray-800'
  }

  const canEmit = (invoice) => {
    return invoice.status === 'DRAFT'
  }

  const canDownload = (invoice) => {
    return invoice.status === 'EMITTED' || invoice.status === 'PAID' ||
           invoice.dianStatus === 'REGISTERED' || invoice.dianStatus === 'ACCEPTED'
  }

  const handleViewInvoice = async (id) => {
    try {
      const response = await invoiceService.getById(id)
      const invoice = response

      // Crear modal o mostrar detalles
      const details = `
=== FACTURA ${invoice.invoiceNumber || invoice.factusInvoiceNumber || id} ===

Cliente: ${invoice.client?.name || 'N/A'}
Email: ${invoice.client?.email || 'N/A'}
Estado: ${invoice.status}
Total: $${invoice.total?.toLocaleString() || '0'}

${invoice.notes ? 'Notas: ' + invoice.notes : ''}

${invoice.factusInvoiceNumber ? `
EMITIDA A DIAN:
Número: ${invoice.factusInvoiceNumber}
CUFE: ${invoice.cufe || 'Pendiente'}
` : ''}

Items:
${invoice.items?.map(item => `- ${item.productName}: $${item.priceUnit?.toLocaleString()} x ${item.quantity}`).join('\n') || 'Sin items'}
      `

      alert(details)
    } catch (error) {
      alert('Error al cargar detalles de factura: ' + (error.response?.data?.message || error.message))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      {/* Banner MODO DEMO */}
      <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700 font-semibold">
              ⚠️ MODO DEMO ACTIVADO
            </p>
            <p className="text-sm text-yellow-600 mt-1">
              Las facturas emitidas NO tienen validez legal. Para producción, configura las credenciales reales de Factus API.
            </p>
          </div>
        </div>
      </div>

      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Facturas</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gestiona tus facturas y emítelas a DIAN (Plan FULL)
          </p>
        </div>
        <Link
          to="/invoices/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          + Nueva Factura
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg border border-gray-200 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones DIAN</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                  No hay facturas
                </td>
              </tr>
            ) : (
              invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {invoice.invoiceNumber || invoice.factusInvoiceNumber || `INV-${invoice.id}`}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.client?.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${invoice.total?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(invoice.status)}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {canEmit(invoice) && (
                      <button
                        onClick={() => handleEmitToDIAN(invoice.id)}
                        disabled={processing[invoice.id]?.emit}
                        className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                      >
                        {processing[invoice.id]?.emit ? '⏳ Emitiendo...' : '🚀 Emitir DIAN'}
                      </button>
                    )}
                    {canDownload(invoice) && (
                      <>
                        <button
                          onClick={() => handleDownloadXml(invoice.id)}
                          disabled={processing[invoice.id]?.xml}
                          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                        >
                          {processing[invoice.id]?.xml ? '⏳...' : '📄 XML'}
                        </button>
                        <button
                          onClick={() => handleDownloadPdf(invoice.id)}
                          disabled={processing[invoice.id]?.pdf}
                          className="px-3 py-1 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                        >
                          {processing[invoice.id]?.pdf ? '⏳...' : '📕 PDF'}
                        </button>
                        <button
                          onClick={() => handleSendEmail(invoice.id)}
                          disabled={processing[invoice.id]?.email}
                          className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-xs"
                        >
                          {processing[invoice.id]?.email ? '⏳...' : '✉️ Email'}
                        </button>
                      </>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleViewInvoice(invoice.id)}
                      className="text-primary-600 hover:text-primary-700 mr-4"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => handleDelete(invoice.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
