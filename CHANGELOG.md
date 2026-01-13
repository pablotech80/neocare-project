# Changelog

Todos los cambios notables en el proyecto NeoCare serán documentados en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/lang/es/).

---

## [1.0.0] - 2026-01-13

### 🎉 Lanzamiento Inicial

Primera versión estable del sistema NeoCare lista para producción.

### ✨ Características Principales

#### Autenticación y Seguridad
- Registro y login de usuarios con validación
- Autenticación JWT con tokens de acceso y refresh
- Hashing seguro de contraseñas con bcrypt (12 rounds)
- Control de acceso basado en ownership de recursos
- Protección contra IDOR (Insecure Direct Object Reference)
- CORS configurado para múltiples orígenes
- Rate limiting básico (100 req/min por IP)

#### Gestión de Proyectos
- CRUD completo de tableros (boards) por usuario
- CRUD completo de listas/columnas en tableros
- CRUD completo de tarjetas (cards) con estados
- Estados de tarjetas: todo, in_progress, done
- Ordenamiento de tarjetas con drag & drop
- Validaciones robustas con Pydantic

#### Sistema de Worklogs
- Registro de horas trabajadas por tarjeta
- Validaciones de fecha (no futura) y horas (> 0)
- Notas descriptivas de hasta 200 caracteres
- Solo el autor puede editar/eliminar sus worklogs
- Consulta de worklogs semanales por usuario
- Auditoría con timestamps de creación y actualización

#### Sistema de Reportes
- Resumen semanal de tarjetas (completadas, vencidas, nuevas)
- Reporte de horas trabajadas por usuario
- Reporte de horas trabajadas por tarjeta
- Filtrado por semana en formato ISO 8601 (YYYY-WW)
- Consultas SQL optimizadas con agregaciones

#### Monitoring y Operaciones
- Health checks de API y base de datos
- Logging estructurado de eventos de seguridad
- Logging de intentos de autenticación
- Métricas de tiempo de procesamiento
- Logs rotativos por fecha
- Middleware de logging para todas las requests

#### Frontend
- Aplicación SPA con React 19 + TypeScript
- Interfaz Kanban con drag & drop (@dnd-kit)
- Estilos modernos con TailwindCSS 4
- Routing con React Router DOM 7
- Context API para gestión de estado
- Cliente HTTP con Axios e interceptores JWT
- Validaciones de formularios
- Manejo de errores visual

### 🛠️ Mejoras Técnicas

#### Backend
- FastAPI 0.104.1 con documentación OpenAPI automática
- SQLAlchemy 2.0.23 como ORM
- Alembic 1.13.0 para migraciones
- Pydantic 2.5.0 para validación de datos
- PostgreSQL 12+ como base de datos principal
- Uvicorn 0.24.0 como servidor ASGI
- Estructura modular y escalable
- Separation of concerns (core, models, routers, schemas)

#### Frontend
- React 19.2.0 con Hooks modernos
- Vite 7.2.4 como build tool (HMR rápido)
- TypeScript 5.9.3 para type safety
- TailwindCSS 4.1.18 con utilidades modernas
- Lucide React 0.561.0 para iconografía
- Axios 1.13.2 con interceptores de autenticación
- Componentes reutilizables y modulares

#### Base de Datos
- Modelo relacional normalizado
- Índices en foreign keys para optimización
- Cascade deletes para integridad referencial
- Constraints para validación a nivel de BD
- Connection pooling configurado
- Timestamps automáticos en auditoría

#### DevOps
- Makefile con comandos útiles
- Variables de entorno con .env
- Archivo env.example como plantilla
- .gitignore completo
- Migraciones versionadas con Alembic
- Documentación completa en /docs

### 📝 Documentación

- README.md profesional con badges y estructura clara
- Documentación de arquitectura (ARCHITECTURE.md)
- Documentación completa de API (API.md)
- Guía de despliegue (DEPLOYMENT.md)
- README específico del backend
- Estado del frontend documentado
- Este CHANGELOG.md

### 🔒 Seguridad

- Todas las contraseñas hasheadas con bcrypt
- JWT con expiración configurable
- Refresh tokens para renovación segura
- Validación de ownership en todos los endpoints
- Prevención de SQL injection con ORM
- Validación de inputs con Pydantic
- Headers de seguridad en responses
- Logging de eventos de seguridad
- CORS restringido a orígenes permitidos

### 📊 Testing

- Health checks implementados
- Validaciones de datos exhaustivas
- Testing manual con Postman/Thunder Client
- Casos de uso probados:
  - Registro y login de usuarios
  - CRUD completo de todos los recursos
  - Registro y consulta de worklogs
  - Generación de reportes semanales
  - Validaciones de seguridad
  - Manejo de errores

---

## [0.4.0] - Semana 4 (Enero 2026)

### ✨ Agregado

#### Sistema de Reportes Semanales
- Endpoint de resumen semanal de tarjetas
- Endpoint de horas trabajadas por usuario
- Endpoint de horas trabajadas por tarjeta
- Filtrado por semana en formato ISO
- Consultas SQL optimizadas con agregaciones
- Validación de ownership de tableros

### 🔧 Mejorado
- Optimización de queries con JOIN y GROUP BY
- Formato de semana estándar ISO 8601
- Cálculos de semana lunes-domingo
- Retorno de arrays vacíos si no hay datos

### 📝 Documentado
- Acta semanal S4 (ACTA_SEMANAL_S4.md)
- Mini demo de funcionalidades S4
- Vista de "Mis Horas" (VISTA MIS_HORAS_S4.md)

---

## [0.3.0] - Semana 3 (Enero 2026)

### ✨ Agregado

#### Sistema de Worklogs
- Modelo de base de datos para worklogs
- Endpoints CRUD para worklogs
- Validaciones de fecha y horas
- Restricción de edición solo al autor
- Consulta de worklogs semanales por usuario
- Timestamps de auditoría

### 🛠️ Técnico
- Migración de Alembic para tabla worklogs
- Índices en card_id, user_id y date
- Relaciones FK con cards y users
- Check constraint para hours > 0

### 📝 Documentado
- Informe de testing S3 (PDF)
- Especificación completa de worklogs
- Ejemplos de payloads y responses

---

## [0.2.0] - Semana 2 (Diciembre 2025)

### ✨ Agregado

#### Backend API
- Endpoints de autenticación (register, login, refresh)
- Endpoints CRUD de boards
- Endpoints CRUD de lists
- Endpoints CRUD de cards
- Validaciones con Pydantic
- JWT con access y refresh tokens

#### Frontend React
- Páginas de Login y Register
- Dashboard de tableros
- Vista Kanban con listas y tarjetas
- Drag & drop de tarjetas
- Modales para crear/editar tarjetas
- Context API para autenticación
- Rutas protegidas

### 🔧 Mejorado
- Sistema de logging estructurado
- Middleware de tiempo de procesamiento
- Health checks de API y BD
- CORS configurado correctamente

### 📝 Documentado
- Acta semanal S2 (ACTA_SEMANAL_S2.md)
- README del frontend
- Estructura del proyecto

---

## [0.1.0] - Semana 1 (Diciembre 2025)

### 🎉 Inicio del Proyecto

#### Setup Inicial
- Inicialización del repositorio Git
- Estructura de monorepo (backend + frontend)
- Configuración de PostgreSQL
- Setup de FastAPI con SQLAlchemy
- Setup de React con Vite y TypeScript
- Modelos de base de datos iniciales (User, Board, List, Card)
- Migraciones con Alembic

#### Infraestructura
- Variables de entorno con python-dotenv
- Makefile con comandos útiles
- .gitignore configurado
- env.example como plantilla
- Requirements.txt con dependencias Python
- package.json con dependencias Node

### 📝 Documentado
- README inicial del proyecto
- Instrucciones básicas de instalación

---

## Tipos de Cambios

- ✨ **Agregado** - Nuevas características
- 🔧 **Mejorado** - Mejoras en características existentes
- 🐛 **Corregido** - Corrección de bugs
- 🔒 **Seguridad** - Mejoras de seguridad
- 📝 **Documentado** - Cambios en documentación
- 🗑️ **Eliminado** - Características eliminadas
- ⚠️ **Deprecado** - Características que se eliminarán pronto

---

## Roadmap Futuro

### [1.1.0] - Próximo Release

#### Planificado
- [ ] Sistema de notificaciones en tiempo real (WebSockets)
- [ ] Comentarios en tarjetas
- [ ] Etiquetas y categorías para tarjetas
- [ ] Adjuntos de archivos en tarjetas
- [ ] Filtros avanzados en tableros
- [ ] Búsqueda global de tarjetas
- [ ] Exportación de reportes en PDF
- [ ] Integración con calendario (iCal)

### [1.2.0] - Q1 2026

#### Planificado
- [ ] Dashboard de métricas avanzadas
- [ ] Gráficos y visualizaciones
- [ ] Tests unitarios y de integración
- [ ] Tests E2E con Playwright
- [ ] CI/CD con GitHub Actions
- [ ] Caché con Redis
- [ ] Rate limiting robusto
- [ ] Modo offline con sincronización

### [2.0.0] - Q2 2026

#### Planificado
- [ ] App móvil con React Native
- [ ] Modo oscuro
- [ ] Internacionalización (i18n)
- [ ] Múltiples workspaces
- [ ] Permisos granulares por tablero
- [ ] Invitación de colaboradores
- [ ] Roles y permisos (admin, editor, viewer)

---

## Mantenedores

- **Equipo de Innovación NeoCare Health**
- Proyecto de prácticas profesionales

---

## Licencia

Propiedad de NeoCare Health. Todos los derechos reservados.

Para más información, ver el archivo [LICENSE](LICENSE) en la raíz del proyecto.

---

**Nota:** Para contribuir al proyecto, consultar [CONTRIBUTING.md](CONTRIBUTING.md).
