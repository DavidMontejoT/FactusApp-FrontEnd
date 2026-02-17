// Formatear número a moneda colombiana
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
};

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return '-';
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};

// Calcular porcentaje de cambio
export const calculatePercentage = (current, previous) => {
  if (!previous || previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Obtener color según estado de factura
export const getInvoiceStatusColor = (status) => {
  const colors = {
    DRAFT: '#6B7280',      // Gris
    EMITTED: '#3B82F6',    // Azul
    PAID: '#10B981',       // Verde
    OVERDUE: '#EF4444',    // Rojo
  };
  return colors[status] || '#6B7280';
};

// Obtener texto del estado de factura
export const getInvoiceStatusText = (status) => {
  const texts = {
    DRAFT: 'Borrador',
    EMITTED: 'Emitida',
    PAID: 'Pagada',
    OVERDUE: 'Vencida',
  };
  return texts[status] || status;
};

// Obtener color según nivel de stock
export const getStockColor = (current, min) => {
  if (current === 0) return '#EF4444';  // Rojo - Agotado
  if (current <= min) return '#F59E0B'; // Amarillo - Bajo
  return '#10B981';                     // Verde - OK
};

// Obtener texto del nivel de stock
export const getStockText = (current, min) => {
  if (current === 0) return 'Agotado';
  if (current <= min) return 'Stock Bajo';
  return 'En Stock';
};

// Validar email
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Validar NIT colombiano
export const isValidNit = (nit) => {
  // NIT colombiano: 9-15 dígitos
  const re = /^\d{9,15}$/;
  return re.test(nit.replace(/[^0-9]/g, ''));
};

// Calcular IVA
export const calculateIVA = (amount, percentage = 19) => {
  return (amount * percentage) / 100;
};

// Calcular total con IVA
export const calculateTotal = (amount, ivaPercentage = 19, ivaIncluded = true) => {
  if (ivaIncluded) {
    return amount;
  }
  return amount + calculateIVA(amount, ivaPercentage);
};

// Generar código único
export const generateUniqueId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Truncar texto
export const truncateText = (text, maxLength) => {
  if (!text || text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

// Descargar archivo
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

// Copiar al portapapeles
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error al copiar:', err);
    return false;
  }
};

// Obtener iniciales del nombre
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Formatear número de teléfono colombiano
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6)}`;
  }
  if (cleaned.length === 7) {
    return `${cleaned.substring(0, 3)} ${cleaned.substring(3, 5)} ${cleaned.substring(5)}`;
  }
  return phone;
};

// Obtener nombre del plan
export const getPlanName = (plan) => {
  const names = {
    FREE: 'Plan Gratuito',
    BASIC: 'Plan Basic',
    FULL: 'Plan Full',
  };
  return names[plan] || plan;
};

// Obtener precio del plan
export const getPlanPrice = (plan) => {
  const prices = {
    FREE: '$0 COP',
    BASIC: '$45.000 COP/mes',
    FULL: '$99.000 COP/mes',
  };
  return prices[plan] || '-';
};
