import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { dashboardService } from '../services/dashboardService'

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsData, invoicesData] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentInvoices(5)
      ])
      setStats(statsData)
      setInvoices(invoicesData)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Datos de ejemplo para gráficos (en producción vienen del backend)
  const monthlyRevenue = [
    { month: 'Ene', ingresos: 4500000 },
    { month: 'Feb', ingresos: 5200000 },
    { month: 'Mar', ingresos: 4800000 },
    { month: 'Abr', ingresos: 6100000 },
    { month: 'May', ingresos: 5900000 },
    { month: 'Jun', ingresos: 7200000 },
  ]

  const invoiceStatusData = [
    { name: 'Pagadas', value: 65, color: '#10B981' },
    { name: 'Pendientes', value: 25, color: '#F59E0B' },
    { name: 'Vencidas', value: 10, color: '#EF4444' },
  ]

  const salesTrend = [
    { week: 'Sem 1', ventas: 12 },
    { week: 'Sem 2', ventas: 19 },
    { week: 'Sem 3', ventas: 15 },
    { week: 'Sem 4', ventas: 22 },
    { week: 'Sem 5', ventas: 18 },
    { week: 'Sem 6', ventas: 25 },
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'invoice_paid',
      title: 'Factura INV-007 pagada',
      client: 'Empresa ABC S.A.S.',
      amount: 500000,
      time: 'Hace 5 min',
      icon: '✓',
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 2,
      type: 'new_client',
      title: 'Nuevo cliente registrado',
      client: 'Tech Solutions Ltd',
      time: 'Hace 1 hora',
      icon: '👤',
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 3,
      type: 'invoice_overdue',
      title: 'Factura por vencer',
      client: 'Comercializadora XYZ',
      amount: 750000,
      dueDate: 'Mañana',
      time: 'Hace 3 horas',
      icon: '⚠',
      bgColor: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      id: 4,
      type: 'product_low_stock',
      title: 'Stock bajo',
      product: 'Servicio de Consultoría',
      stock: 3,
      time: 'Hace 5 horas',
      icon: '📦',
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600'
    },
  ]

  const formatCurrency = (value) => {
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`
    }
    return `$${(value / 1000).toFixed(0)}K`
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
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600">
            Bienvenido de nuevo, {stats?.userName || 'Usuario'}
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/invoices/new"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <span className="mr-2">+</span>
            Nueva Factura
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Ventas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Ventas Totales</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                ${stats?.totalSales?.toLocaleString() || '0'}
              </p>
              <p className="mt-2 text-sm text-green-600 font-medium">
                ↑ {stats?.salesChange || 12}% vs mes anterior
              </p>
            </div>
            <div className="ml-4 p-3 bg-blue-100 rounded-xl">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Facturas Pendientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Facturas Pendientes</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.pendingInvoices || 0}
              </p>
              <p className="mt-2 text-sm text-yellow-600 font-medium">
                ${stats?.pendingAmount?.toLocaleString() || '0'} por cobrar
              </p>
            </div>
            <div className="ml-4 p-3 bg-yellow-100 rounded-xl">
              <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Clientes Activos */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.activeClients || 0}
              </p>
              <p className="mt-2 text-sm text-green-600 font-medium">
                +{stats?.newClientsThisMonth || 0} nuevos este mes
              </p>
            </div>
            <div className="ml-4 p-3 bg-green-100 rounded-xl">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Productos en Stock */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Productos</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">
                {stats?.productCount || 0}
              </p>
              <p className="mt-2 text-sm text-gray-600 font-medium">
                {stats?.lowStockProducts || 0} con stock bajo
              </p>
            </div>
            <div className="ml-4 p-3 bg-purple-100 rounded-xl">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Gráficos y Listas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gráfico de Barras - Ingresos Mensuales */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Ingresos Mensuales</h2>
              <p className="text-sm text-gray-600">Últimos 6 meses</p>
            </div>
            <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              2024
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" verticalFill={false} stroke="#f0f0f0" />
              <XAxis
                dataKey="month"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                formatter={(value) => `$${value.toLocaleString()}`}
                labelStyle={{ color: '#6B7280' }}
              />
              <Bar
                dataKey="ingresos"
                fill="#2563EB"
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico Circular - Estado de Facturas */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Estado de Facturas</h2>
            <p className="text-sm text-gray-600">Distribución por estado</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={invoiceStatusData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
                fontSize={11}
              >
                {invoiceStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value}%`}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-2">
            {invoiceStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Línea y Actividades Recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de Línea - Tendencia de Ventas */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Tendencia de Ventas</h2>
            <p className="text-sm text-gray-600">Facturas emitidas por semana</p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis
                dataKey="week"
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => `${value} facturas`}
                labelStyle={{ color: '#6B7280' }}
              />
              <Line
                type="monotone"
                dataKey="ventas"
                stroke="#2563EB"
                strokeWidth={3}
                dot={{ fill: '#2563EB', r: 5 }}
                activeDot={{ r: 7, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Actividades Recientes */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Actividades Recientes</h2>
            <p className="text-sm text-gray-600">Últimas acciones</p>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className={`flex-shrink-0 w-10 h-10 ${activity.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                  <span className={activity.iconColor}>{activity.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {activity.title}
                  </p>
                  {activity.client && (
                    <p className="text-xs text-gray-600 truncate">{activity.client}</p>
                  )}
                  {activity.amount && (
                    <p className="text-xs font-semibold text-gray-900">
                      ${activity.amount.toLocaleString()}
                    </p>
                  )}
                  {activity.product && (
                    <p className="text-xs text-gray-600 truncate">{activity.product}</p>
                  )}
                  {activity.stock && (
                    <p className="text-xs text-red-600 font-medium">
                      Stock: {activity.stock} unidades
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Facturas Recientes */}
      <div className="mt-8 bg-white shadow rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Facturas Recientes</h2>
          <Link
            to="/invoices"
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Ver todas →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Número
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No hay facturas aún
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {invoice.client?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {invoice.invoiceNumber || invoice.factusInvoiceNumber || `INV-${invoice.id}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(invoice.issueDate || invoice.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        ${invoice.total?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        invoice.status === 'PAID' || invoice.status === 'EMITTED'
                          ? 'bg-green-100 text-green-800'
                          : invoice.status === 'OVERDUE'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {invoice.status === 'PAID' ? 'Pagada' :
                         invoice.status === 'EMITTED' ? 'Emitida' :
                         invoice.status === 'OVERDUE' ? 'Vencida' :
                         invoice.status === 'DRAFT' ? 'Borrador' : invoice.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
