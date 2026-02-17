# FactusApp - Facturación Electrónica Colombia 🇨🇴

Sistema completo de facturación electrónica integrado con **Factus API** y **DIAN**.

## 🚀 Demo en Vivo

**Frontend:** [https://factusapp-demo.vercel.app](https://factusapp-demo.vercel.app)
- Usuario: `demo@test.com`
- Contraseña: `demo123`

## ✨ Características

- ✅ Crear y gestionar facturas electrónicas
- ✅ Emitir facturas a DIAN (API Factus)
- ✅ Descargar XML y PDF oficial
- ✅ Enviar facturas por email
- ✅ Dashboard con gráficos interactivos
- ✅ Gestión de clientes y productos
- ✅ Autenticación JWT
- ✅ Diseño responsive (móvil/desktop)

## 🛠️ Tecnologías

### Frontend
- **React 18.3.1** - Framework UI
- **Vite 5.1.6** - Build tool
- **Tailwind CSS 3.4.1** - Estilos
- **Recharts** - Gráficos
- **React Router 6.22.0** - Navegación
- **Axios** - Cliente HTTP

### Backend
- **Spring Boot 3.2.0** - Framework Java
- **Java 17** - Lenguaje
- **PostgreSQL 16** - Base de datos
- **Spring Security** - Seguridad
- **JWT** - Autenticación
- **Factus API** - Facturación electrónica

## 📦 Instalación Local

### Prerrequisitos
- Node.js 18+
- Java 17+
- PostgreSQL 16
- npm o yarn

### Backend

```bash
cd factusapp-backend

# Configurar base de datos
# Editar src/main/resources/application.yml

# Ejecutar
./gradlew bootRun
```

El backend estará disponible en `http://localhost:8080`

### Frontend

```bash
cd factusapp-frontend

# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## 🌐 Despliegue en Producción

### Backend en Railway

1. Crear cuenta en [Railway](https://railway.app/)
2. Nuevo proyecto → Deploy from GitHub
3. Seleccionar el repositorio `factusapp-backend`
4. Configurar variables de entorno:

```bash
DATABASE_URL=postgresql://...
JWT_SECRET=tu_secreto_super_seguro
FACTUS_API_URL=https://api-sandbox.factus.com.co
FACTUS_CLIENT_ID=a11277dc-18d5-4f20-b216-4ce02dbe8407
FACTUS_CLIENT_SECRET=Qbl5tEw7DBCIMPRjMxsxkgximAOeThT6N6vfehzT
FACTUS_USERNAME=sandbox@factus.com.co
FACTUS_PASSWORD=sandbox2024%
FACTUS_DEMO_MODE=true
```

5. Desplegar

### Frontend en Vercel

1. Crear cuenta en [Vercel](https://vercel.com/)
2. New Project → Importar desde GitHub
3. Seleccionar `factusapp-frontend`
4. Configurar variable de entorno:

```bash
VITE_API_URL=https://tu-backend-en-railway.up.railway.app
```

5. Deploy

## 📸 Capturas del Dashboard

### KPIs
- Ventas totales
- Facturas pendientes
- Clientes activos
- Productos en stock

### Gráficos
- **Ingresos Mensuales** - Gráfico de barras
- **Estado de Facturas** - Gráfico circular
- **Tendencia de Ventas** - Gráfico de línea

## 🔐 Credenciales Demo

```
Usuario: demo@test.com
Contraseña: demo123
```

## 📄 Módulos Implementados

### ✅ Facturación Electrónica
- Crear facturas
- Emitir a DIAN
- Descargar XML con firma digital
- Descargar PDF oficial
- Enviar por email

### ✅ Gestión de Clientes
- Crear clientes
- Editar clientes
- Lista de clientes

### ✅ Gestión de Productos
- Crear productos
- Editar productos
- Control de stock

### ✅ Dashboard
- KPIs en tiempo real
- Gráficos interactivos
- Actividades recientes

## 🔗 Integración Factus API

### Endpoints Utilizados

```javascript
POST /v1/bills/validate          // Crear/Emitir factura
GET  /v1/bills/{id}              // Consultar factura
GET  /v1/bills/download-xml/{number}  // Descargar XML
GET  /v1/bills/download-pdf/{number}  // Descargar PDF
```

### MODO DEMO vs PRODUCCIÓN

**MODO DEMO** (actual):
- Simula respuestas de Factus API
- No requiere credenciales reales
- Ideal para pruebas

**MODO PRODUCCIÓN**:
- Usa credenciales reales de Factus
- Facturas con validez legal
- Configurar `demo-mode: false`

## 👨‍💻 Reto API Factus 2026

Este proyecto fue desarrollado para el **Reto API Factus 2026** de HALLTEC.

### Video Tutorial
[Ver en YouTube](https://youtube.com/tu-video)

### Tecnologías Utilizadas
- Frontend: React, Vite, Tailwind CSS, Recharts
- Backend: Spring Boot, Java 17, PostgreSQL
- API: Factus API (OAuth2)

### Lo que aprendí
- Integración con APIs de terceros
- Facturación electrónica colombiana
- Estándares DIAN
- Autenticación JWT y OAuth2
- Desarrollo full stack

## 📞 Contacto

Desarrollado para el Reto API Factus 2026

**Autor:** [Tu Nombre]
**Email:** tu@email.com
**País:** Colombia 🇨🇴

## 📝 Licencia

MIT License - Libre uso para fines educativos

---

**¡Hecho con ❤️ para la comunidad de desarrolladores Colombianos!**
