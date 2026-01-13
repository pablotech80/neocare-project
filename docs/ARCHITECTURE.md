# 🏗️ Arquitectura del Sistema NeoCare

## Índice

1. [Visión General](#visión-general)
2. [Arquitectura General](#arquitectura-general)
3. [Capas de la Aplicación](#capas-de-la-aplicación)
4. [Modelo de Datos](#modelo-de-datos)
5. [Flujos de Autenticación](#flujos-de-autenticación)
6. [Patrones de Diseño](#patrones-de-diseño)
7. [Seguridad](#seguridad)
8. [Escalabilidad](#escalabilidad)

---

## Visión General

NeoCare utiliza una **arquitectura de tres capas** con separación clara entre frontend, backend y base de datos. El sistema sigue principios de:

- **Separación de responsabilidades** (SoC)
- **Principio de responsabilidad única** (SRP)
- **Arquitectura limpia** (Clean Architecture)
- **API-first design**

### Stack Tecnológico

```
┌─────────────────────────────────────────┐
│           Frontend Layer                │
│   React + TypeScript + TailwindCSS      │
│         (SPA - Single Page App)         │
└─────────────────┬───────────────────────┘
                  │ HTTP/REST + JSON
                  │ JWT Authentication
┌─────────────────▼───────────────────────┐
│            Backend Layer                │
│      FastAPI + Pydantic + SQLAlchemy    │
│         (RESTful API + JWT)             │
└─────────────────┬───────────────────────┘
                  │ SQL Queries
                  │ Connection Pool
┌─────────────────▼───────────────────────┐
│          Database Layer                 │
│          PostgreSQL 12+                 │
│     (Relational Database + ACID)        │
└─────────────────────────────────────────┘
```

---

## Arquitectura General

### Diagrama de Alto Nivel

```
┌──────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐            │
│  │   Pages    │  │ Components │  │   Context  │            │
│  │  (Views)   │  │  (Shared)  │  │   (State)  │            │
│  └────────────┘  └────────────┘  └────────────┘            │
│         │                │                │                   │
│         └────────────────┴────────────────┘                   │
│                       │                                       │
│              ┌────────▼────────┐                             │
│              │   API Client    │                             │
│              │  (Axios + JWT)  │                             │
│              └────────┬────────┘                             │
└───────────────────────┼──────────────────────────────────────┘
                        │ HTTPS/REST
                        │ JSON + JWT Bearer Token
┌───────────────────────▼──────────────────────────────────────┐
│                      Backend API                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                    FastAPI App                         │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │ │
│  │  │ Routers  │  │Middleware│  │ Security │            │ │
│  │  │(Endpoints)│  │  (CORS)  │  │  (JWT)   │            │ │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘            │ │
│  └───────┼─────────────┼─────────────┼──────────────────┘ │
│          │             │             │                      │
│  ┌───────▼─────────────▼─────────────▼──────────────────┐ │
│  │              Business Logic Layer                     │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │ │
│  │  │ Schemas  │  │  Models  │  │   Core   │           │ │
│  │  │(Pydantic)│  │(SQLAlch.)│  │ (Config) │           │ │
│  │  └────┬─────┘  └────┬─────┘  └──────────┘           │ │
│  └───────┼─────────────┼────────────────────────────────┘ │
│          │             │                                    │
│  ┌───────▼─────────────▼────────────────────────────────┐ │
│  │              Database Session Layer                   │ │
│  │         (SQLAlchemy ORM + Connection Pool)           │ │
│  └───────┬───────────────────────────────────────────────┘ │
└──────────┼──────────────────────────────────────────────────┘
           │ SQL Queries
┌──────────▼──────────────────────────────────────────────────┐
│                    PostgreSQL Database                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────────┐     │
│  │users │  │boards│  │lists │  │cards │  │ worklogs │     │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────────┘     │
└─────────────────────────────────────────────────────────────┘
```

---

## Capas de la Aplicación

### 1. Frontend Layer

**Responsabilidad:** Interfaz de usuario y experiencia del usuario (UI/UX)

#### Estructura

```
frontend/src/
├── api/              # Cliente HTTP y comunicación con backend
│   ├── axios.ts      # Configuración de Axios con interceptores JWT
│   ├── auth.ts       # Endpoints de autenticación
│   ├── boards.ts     # Endpoints de tableros
│   ├── lists.ts      # Endpoints de listas
│   ├── cards.ts      # Endpoints de tarjetas
│   └── worklogs.ts   # Endpoints de registro de horas
├── components/       # Componentes reutilizables
│   ├── CardItem.tsx
│   ├── CardModal.tsx
│   ├── ProtectedRoute.tsx
│   └── ...
├── pages/           # Páginas/Vistas principales
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── Dashboard.tsx
│   └── BoardView.tsx
├── context/         # Contextos de React (estado global)
│   └── AuthContext.tsx
└── types/           # Definiciones de TypeScript
    └── index.ts
```

#### Características Clave

- **SPA (Single Page Application)** con React Router
- **Estado global** con Context API
- **Comunicación HTTP** con Axios y interceptores
- **Autenticación** con JWT almacenado en localStorage
- **TypeScript** para type safety
- **TailwindCSS** para estilos responsive
- **Drag & Drop** con @dnd-kit

---

### 2. Backend Layer

**Responsabilidad:** Lógica de negocio, validación, seguridad y acceso a datos

#### Estructura

```
backend/
├── core/                    # Configuración central
│   ├── config.py           # Variables de entorno
│   ├── security.py         # JWT, hashing, autenticación
│   └── logging_config.py   # Setup de logging
├── models/                 # Modelos de datos (SQLAlchemy)
│   ├── user.py
│   ├── board.py
│   ├── list.py
│   ├── card.py
│   └── worklog.py
├── schemas/                # Schemas de validación (Pydantic)
│   ├── card.py
│   ├── worklog.py
│   └── report.py
├── routers/                # Endpoints de la API
│   ├── auth.py            # Autenticación y autorización
│   ├── boards.py          # CRUD de tableros
│   ├── lists.py           # CRUD de listas
│   ├── cards.py           # CRUD de tarjetas
│   ├── worklogs.py        # Registro de horas
│   ├── reports.py         # Reportes y analytics
│   └── health.py          # Health checks
├── alembic/               # Migraciones de BD
│   └── versions/
├── main.py                # Aplicación FastAPI
└── database.py            # Configuración de BD
```

#### Patrones Implementados

**1. Repository Pattern (implícito con SQLAlchemy)**
```python
# Los modelos actúan como repositorios
db.query(Board).filter(Board.user_id == user_id).all()
```

**2. Dependency Injection**
```python
@router.get("/boards/")
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # db y current_user son inyectados
    pass
```

**3. Schema Pattern (DTO - Data Transfer Objects)**
```python
class BoardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)

class BoardResponse(BaseModel):
    id: int
    title: str
    user_id: int
```

**4. Middleware Pattern**
```python
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    logger.info(f"{request.method} {request.url.path} - {process_time:.3f}s")
    return response
```

---

### 3. Database Layer

**Responsabilidad:** Persistencia de datos y gestión transaccional

#### Esquema de Base de Datos

```sql
-- Tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL
);

-- Tabla de tableros
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla de listas
CREATE TABLE lists (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE
);

-- Tabla de tarjetas
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    list_id INTEGER NOT NULL REFERENCES lists(id) ON DELETE CASCADE,
    status VARCHAR DEFAULT 'todo',
    "order" INTEGER DEFAULT 0
);

-- Tabla de registros de horas
CREATE TABLE worklogs (
    id SERIAL PRIMARY KEY,
    card_id INTEGER NOT NULL REFERENCES cards(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hours FLOAT NOT NULL CHECK (hours > 0),
    note VARCHAR(200),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para optimización
CREATE INDEX idx_boards_user_id ON boards(user_id);
CREATE INDEX idx_lists_board_id ON lists(board_id);
CREATE INDEX idx_cards_list_id ON cards(list_id);
CREATE INDEX idx_worklogs_card_id ON worklogs(card_id);
CREATE INDEX idx_worklogs_user_id ON worklogs(user_id);
CREATE INDEX idx_worklogs_date ON worklogs(date);
```

#### Relaciones

```
users (1) ──< (N) boards
boards (1) ──< (N) lists
lists (1) ──< (N) cards
cards (1) ──< (N) worklogs
users (1) ──< (N) worklogs
```

---

## Modelo de Datos

### Diagrama Entidad-Relación

```
┌─────────────┐
│    users    │
│─────────────│
│ id (PK)     │
│ username    │
│ email       │
│ password_hash│
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────┐      ┌─────────────┐
│   boards    │      │  worklogs   │
│─────────────│      │─────────────│
│ id (PK)     │      │ id (PK)     │
│ title       │      │ card_id (FK)│
│ user_id (FK)│      │ user_id (FK)│
└──────┬──────┘      │ date        │
       │ 1           │ hours       │
       │             │ note        │
       │ N           │ created_at  │
┌──────▼──────┐      │ updated_at  │
│    lists    │      └─────────────┘
│─────────────│
│ id (PK)     │
│ title       │
│ board_id(FK)│
└──────┬──────┘
       │ 1
       │
       │ N
┌──────▼──────┐
│    cards    │
│─────────────│
│ id (PK)     │
│ title       │
│ list_id (FK)│
│ status      │
│ order       │
└─────────────┘
```

---

## Flujos de Autenticación

### 1. Registro de Usuario

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│Frontend│                  │Backend │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ POST /auth/register       │                            │
    │ {username, email, pass}   │                            │
    ├──────────────────────────>│                            │
    │                           │                            │
    │                           │ Validate input             │
    │                           │ (Pydantic)                 │
    │                           │                            │
    │                           │ Hash password              │
    │                           │ (bcrypt, 12 rounds)        │
    │                           │                            │
    │                           │ INSERT INTO users          │
    │                           ├───────────────────────────>│
    │                           │                            │
    │                           │        user_id             │
    │                           │<───────────────────────────┤
    │                           │                            │
    │                           │ Generate JWT tokens        │
    │                           │ (access + refresh)         │
    │                           │                            │
    │    {access, refresh}      │                            │
    │<──────────────────────────┤                            │
    │                           │                            │
    │ Store tokens in           │                            │
    │ localStorage              │                            │
    │                           │                            │
```

### 2. Login de Usuario

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│Frontend│                  │Backend │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ POST /auth/login          │                            │
    │ {email, password}         │                            │
    ├──────────────────────────>│                            │
    │                           │                            │
    │                           │ SELECT * FROM users        │
    │                           │ WHERE email = ?            │
    │                           ├───────────────────────────>│
    │                           │                            │
    │                           │    user record             │
    │                           │<───────────────────────────┤
    │                           │                            │
    │                           │ Verify password            │
    │                           │ (bcrypt.verify)            │
    │                           │                            │
    │                           │ Generate JWT tokens        │
    │                           │                            │
    │    {access, refresh}      │                            │
    │<──────────────────────────┤                            │
    │                           │                            │
    │ Store tokens              │                            │
    │                           │                            │
```

### 3. Request Autenticado

```
┌────────┐                  ┌────────┐                  ┌──────────┐
│Frontend│                  │Backend │                  │ Database │
└───┬────┘                  └───┬────┘                  └────┬─────┘
    │                           │                            │
    │ GET /boards/              │                            │
    │ Authorization: Bearer JWT │                            │
    ├──────────────────────────>│                            │
    │                           │                            │
    │                           │ Verify JWT                 │
    │                           │ (signature + expiration)   │
    │                           │                            │
    │                           │ Extract user_id from JWT   │
    │                           │                            │
    │                           │ SELECT * FROM boards       │
    │                           │ WHERE user_id = ?          │
    │                           ├───────────────────────────>│
    │                           │                            │
    │                           │      boards[]              │
    │                           │<───────────────────────────┤
    │                           │                            │
    │        boards[]           │                            │
    │<──────────────────────────┤                            │
    │                           │                            │
```

### 4. Token Refresh

```
┌────────┐                  ┌────────┐
│Frontend│                  │Backend │
└───┬────┘                  └───┬────┘
    │                           │
    │ Access token expired      │
    │ (401 response)            │
    │                           │
    │ POST /auth/refresh        │
    │ {refresh_token}           │
    ├──────────────────────────>│
    │                           │
    │                           │ Verify refresh token
    │                           │
    │                           │ Generate new access token
    │                           │
    │    {new_access_token}     │
    │<──────────────────────────┤
    │                           │
    │ Retry original request    │
    │                           │
```

---

## Patrones de Diseño

### 1. Dependency Injection (DI)

FastAPI utiliza DI nativo para gestionar dependencias:

```python
# Dependencia de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Dependencia de autenticación
def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    # Validar JWT y retornar usuario
    pass

# Uso en endpoints
@router.get("/boards/")
def get_boards(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return db.query(Board).filter(Board.user_id == current_user.id).all()
```

### 2. Schema Pattern (DTO)

Separación entre modelos de base de datos y modelos de API:

```python
# Modelo de base de datos (SQLAlchemy)
class Board(Base):
    __tablename__ = "boards"
    id = Column(Integer, primary_key=True)
    title = Column(String, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))

# Schema de entrada (Pydantic)
class BoardCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)

# Schema de salida (Pydantic)
class BoardResponse(BaseModel):
    id: int
    title: str
    user_id: int
    
    class Config:
        from_attributes = True
```

### 3. Repository Pattern (Implícito)

SQLAlchemy ORM actúa como repositorio:

```python
# Abstracción de acceso a datos
class BoardRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_by_user(self, user_id: int):
        return self.db.query(Board).filter(Board.user_id == user_id).all()
    
    def create(self, board_data: BoardCreate, user_id: int):
        board = Board(**board_data.dict(), user_id=user_id)
        self.db.add(board)
        self.db.commit()
        return board
```

### 4. Middleware Pattern

Procesamiento de requests/responses:

```python
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response
```

---

## Seguridad

### Capas de Seguridad

```
┌────────────────────────────────────────────────────────┐
│  1. Transport Layer Security (HTTPS)                  │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  2. CORS Policy (Allowed Origins)                     │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  3. Rate Limiting (100 req/min per IP)                │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  4. JWT Authentication (Bearer Token)                 │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  5. Authorization (Ownership Validation)              │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  6. Input Validation (Pydantic Schemas)               │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  7. SQL Injection Prevention (ORM + Parameterized)    │
└────────────────────────────────────────────────────────┘
┌────────────────────────────────────────────────────────┐
│  8. Password Hashing (bcrypt, 12 rounds)              │
└────────────────────────────────────────────────────────┘
```

### Medidas Implementadas

1. **Autenticación robusta**
   - JWT con RS256 o HS256
   - Tokens de corta duración (60 min)
   - Refresh tokens para renovación

2. **Hashing de contraseñas**
   - bcrypt con 12 rounds (configurable)
   - Salt automático por contraseña

3. **Validación de ownership**
   - Cada recurso valida que el usuario autenticado es el dueño
   - Prevención de IDOR (Insecure Direct Object Reference)

4. **Logging de seguridad**
   - Intentos de login fallidos
   - Accesos no autorizados
   - Cambios en datos sensibles

---

## Escalabilidad

### Estrategias de Escalado

#### 1. Horizontal Scaling (Backend)

```
┌──────────┐      ┌──────────────────────────────┐
│  Load    │      │     Backend Instances        │
│ Balancer ├─────>│  ┌──────┐ ┌──────┐ ┌──────┐ │
│  (Nginx) │      │  │ App1 │ │ App2 │ │ App3 │ │
└──────────┘      │  └──────┘ └──────┘ └──────┘ │
                  └──────────────────────────────┘
                              │
                              ▼
                  ┌─────────────────────┐
                  │  PostgreSQL Master  │
                  │   (Read + Write)    │
                  └─────────────────────┘
                              │
                              ├──> Read Replica 1
                              └──> Read Replica 2
```

#### 2. Database Optimization

- **Connection Pooling:** SQLAlchemy pool
- **Índices:** En foreign keys y campos de búsqueda
- **Read Replicas:** Para consultas de solo lectura
- **Caching:** Redis para datos frecuentes

#### 3. CDN para Frontend

```
User ──> CDN (Cloudflare) ──> Static Files (React Build)
  │
  └──> API (Backend) ──> Database
```

### Límites de Carga Actuales

- **Backend:** ~1000 req/seg por instancia (con 4 workers)
- **Database:** ~10,000 conexiones concurrentes (PostgreSQL)
- **Frontend:** Ilimitado (archivos estáticos)

### Mejoras Futuras

- [ ] Implementar caché con Redis
- [ ] Message queue para tareas asíncronas (Celery)
- [ ] Sharding de base de datos por usuario
- [ ] WebSockets para notificaciones en tiempo real
- [ ] Compresión gzip/brotli en responses

---

## Decisiones de Arquitectura (ADR)

### ADR-001: Uso de FastAPI sobre Flask

**Contexto:** Necesitamos un framework web Python moderno y performante.

**Decisión:** Usar FastAPI.

**Razones:**
- Soporte nativo para async/await
- Validación automática con Pydantic
- Documentación automática (OpenAPI)
- Type hints nativos
- Mejor performance que Flask

### ADR-002: PostgreSQL sobre MongoDB

**Contexto:** Elegir base de datos para el sistema.

**Decisión:** Usar PostgreSQL.

**Razones:**
- Relaciones claras entre entidades (users → boards → lists → cards)
- Garantías ACID necesarias para consistencia
- Soporte para transacciones complejas
- Mejor para reportes con agregaciones SQL

### ADR-003: JWT sobre Sessions

**Contexto:** Mecanismo de autenticación.

**Decisión:** Usar JWT con tokens de acceso y refresh.

**Razones:**
- Stateless (no requiere almacenamiento en servidor)
- Escalable horizontalmente
- Compatible con arquitecturas distribuidas
- Fácil integración con frontend SPA

---

## Conclusión

La arquitectura de NeoCare está diseñada para ser:

✅ **Mantenible** - Código limpio y bien organizado  
✅ **Escalable** - Fácil de escalar horizontal y verticalmente  
✅ **Segura** - Múltiples capas de seguridad  
✅ **Testeable** - Separación clara de responsabilidades  
✅ **Documentada** - Swagger UI y documentación extensa  

El sistema está listo para producción y preparado para crecer según las necesidades del negocio.
