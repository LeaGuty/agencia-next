# Agencia de Viajes - Portal Web

Sistema de gestión de solicitudes de viaje para una agencia, con roles diferenciados para **agentes** y **clientes**.

## Funcionalidades

- **Autenticación** con credenciales (email/password) y OAuth con GitHub
- **Roles de usuario**: agentes crean y administran solicitudes; clientes consultan las propias
- **CRUD de solicitudes de viaje**: creación, listado, modificación y eliminación
- **Búsqueda de clientes** registrados con autocompletado de datos (nombre, DNI)
- **Formularios con validación** contextual usando React Hook Form — campos vacíos y de formato
- **Internacionalización (i18n)** en español e inglés con detección automática del idioma del navegador y cambio manual
- **Skeleton loading** como retroalimentación visual durante la carga de datos
- **Lazy loading** de componentes pesados con `next/dynamic`

## Tech Stack

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | 16.1 | Framework principal (App Router) |
| React | 19 | Librería de UI |
| TypeScript | 5 | Tipado estático |
| Tailwind CSS | 4 | Estilos utilitarios |
| React Hook Form | 7 | Gestión y validación de formularios |
| react-i18next | 15 | Internacionalización (i18n) |
| i18next | 24 | Motor de traducciones |
| Axios | 1.13 | Cliente HTTP |
| js-cookie | 3 | Manejo de cookies (OAuth) |

## Estructura del proyecto

```
src/
├── app/
│   ├── auth/github/callback/   # Callback OAuth de GitHub
│   ├── dashboard/              # Panel principal (listado + formulario)
│   ├── login/                  # Inicio de sesión
│   ├── register/               # Registro de usuarios
│   ├── layout.tsx              # Layout raíz con I18nProvider
│   └── page.tsx                # Página de inicio
├── components/
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── dashboard/              # CreateRequestForm, RequestActions
│   ├── skeletons/              # DashboardSkeleton
│   ├── I18nProvider.tsx        # Proveedor de internacionalización (client)
│   └── LanguageSwitcher.tsx    # Selector de idioma ES / EN
├── i18n/
│   └── config.ts               # Configuración de i18next con recursos inline
├── services/
│   └── api.ts                  # Servicios HTTP (auth + travel requests)
└── types/
    └── index.ts                # Interfaces TypeScript
```

## Internacionalización

La aplicación soporta **español** (por defecto) e **inglés**. El idioma se determina con la siguiente prioridad:

1. Selección manual guardada en `localStorage` (`i18nextLng`)
2. Idioma del navegador (`navigator.language`)
3. Español como idioma de respaldo

El selector de idioma (botones **ES / EN**) está disponible en todas las páginas: inicio, login, registro y dashboard.

## Validaciones de formularios

Todos los formularios usan **React Hook Form** con validación en modo `onTouched`. Los errores se muestran debajo de cada campo en el idioma activo.

| Formulario | Campos validados |
|---|---|
| **Login** | Email (requerido, formato válido) · Contraseña (requerida) |
| **Registro** | Nombre (requerido, mín. 2 caracteres) · DNI/RUT (requerido, mín. 5 caracteres) · Email (requerido, formato válido) · Contraseña (requerida, mín. 6 caracteres, mayúscula + minúscula + número) |
| **Nueva solicitud** | Cliente (requerido) · Nombre pasajero (requerido) · Origen/Destino (requeridos, mín. 2 caracteres) · Fechas (requeridas; fecha de regreso debe ser posterior a la de salida) |

## Requisitos previos

- Node.js 18 o superior
- Backend de la API corriendo (por defecto en `http://localhost:3001/api`)

## Instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd agencia-next

# Instalar dependencias
npm install
```

## Variables de entorno

Crear un archivo `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GITHUB_CLIENT_ID=<tu-client-id>
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
```

## Uso

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Iniciar en producción
npm start

# Linting
npm run lint
```

La aplicación estará disponible en `http://localhost:3000`.

## Roles del sistema

| Rol | Permisos |
|---|---|
| **Agente** | Crear, ver todas, modificar y eliminar solicitudes |
| **Cliente** | Ver únicamente sus solicitudes asignadas |
