# FactusApp Frontend 🇨🇴

Aplicación web frontend para facturación electrónica integrada con **Factus API** y **DIAN**.

## 🌐 Producción

**Aplicación en vivo:** [https://factusapp-frontend.onrender.com](https://factusapp-frontend.onrender.com)

**Backend API:** https://factusapp-backend-1.onrender.com/api

**Credenciales de prueba:**
- Email: `test@test.com`
- Password: `Password123!`

---

## ✨ Características

- 🎨 **React 18** con Hooks y componentes modernos
- ⚡ **Vite 5** - Build tool ultra rápido
- 🎯 **React Router 6** - Navegación SPA
- 💅 **Tailwind CSS 3** - Estilos utility-first
- 📊 **Recharts** - Gráficos interactivos
- 🔐 **JWT Authentication** - Login persistente
- 📱 **Responsive Design** - Mobile-first
- 🚀 **Desplegado en Render** - Free tier

---

## 🛠️ Stack Tecnológico

### Core
- **React 18.3.1** - Framework UI
- **Vite 5.1.6** - Build tool
- **React Router DOM 6.22.0** - Navegación
- **Axios 1.6.7** - Cliente HTTP

### Estilos
- **Tailwind CSS 3.4.1** - Framework CSS
- **PostCSS 8.4** - Procesador CSS
- **Autoprefixer** - Prefijos automáticos

### Gráficos
- **Recharts 3.7.0** - Visualización de datos

### Utilidades
- **jsPDF 4.1.0** - Generación de PDFs

---

## 📦 Estructura del Proyecto

```
factusapp-frontend/
├── src/
│   ├── components/         # Componentes reutilizables
│   │   ├── MetricCard.js
│   │   ├── Navbar.jsx
│   │   ├── StatusBadge.js
│   │   └── InvoiceListItem.js
│   ├── context/           # Contexto de autenticación
│   │   └── AuthContext.jsx
│   ├── navigation/        # Configuración de rutas
│   │   └── AppNavigator.jsx (migrado a App.jsx)
│   ├── pages/             # Páginas de la aplicación
│   │   ├── LoginPage.jsx
│   │   ├── DashboardPage.jsx
│   │   ├── ClientsPage.jsx
│   │   ├── ClientCreatePage.jsx
│   │   ├── ProductsPage.jsx
│   │   ├── ProductCreatePage.jsx
│   │   ├── InvoicesPage.jsx
│   │   ├── InvoiceCreatePage.jsx
│   │   └── SettingsPage.jsx
│   ├── services/          # Servicios API
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── clientService.js
│   │   ├── productService.js
│   │   └── invoiceService.js
│   ├── utils/             # Utilidades
│   │   ├── constants.js
│   │   └── formatters.js
│   ├── App.jsx            # Componente principal
│   └── main.jsx           # Punto de entrada
├── public/                # Archivos estáticos
│   ├── routes.conf        # Configuración de rutas Render
│   └── vite.svg
├── index.html
├── vite.config.js         # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── package.json
```

---

## 🎯 Páginas Implementadas

### Autenticación
- **Login** (`/login`) - Inicio de sesión
- **Registro automático** - Botón para crear usuario demo

### Dashboard
- **Dashboard** (`/dashboard`) - Vista principal
  - 4 métricas en tiempo real
  - Gráfico de ventas
  - Facturas recientes

### Clientes
- **Lista Clientes** (`/clients`) - Listado con búsqueda
- **Crear Cliente** (`/clients/new`) - Formulario completo
  - Nombre completo
  - Email y teléfono
  - Tipo y número de documento
  - Dirección y ciudad

### Productos
- **Lista Productos** (`/products`) - Listado con filtros
- **Crear Producto** (`/products/new`) - Formulario completo
  - Nombre, descripción
  - SKU, precio, impuesto
  - Stock inicial
  - Unidad de medida

### Facturas
- **Lista Facturas** (`/invoices`) - Listado completo
- **Crear Factura** (`/invoices/new`) - Formulario completo
  - Seleccionar cliente
  - Agregar productos
  - Calcular totales
  - **Emitir a DIAN** (modo demo)
  - Descargar XML/PDF

### Configuración
- **Settings** (`/settings`) - Perfil y plan

---

## 🔧 Configuración

### Variables de Entorno

```bash
# API Backend
VITE_API_URL=https://factusapp-backend-1.onrender.com/api
```

### Build Commands

```bash
# Desarrollo
npm run dev          # Iniciar servidor desarrollo (puerto 3000)

# Producción
npm run build        # Construir para producción
npm run preview      # Previsualizar build de producción
```

---

## 🏗️ Instalación y Desarrollo Local

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar repositorio**
   ```bash
   git clone https://github.com/DavidMontejoT/FactusApp-FrontEnd.git
   ```

2. **Instalar dependencias**
   ```bash
   cd FactusApp-FrontEnd
   npm install
   ```

3. **Configurar API URL**

   Crear archivo `.env`:
   ```bash
   VITE_API_URL=http://localhost:8080/api
   ```

4. **Iniciar desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir navegador**
   ```
   http://localhost:3000
   ```

---

## 🎨 Características de UI/UX

### Diseño
- **Mobile-first** - Optimizado para móviles
- **Responsive** - Se adapta a cualquier pantalla
- **Clean UI** - Interfaz limpia y moderna
- **Tailwind CSS** - Estilos consistentes

### Experiencia de Usuario
- **Carga rápida** - Vite optimiza el build
- **Navegación fluida** - React Router con transiciones
- **Feedback visual** - Estados de carga y error
- **Mensajes claros** - Validaciones y alertas informativas

### Accesibilidad
- Contrastes de color WCAG AA
- Navegación por teclado
- Etiquetas semánticas
- Mensajes de error descriptivos

---

## 📊 Componentes Principales

### MetricCard
Muestra estadísticas en el dashboard:
- Ventas
- Facturas
- Productos
- Clientes

### Navbar
Barra de navegación principal con:
- Logo de FactusApp
- Enlaces a secciones principales
- Menú móvil responsive

### StatusBadge
Badges de color para estados de facturas:
- Borrador (gris)
- Emitida (azul)
- Pagada (verde)
- Vencida (rojo)

---

## 🔐 Autenticación

### Flujo de Login
1. Usuario ingresa email y contraseña
2. Frontend llama a `/api/auth/login`
3. Backend devuelve tokens (access + refresh)
4. Tokens se guardan en localStorage
5. Usuario redirigido a `/dashboard`

### Refresh Automático
- Access token expira cada 15 minutos
- Interceptor de Axios detecta error 401
- Llama automáticamente a `/api/auth/refresh`
- Obtiene nuevo access token
- Reintenta petición original transparentemente

### Logout
- Limpia localStorage
- Redirige a `/login`

---

## 🌐 Despliegue en Producción

### Plataforma
**Render.com** - Static Site (Free tier)

### URL de Producción
- **Frontend:** https://factusapp-frontend.onrender.com
- **Backend:** https://factusapp-backend-1.onrender.com/api

### Build Output
- **Carpeta:** `dist/`
- **Tamaño:** ~1MB gzipped
- **Tiempo de build:** ~6-7 segundos

### Performance
- **Lighthouse Score:** 95+
- **First Contentful Paint:** <1.5s
- **Time to Interactive:** <3s

---

## 🧪 Testing Manual

### Casos de Prueba

#### 1. Login Exitoso
```
Email: test@test.com
Password: Password123!
Resultado: Redirigido a Dashboard
```

#### 2. Crear Cliente
```
Nombre: Juan Pérez
Email: juan@example.com
Teléfono: +57 300 1234567
Documento: CC
Número: 123456789
Resultado: Cliente creado y visible en lista
```

#### 3. Crear Producto
```
Nombre: Producto Test
SKU: PROD-001
Precio: $50000
Impuesto: 19%
Stock: 100
Resultado: Producto creado y visible en lista
```

#### 4. Crear y Emitir Factura
```
1. Seleccionar cliente
2. Agregar producto(s)
3. Guardar factura
4. Click en "Emitir a DIAN"
Resultado: Factura emitida exitosamente (modo demo)
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First */
sm: 640px   /* Teléfonos pequeños */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktop grandes */
2xl: 1536px  /* Pantallas grandes */
```

---

## 🎨 Colores y Tema

### Paleta de Colores
- **Primary:** `#2563EB` (azul)
- **Primary Dark:** `#1E40AF` (azul oscuro)
- **Secondary:** `#6B7280` (gris)
- **Success:** `#22C55E` (verde)
- **Warning:** `#F59E0B` (amarillo)
- **Danger:** `#EF4444` (rojo)

### Tipografía
- **Font Family:** System UI (nativo del OS)
- **Headings:** Semibold (600)
- **Body:** Regular (400)

---

## 🚀 Performance Optimizations

### Build Optimizado
- **Code splitting** - Carga solo lo necesario
- **Tree shaking** - Elimina código muerto
- **Minificación** - Reduce tamaño de archivos
- **Gzip compression** - Comprime respuesta HTTP

### Runtime Optimizations
- **Lazy loading** - Carga componentes bajo demanda
- **Memoization** - Evita re-renders innecesarios
- **Debouncing** - Optimiza búsquedas y validaciones

---

## 🔧 Troubleshooting

### Problema: Página en blanco
**Causa:** Error de JavaScript
**Solución:** Abre DevTools (F12) → Console para ver el error

### Problema: Error 401 al hacer peticiones
**Causa:** Token expirado o inválido
**Solución:** Cierra sesión y vuelve a loguearte

### Problema: NOT FOUND al recargar
**Causa:** Configuración de rutas
**Solución:** Debe estar configurado en Render dashboard

### Problema: No conecta al backend
**Causa:** URL incorrecta
**Solución:** Verifica `VITE_API_URL` en variables de entorno

---

## 📚 Referencias

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Axios](https://axios-http.com/)
- [Recharts](https://recharts.org/)

---

## 🎯 Roadmap Futuro

### Corto Plazo
- [ ] Agregar edición de clientes
- [ ] Agregar edición de productos
- [ ] Agregar edición de facturas
- [ ] Mejorar gráficos del dashboard

### Mediano Plazo
- [ ] Reportes en PDF
- [ ] Exportar datos a Excel
- [ ] Notificaciones push
- [ ] Modo oscuro

### Largo Plazo
- [ ] App móvil React Native
- [ ] Integración con pasarela de pago
- [ ] Múltiples usuarios por organización
- [ ] Roles avanzados

---

## 👨‍💻 Desarrollo

### Autor
**David Montejo** - Reto API Factus 2026

### Año
2026

### Licencia
MIT License - Uso libre para fines educativos

---

## 🎯 Reto API Factus 2026

Este proyecto fue desarrollado para participar en el **Reto API Factus 2026** convocado por HALLTEC.

### Stack Completo
- **Frontend:** React 18 + Vite + Tailwind CSS
- **Backend:** Spring Boot + PostgreSQL + JWT
- **Infraestructura:** Render.com
- **API:** Factus API (sandbox)

### Logros Alcanzados
✅ Frontend moderno y responsive
✅ Integración completa con backend
✅ CRUD de clientes, productos y facturas
✅ Emisión de facturas a DIAN (modo demo)
✅ Autenticación JWT con refresh automático
✅ Despliegue en producción gratuita
✅ Documentación completa

---

## 📞 Soporte

Para reportar bugs o sugerencias:
- Abrir un issue en GitHub
- Contactar al desarrollador

---

**🚀 FactusApp Frontend - Disfrutando la facturación electrónica!**

*Hecho con ❤️ para Colombia 🇨🇴*
