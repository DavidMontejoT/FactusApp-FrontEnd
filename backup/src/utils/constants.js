// Configuración de API
export const API_URL = 'http://localhost:8080/api';

// Colores principales
export const COLORS = {
  primary: '#2563EB',
  primaryDark: '#1E40AF',
  secondary: '#6B7280',
  bgDark: '#111827',
  bgLight: '#F9FAFB',
  white: '#FFFFFF',
  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',
  border: '#E5E7EB',
  text: '#1F2937',
  textLight: '#6B7280',
};

// Tipos de documento colombianos
export const DOCUMENT_TYPES = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'NIT', label: 'NIT' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'TI', label: 'Tarjeta de Identidad' },
  { value: 'PP', label: 'Pasaporte' },
  { value: 'IDC', label: 'Identificador de Único Cliente' },
];

// Métodos de pago
export const PAYMENT_METHODS = [
  { value: 'CASH', label: 'Efectivo' },
  { value: 'TRANSFER', label: 'Transferencia Bancaria' },
  { value: 'CARD', label: 'Tarjeta de Crédito/Débito' },
  { value: 'NEQUI', label: 'Nequi' },
  { value: 'DAVIPLATA', label: 'Daviplata' },
];

// Estados de factura
export const INVOICE_STATUSES = [
  { value: 'DRAFT', label: 'Borrador', color: '#6B7280' },
  { value: 'EMITTED', label: 'Emitida', color: '#3B82F6' },
  { value: 'PAID', label: 'Pagada', color: '#10B981' },
  { value: 'OVERDUE', label: 'Vencida', color: '#EF4444' },
];

// Tipos de organización (para API Factus)
export const LEGAL_ORGANIZATION_TYPES = [
  { value: 1, label: 'Persona Natural' },
  { value: 2, label: 'Persona Jurídica' },
];

// Categorías de productos por defecto
export const PRODUCT_CATEGORIES = [
  'Servicios',
  'Tecnología',
  'Ropa y Accesorios',
  'Alimentos',
  'Muebles',
  'Herramientas',
  'Medicamentos',
  'Librería',
  'Otros',
];

// Unidades de medida
export const UNIT_MEASURES = [
  { value: 'UNIDAD', label: 'Unidad' },
  { value: 'CAJA', label: 'Caja' },
  { value: 'DOCENA', label: 'Docena' },
  { value: 'KILO', label: 'Kilo' },
  { value: 'GRAMO', label: 'Gramo' },
  { value: 'LITRO', label: 'Litro' },
  { value: 'MILILITRO', label: 'Mililitro' },
  { value: 'METRO', label: 'Metro' },
  { value: 'METRO_CUADRADO', label: 'Metro Cuadrado' },
  { value: 'HORA', label: 'Hora' },
];

// Planes disponibles
export const PLANS = [
  { value: 'FREE', label: 'Plan Gratuito', price: 0 },
  { value: 'BASIC', label: 'Plan Basic', price: 45000 },
  { value: 'FULL', label: 'Plan Full', price: 99000 },
];

// Límites por plan
export const PLAN_LIMITS = {
  FREE: {
    invoices: 15,
    products: 20,
    clients: 30,
    users: 1,
    features: ['dashboard_basic', 'invoices_basic', 'inventory_basic'],
  },
  BASIC: {
    invoices: 50,
    products: 100,
    clients: 200,
    users: 3,
    features: [
      'dashboard_basic',
      'invoices_full',
      'inventory_full',
      'factus_integration',
      'charts_basic',
    ],
  },
  FULL: {
    invoices: Infinity,
    products: Infinity,
    clients: Infinity,
    users: 10,
    features: [
      'dashboard_advanced',
      'invoices_full',
      'inventory_full',
      'factus_integration',
      'charts_advanced',
      'reports',
      'multi_branch',
      'api_access',
    ],
  },
};

// Rutas de navegación
export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  INVOICES: '/invoices',
  INVOICE_CREATE: '/invoices/create',
  INVOICE_EDIT: '/invoices/:id/edit',
  INVOICE_VIEW: '/invoices/:id',
  PRODUCTS: '/products',
  PRODUCT_CREATE: '/products/create',
  PRODUCT_EDIT: '/products/:id/edit',
  CLIENTS: '/clients',
  CLIENT_CREATE: '/clients/create',
  CLIENT_EDIT: '/clients/:id/edit',
  SETTINGS: '/settings',
  PROFILE: '/profile',
};

// Mensajes de error
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Verifica tu internet.',
  UNAUTHORIZED: 'No tienes permiso para realizar esta acción.',
  FORBIDDEN: 'Acceso denegado.',
  NOT_FOUND: 'Recurso no encontrado.',
  SERVER_ERROR: 'Error del servidor. Intenta nuevamente.',
  INVALID_CREDENTIALS: 'Credenciales inválidas.',
  EMAIL_EXISTS: 'El email ya está registrado.',
  WEAK_PASSWORD: 'La contraseña debe tener al menos 8 caracteres.',
  LIMIT_REACHED: 'Has alcanzado el límite de tu plan. Haz upgrade.',
};

// Expresiones regulares
export const REGEX = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?57?\d{10,15}$/,
  nit: /^\d{9,15}$/,
  password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/,
};

// Configuración de paginación
export const PAGINATION = {
  defaultPageSize: 10,
  pageSizeOptions: [10, 20, 50, 100],
};

// Configuración de fechas
export const DATE_CONFIG = {
  format: 'YYYY-MM-DD',
  displayFormat: 'DD/MM/YYYY',
  locale: 'es-CO',
};
