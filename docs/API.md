# 🌐 Documentación de API - NeoCare

## Índice

1. [Información General](#información-general)
2. [Autenticación](#autenticación)
3. [Endpoints - Auth](#endpoints---auth)
4. [Endpoints - Boards](#endpoints---boards)
5. [Endpoints - Lists](#endpoints---lists)
6. [Endpoints - Cards](#endpoints---cards)
7. [Endpoints - Worklogs](#endpoints---worklogs)
8. [Endpoints - Reports](#endpoints---reports)
9. [Endpoints - Health](#endpoints---health)
10. [Códigos de Error](#códigos-de-error)
11. [Ejemplos de Uso](#ejemplos-de-uso)

---

## Información General

### Base URL

```
Desarrollo: http://localhost:8000
Producción: https://api.neocare.health (ejemplo)
```

### Formato de Respuestas

Todas las respuestas están en formato JSON:

```json
{
  "data": {},
  "message": "Success",
  "status": 200
}
```

### Headers Comunes

```http
Content-Type: application/json
Authorization: Bearer {access_token}
```

### Documentación Interactiva

- **Swagger UI:** `http://localhost:8000/docs`
- **ReDoc:** `http://localhost:8000/redoc`

---

## Autenticación

### Flujo de Autenticación

1. **Registrarse o hacer login** para obtener tokens
2. **Incluir access_token** en el header `Authorization: Bearer {token}`
3. **Renovar token** cuando expire usando el refresh token

### Tokens JWT

**Access Token:**
- Duración: 60 minutos (configurable)
- Uso: Autenticar todas las requests
- Almacenar en: localStorage o cookie httpOnly

**Refresh Token:**
- Duración: 7 días (configurable)
- Uso: Renovar access token cuando expire
- Almacenar en: localStorage o cookie httpOnly

### Estructura del JWT

```json
{
  "sub": "user_email@example.com",
  "user_id": 123,
  "exp": 1705161234,
  "iat": 1705157634
}
```

---

## Endpoints - Auth

### POST /auth/register

Registrar un nuevo usuario en el sistema.

**Request:**
```http
POST /auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Validaciones:**
- `username`: 3-50 caracteres, alfanumérico
- `email`: Formato válido, único en el sistema
- `password`: Mínimo 8 caracteres, al menos 1 mayúscula, 1 minúscula, 1 número

**Response 201:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errores:**
- `400` - Email ya registrado
- `422` - Datos de entrada inválidos

---

### POST /auth/login

Autenticar usuario y obtener tokens.

**Request:**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Errores:**
- `401` - Credenciales incorrectas
- `422` - Formato de email inválido

---

### POST /auth/refresh

Renovar access token usando refresh token.

**Request:**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refresh_token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response 200:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}
```

**Errores:**
- `401` - Refresh token inválido o expirado

---

### GET /auth/me

Obtener información del usuario autenticado.

**Request:**
```http
GET /auth/me
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com"
}
```

**Errores:**
- `401` - Token inválido o no proporcionado

---

### POST /auth/logout

Cerrar sesión (invalidar tokens).

**Request:**
```http
POST /auth/logout
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "message": "Successfully logged out"
}
```

---

## Endpoints - Boards

### GET /boards/

Listar todos los tableros del usuario autenticado.

**Request:**
```http
GET /boards/
Authorization: Bearer {access_token}
```

**Response 200:**
```json
[
  {
    "id": 1,
    "title": "Proyecto NeoCare",
    "user_id": 1
  },
  {
    "id": 2,
    "title": "Sprint 2025-01",
    "user_id": 1
  }
]
```

---

### POST /boards/

Crear un nuevo tablero.

**Request:**
```http
POST /boards/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Nuevo Proyecto"
}
```

**Validaciones:**
- `title`: 1-100 caracteres, requerido

**Response 201:**
```json
{
  "id": 3,
  "title": "Nuevo Proyecto",
  "user_id": 1
}
```

**Errores:**
- `422` - Título vacío o demasiado largo

---

### GET /boards/{board_id}

Obtener detalles de un tablero específico.

**Request:**
```http
GET /boards/5
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "id": 5,
  "title": "Proyecto NeoCare",
  "user_id": 1,
  "lists": [
    {
      "id": 10,
      "title": "To Do",
      "board_id": 5
    },
    {
      "id": 11,
      "title": "In Progress",
      "board_id": 5
    }
  ]
}
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### PUT /boards/{board_id}

Actualizar un tablero.

**Request:**
```http
PUT /boards/5
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Proyecto Actualizado"
}
```

**Response 200:**
```json
{
  "id": 5,
  "title": "Proyecto Actualizado",
  "user_id": 1
}
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### DELETE /boards/{board_id}

Eliminar un tablero (y todas sus listas y tarjetas).

**Request:**
```http
DELETE /boards/5
Authorization: Bearer {access_token}
```

**Response 204:**
```
No Content
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

## Endpoints - Lists

### GET /lists/board/{board_id}

Listar todas las listas de un tablero.

**Request:**
```http
GET /lists/board/5
Authorization: Bearer {access_token}
```

**Response 200:**
```json
[
  {
    "id": 10,
    "title": "To Do",
    "board_id": 5
  },
  {
    "id": 11,
    "title": "In Progress",
    "board_id": 5
  },
  {
    "id": 12,
    "title": "Done",
    "board_id": 5
  }
]
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### POST /lists/

Crear una nueva lista en un tablero.

**Request:**
```http
POST /lists/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Testing",
  "board_id": 5
}
```

**Validaciones:**
- `title`: 1-100 caracteres, requerido
- `board_id`: Debe existir y pertenecer al usuario

**Response 201:**
```json
{
  "id": 13,
  "title": "Testing",
  "board_id": 5
}
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### PUT /lists/{list_id}

Actualizar una lista.

**Request:**
```http
PUT /lists/13
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "QA Testing"
}
```

**Response 200:**
```json
{
  "id": 13,
  "title": "QA Testing",
  "board_id": 5
}
```

**Errores:**
- `403` - No eres dueño de la lista
- `404` - Lista no encontrada

---

### DELETE /lists/{list_id}

Eliminar una lista (y todas sus tarjetas).

**Request:**
```http
DELETE /lists/13
Authorization: Bearer {access_token}
```

**Response 204:**
```
No Content
```

**Errores:**
- `403` - No eres dueño de la lista
- `404` - Lista no encontrada

---

## Endpoints - Cards

### GET /cards/

Listar todas las tarjetas del usuario.

**Request:**
```http
GET /cards/?board_id=5
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `board_id` (opcional): Filtrar por tablero
- `list_id` (opcional): Filtrar por lista
- `status` (opcional): Filtrar por estado (todo, in_progress, done)

**Response 200:**
```json
[
  {
    "id": 20,
    "title": "Implementar autenticación",
    "list_id": 10,
    "status": "done",
    "order": 0
  },
  {
    "id": 21,
    "title": "Crear endpoints de reportes",
    "list_id": 11,
    "status": "in_progress",
    "order": 1
  }
]
```

---

### POST /cards/

Crear una nueva tarjeta.

**Request:**
```http
POST /cards/
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Nueva tarea",
  "list_id": 10,
  "status": "todo",
  "order": 0
}
```

**Validaciones:**
- `title`: 1-200 caracteres, requerido
- `list_id`: Debe existir, requerido
- `status`: Enum (todo, in_progress, done), opcional (default: todo)
- `order`: Integer, opcional (default: 0)

**Response 201:**
```json
{
  "id": 22,
  "title": "Nueva tarea",
  "list_id": 10,
  "status": "todo",
  "order": 0
}
```

**Errores:**
- `403` - No eres dueño de la lista
- `404` - Lista no encontrada

---

### PUT /cards/{card_id}

Actualizar una tarjeta.

**Request:**
```http
PUT /cards/22
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "title": "Tarea actualizada",
  "status": "in_progress",
  "list_id": 11
}
```

**Response 200:**
```json
{
  "id": 22,
  "title": "Tarea actualizada",
  "list_id": 11,
  "status": "in_progress",
  "order": 0
}
```

**Errores:**
- `403` - No eres dueño de la tarjeta
- `404` - Tarjeta no encontrada

---

### DELETE /cards/{card_id}

Eliminar una tarjeta (y todos sus worklogs).

**Request:**
```http
DELETE /cards/22
Authorization: Bearer {access_token}
```

**Response 204:**
```
No Content
```

**Errores:**
- `403` - No eres dueño de la tarjeta
- `404` - Tarjeta no encontrada

---

## Endpoints - Worklogs

### POST /cards/{card_id}/worklogs

Registrar horas trabajadas en una tarjeta.

**Request:**
```http
POST /cards/22/worklogs
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "date": "2026-01-13",
  "hours": 3.5,
  "note": "Implementación de validaciones"
}
```

**Validaciones:**
- `date`: Formato YYYY-MM-DD, no puede ser futura, requerido
- `hours`: Float > 0, requerido (recomendado: mínimo 0.25)
- `note`: 0-200 caracteres, opcional

**Response 201:**
```json
{
  "id": 100,
  "card_id": 22,
  "user_id": 1,
  "date": "2026-01-13",
  "hours": 3.5,
  "note": "Implementación de validaciones",
  "created_at": "2026-01-13T14:30:00",
  "updated_at": "2026-01-13T14:30:00"
}
```

**Errores:**
- `400` - Fecha futura o horas <= 0
- `403` - No tienes acceso a esta tarjeta
- `404` - Tarjeta no encontrada

---

### GET /cards/{card_id}/worklogs

Listar todos los worklogs de una tarjeta.

**Request:**
```http
GET /cards/22/worklogs
Authorization: Bearer {access_token}
```

**Response 200:**
```json
[
  {
    "id": 100,
    "card_id": 22,
    "user_id": 1,
    "date": "2026-01-13",
    "hours": 3.5,
    "note": "Implementación de validaciones",
    "created_at": "2026-01-13T14:30:00",
    "updated_at": "2026-01-13T14:30:00"
  },
  {
    "id": 101,
    "card_id": 22,
    "user_id": 2,
    "date": "2026-01-14",
    "hours": 2.0,
    "note": "Code review",
    "created_at": "2026-01-14T10:15:00",
    "updated_at": "2026-01-14T10:15:00"
  }
]
```

**Errores:**
- `403` - No tienes acceso a esta tarjeta
- `404` - Tarjeta no encontrada

---

### PATCH /worklogs/{worklog_id}

Actualizar un worklog propio.

**Request:**
```http
PATCH /worklogs/100
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "hours": 4.0,
  "note": "Implementación y testing completo"
}
```

**Response 200:**
```json
{
  "id": 100,
  "card_id": 22,
  "user_id": 1,
  "date": "2026-01-13",
  "hours": 4.0,
  "note": "Implementación y testing completo",
  "created_at": "2026-01-13T14:30:00",
  "updated_at": "2026-01-13T15:45:00"
}
```

**Errores:**
- `403` - No eres el autor del worklog
- `404` - Worklog no encontrado

---

### DELETE /worklogs/{worklog_id}

Eliminar un worklog propio.

**Request:**
```http
DELETE /worklogs/100
Authorization: Bearer {access_token}
```

**Response 204:**
```
No Content
```

**Errores:**
- `403` - No eres el autor del worklog
- `404` - Worklog no encontrado

---

### GET /users/me/worklogs

Obtener worklogs semanales del usuario autenticado.

**Request:**
```http
GET /users/me/worklogs?week=2026-02
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `week` (opcional): Formato ISO YYYY-WW (ej: 2026-02). Default: semana actual

**Response 200:**
```json
{
  "week": "2026-02",
  "total_week_hours": 17.5,
  "daily_totals": {
    "2026-01-13": 4.0,
    "2026-01-14": 6.5,
    "2026-01-15": 5.0,
    "2026-01-16": 2.0
  },
  "worklogs": [
    {
      "id": 100,
      "card_id": 22,
      "card_title": "Nueva tarea",
      "date": "2026-01-13",
      "hours": 4.0,
      "note": "Implementación",
      "created_at": "2026-01-13T14:30:00"
    }
  ]
}
```

**Errores:**
- `400` - Formato de semana inválido
- `401` - No autenticado

---

## Endpoints - Reports

### GET /report/{board_id}/summary

Resumen semanal de tarjetas de un tablero.

**Request:**
```http
GET /report/5/summary?week=2026-02
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `week` (opcional): Formato ISO YYYY-WW. Default: semana actual

**Response 200:**
```json
{
  "week": "2026-02",
  "completed": 5,
  "overdue": 2,
  "new": 3
}
```

**Definiciones:**
- `completed`: Tarjetas movidas a "done" en la semana
- `overdue`: Tarjetas con fecha límite vencida
- `new`: Tarjetas creadas en la semana

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### GET /report/{board_id}/hours-by-user

Horas trabajadas por usuario en un tablero.

**Request:**
```http
GET /report/5/hours-by-user?week=2026-02
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `week` (opcional): Formato ISO YYYY-WW. Default: semana actual

**Response 200:**
```json
{
  "week": "2026-02",
  "users": [
    {
      "user_id": 1,
      "username": "john_doe",
      "total_hours": 17.5,
      "tasks_count": 4
    },
    {
      "user_id": 2,
      "username": "jane_smith",
      "total_hours": 12.0,
      "tasks_count": 3
    }
  ]
}
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

### GET /report/{board_id}/hours-by-card

Horas trabajadas por tarjeta en un tablero.

**Request:**
```http
GET /report/5/hours-by-card?week=2026-02
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `week` (opcional): Formato ISO YYYY-WW. Default: semana actual

**Response 200:**
```json
{
  "week": "2026-02",
  "cards": [
    {
      "card_id": 22,
      "title": "Nueva tarea",
      "total_hours": 12.5,
      "responsible": null,
      "estado": "in_progress"
    },
    {
      "card_id": 23,
      "title": "Implementar reportes",
      "total_hours": 8.0,
      "responsible": null,
      "estado": "done"
    }
  ]
}
```

**Errores:**
- `403` - No eres dueño del tablero
- `404` - Tablero no encontrado

---

## Endpoints - Health

### GET /health/

Health check público de la API.

**Request:**
```http
GET /health/
```

**Response 200:**
```json
{
  "status": "healthy",
  "timestamp": "2026-01-13T14:30:00"
}
```

---

### GET /health/db

Health check de la conexión a base de datos.

**Request:**
```http
GET /health/db
```

**Response 200:**
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-01-13T14:30:00"
}
```

**Response 503 (si falla):**
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout"
}
```

---

### GET /health/metrics

Métricas del sistema (requiere autenticación).

**Request:**
```http
GET /health/metrics
Authorization: Bearer {access_token}
```

**Response 200:**
```json
{
  "uptime_seconds": 3600,
  "total_requests": 1523,
  "active_connections": 12,
  "memory_usage_mb": 245.3,
  "timestamp": "2026-01-13T14:30:00"
}
```

---

## Códigos de Error

### Códigos HTTP Comunes

| Código | Significado | Descripción |
|--------|-------------|-------------|
| 200 | OK | Request exitoso |
| 201 | Created | Recurso creado exitosamente |
| 204 | No Content | Recurso eliminado exitosamente |
| 400 | Bad Request | Datos de entrada inválidos |
| 401 | Unauthorized | Token inválido o no proporcionado |
| 403 | Forbidden | No tienes permisos para este recurso |
| 404 | Not Found | Recurso no encontrado |
| 422 | Unprocessable Entity | Validación de Pydantic falló |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Error del servidor |
| 503 | Service Unavailable | Servicio temporalmente no disponible |

### Formato de Error

```json
{
  "detail": "Board not found",
  "status_code": 404,
  "timestamp": "2026-01-13T14:30:00"
}
```

### Errores de Validación (422)

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    },
    {
      "loc": ["body", "password"],
      "msg": "ensure this value has at least 8 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

---

## Ejemplos de Uso

### JavaScript/TypeScript (Axios)

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:8000';

// Configurar cliente con interceptor
const api = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Login
const login = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('access_token', response.data.access_token);
  localStorage.setItem('refresh_token', response.data.refresh_token);
  return response.data.user;
};

// Crear tablero
const createBoard = async (title: string) => {
  const response = await api.post('/boards/', { title });
  return response.data;
};

// Listar tarjetas
const getCards = async (boardId: number) => {
  const response = await api.get(`/cards/?board_id=${boardId}`);
  return response.data;
};

// Registrar horas
const logHours = async (cardId: number, hours: number, date: string, note: string) => {
  const response = await api.post(`/cards/${cardId}/worklogs`, {
    date,
    hours,
    note
  });
  return response.data;
};
```

### Python (requests)

```python
import requests

API_URL = "http://localhost:8000"

# Login
response = requests.post(f"{API_URL}/auth/login", json={
    "email": "john@example.com",
    "password": "SecurePass123!"
})
tokens = response.json()
access_token = tokens["access_token"]

# Headers con autenticación
headers = {
    "Authorization": f"Bearer {access_token}",
    "Content-Type": "application/json"
}

# Crear tablero
response = requests.post(
    f"{API_URL}/boards/",
    json={"title": "Nuevo Proyecto"},
    headers=headers
)
board = response.json()

# Listar worklogs semanales
response = requests.get(
    f"{API_URL}/users/me/worklogs?week=2026-02",
    headers=headers
)
worklogs = response.json()
```

### cURL

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}'

# Crear tablero (con token)
curl -X POST http://localhost:8000/boards/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Nuevo Proyecto"}'

# Obtener reporte de horas
curl -X GET "http://localhost:8000/report/5/hours-by-user?week=2026-02" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## Rate Limiting

**Límites Actuales:**
- 100 requests por minuto por IP
- Header `X-RateLimit-Remaining` indica requests restantes
- Header `X-RateLimit-Reset` indica cuándo se resetea el contador

**Headers de Respuesta:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 87
X-RateLimit-Reset: 1705161234
```

**Exceder límite (429):**
```json
{
  "detail": "Rate limit exceeded. Try again in 45 seconds.",
  "retry_after": 45
}
```

---

## Versionamiento

La API actualmente está en la **versión 1.0.0**.

Futuras versiones mayores se identificarán en la URL:
- v1: `/api/v1/boards/`
- v2: `/api/v2/boards/`

La versión actual no requiere prefijo de versión.

---

## Soporte

Para reportar problemas o solicitar nuevas funcionalidades:

1. Revisar logs del servidor: `logs/app_YYYYMMDD.log`
2. Consultar Swagger UI: `http://localhost:8000/docs`
3. Contactar: Equipo de Innovación NeoCare Health

---

**Última actualización:** 13 de Enero, 2026  
**Versión de la API:** 1.0.0
