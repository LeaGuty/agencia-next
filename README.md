# Agencia de Viajes - Portal Web

Sistema de gestion de solicitudes de viaje para una agencia, con roles diferenciados para **agentes** y **clientes**.

## Funcionalidades

- **Autenticacion** con credenciales (email/password) y OAuth con GitHub
- **Roles de usuario**: agentes crean y administran solicitudes; clientes consultan las propias
- **CRUD de solicitudes de viaje**: creacion, listado, modificacion y eliminacion
- **Busqueda de clientes** registrados con autocompletado de datos (nombre, DNI)
- **Skeleton loading** como retroalimentacion visual durante la carga de datos
- **Lazy loading** de componentes pesados con `next/dynamic`

## Tech Stack

| Tecnologia | Version | Uso |
|---|---|---|
| Next.js | 16.1 | Framework principal (App Router) |
| React | 19 | Libreria de UI |
| TypeScript | 5 | Tipado estatico |
| Tailwind CSS | 4 | Estilos utilitarios |
| Axios | 1.13 | Cliente HTTP |
| js-cookie | 3 | Manejo de cookies (OAuth) |

## Estructura del proyecto

```
src/
├── app/
│   ├── auth/github/callback/   # Callback OAuth de GitHub
│   ├── dashboard/              # Panel principal (listado + formulario)
│   ├── login/                  # Inicio de sesion
│   ├── register/               # Registro de usuarios
│   ├── layout.tsx              # Layout raiz
│   └── page.tsx                # Pagina de inicio
├── components/
│   ├── auth/                   # LoginForm, RegisterForm
│   ├── dashboard/              # CreateRequestForm, RequestActions
│   └── skeletons/              # DashboardSkeleton
├── services/
│   └── api.ts                  # Servicios HTTP (auth + travel requests)
└── types/
    └── index.ts                # Interfaces TypeScript
```

## Requisitos previos

- Node.js 18 o superior
- Backend de la API corriendo (por defecto en `http://localhost:3001/api`)

## Instalacion

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd agencia-next

# Instalar dependencias
npm install
```

## Variables de entorno

Crear un archivo `.env.local` en la raiz del proyecto:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_GITHUB_CLIENT_ID=<tu-client-id>
NEXT_PUBLIC_GITHUB_REDIRECT_URI=http://localhost:3000/auth/github/callback
```

## Uso

```bash
# Desarrollo
npm run dev

# Build de produccion
npm run build

# Iniciar en produccion
npm start

# Linting
npm run lint
```

La aplicacion estara disponible en `http://localhost:3000`.

## Roles del sistema

| Rol | Permisos |
|---|---|
| **Agente** | Crear, ver todas, modificar y eliminar solicitudes |
| **Cliente** | Ver unicamente sus solicitudes asignadas |
