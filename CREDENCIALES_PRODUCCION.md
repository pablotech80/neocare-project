# 🔐 Credenciales de Producción - NeoCare

## Credenciales Definidas para Presentación

**Para login:**

- **Email:** `neocare@neocare.com`
- **Contraseña:** `team_sigma`

---

## Crear Usuario en Producción

### Opción 1: Usando Swagger UI

1. Ir a: `https://tu-dominio.com/docs` (o `http://localhost:8000/docs` en local)
2. Buscar **POST /auth/register**
3. Click "Try it out"
4. Usar el siguiente JSON:

```json
{
  "username": "neocare",
  "email": "neocare@neocare.com",
  "password": "team_sigma"
}
```

5. Click "Execute"

---

### Opción 2: Usando cURL

```bash
curl -X POST https://tu-dominio.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "neocare",
    "email": "neocare@neocare.com",
    "password": "team_sigma"
  }'
```

---

### Opción 3: Desde el Frontend

1. Ir a la página de registro
2. Completar el formulario con cualquier username y:
   - **Email:** `neocare@neocare.com`
   - **Contraseña:** `team_sigma`
3. Click en "Registrar"

---

## Login en el Sistema

Una vez creado el usuario, hacer login con:

- **Email:** `neocare@neocare.com`
- **Contraseña:** `team_sigma`

---

## Notas de Seguridad

⚠️ **IMPORTANTE:** 

- Estas credenciales son para **demostración/presentación de prácticas**
- **NO usar en producción real** sin cambiar la contraseña
- Para producción real, usar contraseñas más seguras (mínimo 12 caracteres, mayúsculas, minúsculas, números y símbolos)

---

**Fecha de creación:** 13 de Enero, 2026  
**Proyecto:** NeoCare - Presentación de Prácticas Profesionales
