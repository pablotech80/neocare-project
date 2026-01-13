# 🚀 Guía de Despliegue - NeoCare

## Índice

1. [Requisitos Pre-Despliegue](#requisitos-pre-despliegue)
2. [Checklist de Seguridad](#checklist-de-seguridad)
3. [Configuración de Producción](#configuración-de-producción)
4. [Despliegue en Render](#despliegue-en-render)
5. [Despliegue en Railway](#despliegue-en-railway)
6. [Despliegue en AWS](#despliegue-en-aws)
7. [Despliegue del Frontend](#despliegue-del-frontend)
8. [Configuración de Base de Datos](#configuración-de-base-de-datos)
9. [CI/CD con GitHub Actions](#cicd-con-github-actions)
10. [Monitoreo y Logs](#monitoreo-y-logs)
11. [Backup y Recuperación](#backup-y-recuperación)
12. [Troubleshooting](#troubleshooting)

---

## Requisitos Pre-Despliegue

### Checklist General

- [ ] Código testeado y funcionando en local
- [ ] Todas las dependencias documentadas
- [ ] Variables de entorno configuradas
- [ ] Base de datos lista en producción
- [ ] Migraciones ejecutadas
- [ ] Dominio registrado (opcional)
- [ ] Certificado SSL configurado
- [ ] Logs centralizados configurados
- [ ] Monitoreo configurado
- [ ] Backup automático configurado

### Herramientas Necesarias

- **Git:** Control de versiones
- **Docker:** (Opcional) Containerización
- **PostgreSQL Client:** Para gestionar BD
- **Node.js/npm:** Para build del frontend
- **Python 3.9+:** Para backend
- **CLI del proveedor:** Render, Railway, AWS, etc.

---

## Checklist de Seguridad

### Backend

- [ ] `SECRET_KEY` generado con `openssl rand -hex 32`
- [ ] `SECRET_KEY` almacenado en secrets manager (no en .env versionado)
- [ ] `BCRYPT_ROUNDS` incrementado a 14-16
- [ ] `ENVIRONMENT=production` configurado
- [ ] `CORS_ORIGINS` limitado a dominios específicos
- [ ] Rate limiting robusto implementado
- [ ] HTTPS obligatorio (no HTTP)
- [ ] Headers de seguridad configurados
- [ ] SQL injection prevenido (ORM con parámetros)
- [ ] XSS prevenido (validación de inputs)
- [ ] Logs de eventos de seguridad activos
- [ ] Acceso SSH limitado por IP (si aplica)
- [ ] Firewall configurado
- [ ] Base de datos con credenciales fuertes
- [ ] Backups automáticos configurados

### Frontend

- [ ] Variables de API URL configuradas para producción
- [ ] Build de producción optimizado (`npm run build`)
- [ ] Source maps deshabilitados en producción
- [ ] Tokens JWT en httpOnly cookies (recomendado)
- [ ] CSP (Content Security Policy) headers configurados
- [ ] HTTPS obligatorio
- [ ] Vulnerabilidades de npm auditadas (`npm audit`)

---

## Configuración de Producción

### Variables de Entorno

Crear archivo `.env.production` (NO versionarlo):

```bash
# Database - PostgreSQL en producción
DATABASE_URL=postgresql://user:password@host:5432/dbname

# JWT Configuration - Usar SECRET_KEY fuerte
SECRET_KEY=usar-openssl-rand-hex-32-para-generar-clave-segura-de-64-caracteres
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60
REFRESH_TOKEN_EXPIRE_DAYS=7

# Security - Incrementar rounds en producción
BCRYPT_ROUNDS=14

# CORS - Solo dominios permitidos
CORS_ORIGINS=https://neocare.vercel.app,https://www.neocare.com

# Environment
ENVIRONMENT=production

# Logging
LOG_LEVEL=INFO
LOG_FILE=/var/log/neocare/app.log

# Optional: Sentry, NewRelic, etc.
SENTRY_DSN=https://your-sentry-dsn
```

### Generar SECRET_KEY Seguro

```bash
# Generar clave de 32 bytes (64 caracteres hex)
openssl rand -hex 32

# Ejemplo de salida:
# 5f8d7e6a9c2b1f4e8d3a7c5b9e2f1d8a4c6e9f2b5d8a1c4e7f9b2d5a8c1e4f7a
```

### Backend - Preparar para Producción

```bash
# 1. Instalar dependencias de producción
pip install -r requirements.txt

# 2. Ejecutar migraciones
cd backend
alembic upgrade head

# 3. Ejecutar con múltiples workers (Gunicorn)
pip install gunicorn

gunicorn backend.main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --access-logfile /var/log/neocare/access.log \
  --error-logfile /var/log/neocare/error.log
```

### Frontend - Build de Producción

```bash
cd frontend

# 1. Instalar dependencias
npm install

# 2. Build optimizado
npm run build

# 3. Los archivos están en frontend/dist/
# Subir a CDN o servidor estático
```

---

## Despliegue en Render

[Render](https://render.com) es una plataforma moderna y fácil de usar.

### Backend en Render

1. **Crear cuenta en Render.com**

2. **Crear PostgreSQL Database**
   - Dashboard → New → PostgreSQL
   - Nombre: `neocare-db`
   - Plan: Free o Starter
   - Copiar `DATABASE_URL` (Internal)

3. **Crear Web Service para Backend**
   - Dashboard → New → Web Service
   - Conectar repositorio de GitHub
   - Configuración:
     ```
     Name: neocare-backend
     Environment: Python 3
     Build Command: pip install -r requirements.txt
     Start Command: gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
     ```

4. **Configurar Variables de Entorno**
   - En el dashboard del Web Service → Environment
   - Agregar todas las variables del `.env.production`
   - `DATABASE_URL`: Copiar de la BD creada
   - `SECRET_KEY`: Generar nuevo con `openssl rand -hex 32`
   - `CORS_ORIGINS`: URL del frontend en Vercel

5. **Ejecutar Migraciones**
   - Render → Shell
   ```bash
   cd backend
   alembic upgrade head
   ```

6. **Deploy**
   - Render despliega automáticamente al hacer push a la rama main

**URL del Backend:** `https://neocare-backend.onrender.com`

### Frontend en Vercel

1. **Crear cuenta en Vercel.com**

2. **Importar proyecto**
   - New Project → Import Git Repository
   - Seleccionar repositorio

3. **Configurar Build**
   ```
   Framework Preset: Vite
   Root Directory: frontend
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Variables de Entorno**
   ```
   VITE_API_URL=https://neocare-backend.onrender.com
   ```

5. **Deploy**
   - Vercel despliega automáticamente

**URL del Frontend:** `https://neocare.vercel.app`

---

## Despliegue en Railway

[Railway](https://railway.app) ofrece despliegue sencillo con PostgreSQL incluido.

### Paso a Paso

1. **Crear cuenta en Railway.app**

2. **Nuevo Proyecto**
   - New Project → Deploy from GitHub repo
   - Seleccionar repositorio

3. **Agregar PostgreSQL**
   - Add Plugin → PostgreSQL
   - Railway crea la BD automáticamente
   - Variable `DATABASE_URL` se inyecta automáticamente

4. **Configurar Backend Service**
   - Settings → Root Directory: `/`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: 
     ```
     cd backend && alembic upgrade head && cd .. && gunicorn backend.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:$PORT
     ```

5. **Variables de Entorno**
   - Variables → Add variables
   - Agregar todas menos `DATABASE_URL` (ya existe)

6. **Generar Dominio**
   - Settings → Generate Domain
   - O configurar dominio custom

**URL:** `https://neocare-production.up.railway.app`

---

## Despliegue en AWS

### Arquitectura AWS

```
┌─────────────────────────────────────────────────────┐
│                   Route 53 (DNS)                    │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│          CloudFront (CDN) + S3 (Frontend)           │
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│      Application Load Balancer (ALB)                │
└────────┬───────────────────────────────┬────────────┘
         │                               │
┌────────▼─────────┐          ┌─────────▼──────────┐
│   ECS/Fargate    │          │   ECS/Fargate      │
│  (Backend App)   │          │  (Backend App)     │
│   Container 1    │          │   Container 2      │
└────────┬─────────┘          └─────────┬──────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
              ┌──────────▼──────────┐
              │   RDS PostgreSQL    │
              │   (Multi-AZ)        │
              └─────────────────────┘
```

### Backend con ECS Fargate

1. **Crear Dockerfile**

```dockerfile
# Dockerfile
FROM python:3.9-slim

WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copiar requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install gunicorn

# Copiar código
COPY . .

# Exponer puerto
EXPOSE 8000

# Comando de inicio
CMD ["gunicorn", "backend.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000", \
     "--timeout", "120"]
```

2. **Build y Push a ECR**

```bash
# Autenticar con ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.us-east-1.amazonaws.com

# Build imagen
docker build -t neocare-backend .

# Tag imagen
docker tag neocare-backend:latest \
  123456789012.dkr.ecr.us-east-1.amazonaws.com/neocare-backend:latest

# Push a ECR
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/neocare-backend:latest
```

3. **Crear RDS PostgreSQL**

```bash
# Usando AWS CLI
aws rds create-db-instance \
  --db-instance-identifier neocare-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 14.7 \
  --master-username neocare_admin \
  --master-user-password YOUR_SECURE_PASSWORD \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxx \
  --db-subnet-group-name default \
  --backup-retention-period 7 \
  --multi-az
```

4. **Crear ECS Task Definition**

```json
{
  "family": "neocare-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "neocare-backend",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/neocare-backend:latest",
      "portMappings": [
        {
          "containerPort": 8000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "ENVIRONMENT",
          "value": "production"
        },
        {
          "name": "CORS_ORIGINS",
          "value": "https://neocare.com"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:neocare/database-url"
        },
        {
          "name": "SECRET_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:123456789012:secret:neocare/jwt-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/neocare-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

5. **Crear ECS Service con ALB**

```bash
aws ecs create-service \
  --cluster neocare-cluster \
  --service-name neocare-backend \
  --task-definition neocare-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=neocare-backend,containerPort=8000"
```

### Frontend con S3 + CloudFront

1. **Build del Frontend**

```bash
cd frontend
npm run build
```

2. **Crear Bucket S3**

```bash
aws s3 mb s3://neocare-frontend --region us-east-1

# Configurar como website
aws s3 website s3://neocare-frontend \
  --index-document index.html \
  --error-document index.html
```

3. **Subir archivos**

```bash
aws s3 sync dist/ s3://neocare-frontend --delete
```

4. **Crear distribución CloudFront**

```bash
aws cloudfront create-distribution \
  --origin-domain-name neocare-frontend.s3.amazonaws.com \
  --default-root-object index.html
```

5. **Configurar Route 53 (DNS)**

```bash
# Crear registro A apuntando a CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id Z1234567890ABC \
  --change-batch file://dns-record.json
```

---

## Configuración de Base de Datos

### PostgreSQL en Producción

#### Render PostgreSQL

```bash
# Conectar a BD
psql postgres://user:pass@host.render.com/dbname

# Ejecutar migraciones
alembic upgrade head

# Crear índices adicionales
CREATE INDEX idx_worklogs_user_date ON worklogs(user_id, date);
CREATE INDEX idx_cards_list_status ON cards(list_id, status);
```

#### AWS RDS PostgreSQL

**Configuración recomendada:**
- **Clase de instancia:** db.t3.small o superior
- **Storage:** 20 GB (SSD gp3)
- **Multi-AZ:** Sí (para alta disponibilidad)
- **Backup retention:** 7-30 días
- **Encryption:** Habilitado
- **Enhanced monitoring:** Habilitado

**Crear usuario para la app:**

```sql
-- Conectar como master user
CREATE USER neocare_app WITH PASSWORD 'secure_password_here';
GRANT ALL PRIVILEGES ON DATABASE neocare TO neocare_app;

-- Conectar a la BD neocare
\c neocare

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO neocare_app;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO neocare_app;
```

### Configurar Connection Pooling

```python
# backend/core/config.py
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,              # Número de conexiones en el pool
    max_overflow=20,           # Conexiones adicionales si pool lleno
    pool_timeout=30,           # Timeout para obtener conexión
    pool_recycle=3600,         # Reciclar conexiones cada hora
    pool_pre_ping=True,        # Verificar conexión antes de usar
    echo=False                 # No logear SQL queries en prod
)
```

---

## CI/CD con GitHub Actions

### Workflow de CI/CD

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: test
          POSTGRES_DB: neocare_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest pytest-cov
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:test@localhost:5432/neocare_test
          SECRET_KEY: test-secret-key-for-ci
        run: |
          pytest --cov=backend --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Render
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
          RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
        run: |
          curl -X POST \
            "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
            -H "Authorization: Bearer $RENDER_API_KEY"

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Build frontend
        run: |
          cd frontend
          npm install
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

### Secrets en GitHub

Configurar en: `Repositorio → Settings → Secrets and variables → Actions`

- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

---

## Monitoreo y Logs

### Logging Centralizado

#### Opción 1: Sentry (Recomendado)

```bash
pip install sentry-sdk
```

```python
# backend/main.py
import sentry_sdk
from sentry_sdk.integrations.fastapi import FastApiIntegration

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    integrations=[FastApiIntegration()],
    traces_sample_rate=1.0,
    environment=os.getenv("ENVIRONMENT", "production")
)
```

#### Opción 2: AWS CloudWatch

```python
# backend/core/logging_config.py
import watchtower

logger = logging.getLogger(__name__)
logger.addHandler(watchtower.CloudWatchLogHandler(
    log_group='/neocare/backend',
    stream_name='{machine_name}/{program_name}/{logger_name}'
))
```

### Métricas y Alertas

#### Prometheus + Grafana

```python
# Instalar
pip install prometheus-fastapi-instrumentator

# backend/main.py
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()
Instrumentator().instrument(app).expose(app)
```

#### Configurar Alertas

**Ejemplo: Alert de alta latencia**
```yaml
groups:
  - name: neocare_alerts
    rules:
      - alert: HighLatency
        expr: http_request_duration_seconds{quantile="0.95"} > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High latency detected"
```

---

## Backup y Recuperación

### Backup Automático de Base de Datos

#### Script de Backup

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/backups"
DB_NAME="neocare"

# Backup con pg_dump
pg_dump $DATABASE_URL > $BACKUP_DIR/neocare_$DATE.sql

# Comprimir
gzip $BACKUP_DIR/neocare_$DATE.sql

# Subir a S3
aws s3 cp $BACKUP_DIR/neocare_$DATE.sql.gz \
  s3://neocare-backups/db/

# Eliminar backups locales mayores a 7 días
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete

# Eliminar backups en S3 mayores a 30 días
aws s3 ls s3://neocare-backups/db/ | \
  awk '{if ($1 < "'$(date -d '30 days ago' +%Y-%m-%d)'") print $4}' | \
  xargs -I {} aws s3 rm s3://neocare-backups/db/{}
```

#### Cron Job para Backup Diario

```bash
# crontab -e
0 2 * * * /usr/local/bin/backup-db.sh >> /var/log/backup.log 2>&1
```

#### AWS RDS Automated Backups

- Habilitar en RDS Console → Automated backups
- Retention period: 7-30 días
- Backup window: Durante horas de baja actividad

### Recuperación de Desastres

#### Restaurar desde Backup

```bash
# Descargar backup
aws s3 cp s3://neocare-backups/db/neocare_20260113.sql.gz .

# Descomprimir
gunzip neocare_20260113.sql.gz

# Restaurar
psql $DATABASE_URL < neocare_20260113.sql
```

#### Plan de Recuperación (RTO/RPO)

- **RTO (Recovery Time Objective):** 2 horas
- **RPO (Recovery Point Objective):** 24 horas (backups diarios)
- **Pasos de recuperación documentados**
- **Simulacros trimestrales**

---

## Troubleshooting

### Problema: Backend no inicia

**Síntomas:** Error 500 o servicio no disponible

**Diagnóstico:**
```bash
# Ver logs del servidor
tail -f /var/log/neocare/error.log

# Verificar conexión a BD
psql $DATABASE_URL -c "SELECT 1"

# Verificar variables de entorno
env | grep DATABASE_URL
env | grep SECRET_KEY
```

**Soluciones:**
1. Verificar que `DATABASE_URL` sea correcto
2. Verificar que todas las migraciones estén aplicadas
3. Verificar que el puerto 8000 esté disponible
4. Revisar permisos de archivos de log

---

### Problema: Alta latencia en API

**Síntomas:** Requests lentas (>2 segundos)

**Diagnóstico:**
```bash
# Ver queries lentas en PostgreSQL
psql $DATABASE_URL -c "
SELECT query, calls, total_time/calls as avg_time
FROM pg_stat_statements
ORDER BY avg_time DESC
LIMIT 10;
"

# Monitorear conexiones
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"
```

**Soluciones:**
1. Agregar índices a tablas grandes
2. Incrementar pool de conexiones
3. Implementar caché con Redis
4. Optimizar queries SQL

---

### Problema: Errores de CORS

**Síntomas:** Requests bloqueadas desde frontend

**Diagnóstico:**
```bash
# Verificar CORS_ORIGINS
echo $CORS_ORIGINS

# Ver headers en response
curl -I https://api.neocare.com/health/
```

**Soluciones:**
1. Agregar URL del frontend a `CORS_ORIGINS`
2. Verificar que incluya protocolo (https://)
3. No incluir trailing slash
4. Reiniciar servicio después de cambiar

---

## Comandos Útiles

### Gestión de Base de Datos

```bash
# Conectar a BD
psql $DATABASE_URL

# Ver tablas
\dt

# Ver tamaño de BD
SELECT pg_size_pretty(pg_database_size('neocare'));

# Ver conexiones activas
SELECT * FROM pg_stat_activity WHERE datname = 'neocare';

# Matar conexión específica
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE pid = 12345;

# Vacuum (optimizar)
VACUUM ANALYZE;
```

### Monitoreo de Logs

```bash
# Logs en tiempo real
tail -f /var/log/neocare/app.log

# Buscar errores
grep ERROR /var/log/neocare/app.log | tail -20

# Buscar requests lentas
grep "Time: [2-9]\." /var/log/neocare/app.log
```

---

## Resumen de Costos Estimados

### Opción 1: Render + Vercel (Más sencillo)

- **Backend (Render):** $7-25/mes
- **Database (Render):** $7-25/mes
- **Frontend (Vercel):** $0-20/mes
- **Total:** ~$14-70/mes

### Opción 2: Railway (Todo en uno)

- **Backend + Database + Frontend:** $10-30/mes
- **Total:** ~$10-30/mes

### Opción 3: AWS (Más escalable)

- **ECS Fargate (2 tasks):** ~$30/mes
- **RDS PostgreSQL (t3.micro):** ~$15/mes
- **S3 + CloudFront:** ~$5/mes
- **ALB:** ~$20/mes
- **Total:** ~$70-100/mes

---

## Checklist Final Pre-Lanzamiento

- [ ] Todos los tests pasan
- [ ] Variables de entorno configuradas en producción
- [ ] Migraciones ejecutadas
- [ ] SECRET_KEY generado y seguro
- [ ] CORS configurado correctamente
- [ ] HTTPS habilitado
- [ ] Rate limiting activo
- [ ] Logs centralizados funcionando
- [ ] Monitoreo configurado
- [ ] Backups automáticos activos
- [ ] Documentación actualizada
- [ ] Equipo entrenado en procedimientos
- [ ] Plan de rollback definido
- [ ] Contactos de emergencia documentados

---

**¡Listo para producción!** 🚀

Para soporte post-despliegue, contactar al equipo de DevOps o revisar la documentación en `/docs`.
