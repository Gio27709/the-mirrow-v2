# The Mirrow 2 - Plataforma de Entretenimiento

Plataforma profesional para la gestión de entretenimiento: Teatro, Músicos, DJs, Cantantes y Billar.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion.
- **Backend**: FastAPI (Python), SQLAlchemy, PostgreSQL.
- **Auth**: JWT (Custom + Python-Jose), Google OAuth 2.0.

## Requisitos Previos

- Python 3.9+
- Node.js 18+
- PostgreSQL

## Configuración e Instalación

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
# Windows
.\venv\Scripts\activate
# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

**Variables de Entorno**:
Crea un archivo `.env` en la carpeta `backend/` basado en `.env.example`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/db_name
SECRET_KEY=tu_clave_secreta_segura
GOOGLE_CLIENT_ID=...
```

**Ejecutar Servidor**:
```bash
uvicorn app.main:app --reload
```
El servidor correrá en `http://localhost:8000`.

### 2. Frontend (Next.js)

```bash
cd frontend
npm install
```

**Variables de Entorno**:
Crea un archivo `.env` en la carpeta `frontend/` basado en `.env.example`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
```

**Ejecutar Cliente**:
```bash
npm run dev
```
La aplicación correrá en `http://localhost:3000`.

## Credenciales de Administrador

El sistema utiliza un rol de **Owner** (Dueño) que tiene permisos absolutos y no puede ser eliminado.

- **Email Owner**: `villabonagiovany@gmail.com`
- **Password**: (La que hayas configurado en el registro o base de datos)

Para promover usuarios a Admin, ingresa como Owner y utiliza el Dashboard en `/admin/users`.

## Despliegue

- **Frontend**: Optimizado para Vercel (`npm run build`).
- **Backend**: Compatible con Render, Railway o cualquier host de Python. Asegúrate de configurar las mismas variables de entorno en producción.
