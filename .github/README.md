# 🔄 GitHub Actions - T4 Traveling

Este directorio contiene los flujos de trabajo (workflows) automatizados para CI/CD del proyecto T4 Traveling.

## 📋 Workflows Disponibles

### 1️⃣ CI/CD Pipeline (`ci.yml`)

**Trigger:** Push o Pull Request a `main` o `develop`

**Descripción:** Pipeline completo de integración y entrega continua que verifica la calidad del código en cada commit.

**Jobs incluidos:**
- ✅ **Frontend Build & Test**
  - Instalación de dependencias (Node.js 20.x)
  - Ejecución de tests con Vitest
  - Build de producción con Angular
  - Verificación del tamaño del bundle
  - Generación de artefactos

- ✅ **Backend Build & Test**
  - Configuración de Java 21
  - Build con Maven
  - Ejecución de tests
  - Empaquetado JAR
  - Generación de artefactos

- ✅ **Análisis de Calidad**
  - Estadísticas del proyecto
  - Líneas de código
  - Estructura de archivos

- ✅ **Notificación de Éxito**
  - Resumen del pipeline
  - Confirmación de builds exitosos

**Duración estimada:** 3-5 minutos

---

### 2️⃣ Deploy to Render (`deploy.yml`)

**Trigger:** Push a `main` o ejecución manual

**Descripción:** Inicia el proceso de despliegue automático en Render.

**Jobs incluidos:**
- 🚀 **Deploy to Production**
  - Notificación de inicio de deploy
  - Información de configuración
  - URLs de producción

- 🔍 **Verificar Deploy**
  - Health check del sitio
  - Verificación de disponibilidad
  - Estado del despliegue

**Duración estimada:** 1-2 minutos (+ tiempo de Render: 5-10 min)

**URLs de Producción:**
- Frontend: https://proyecto-final-t4traveling.onrender.com
- Backend: Configurado en Render Dashboard

---

### 3️⃣ Code Quality & Accessibility (`quality.yml`)

**Trigger:** Pull Request o ejecución manual

**Descripción:** Análisis profundo de calidad de código y accesibilidad web.

**Jobs incluidos:**
- ♿ **Verificar Accesibilidad**
  - Análisis de HTML semántico (`<header>`, `<nav>`, `<main>`, `<section>`, etc.)
  - Verificación de atributos ARIA
  - Comprobación de imágenes con `alt`
  - Roles y landmarks

- 🔒 **Análisis de Seguridad**
  - Audit de dependencias npm
  - Verificación de vulnerabilidades
  - Análisis de dependencias Maven

- 📊 **Métricas del Proyecto**
  - Conteo de componentes
  - Líneas de código por tecnología
  - Estadísticas de tests
  - Cobertura de documentación

- 📋 **Reporte de Calidad**
  - Resumen consolidado
  - Estado de verificaciones
  - Aprobación para merge

**Duración estimada:** 2-3 minutos

---

## 🚀 Cómo Usar los Workflows

### Ejecución Automática

Los workflows se ejecutan automáticamente según sus triggers:

```bash
# Ejecuta ci.yml
git push origin develop

# Ejecuta deploy.yml
git push origin main

# Ejecuta quality.yml
# Crear un Pull Request en GitHub
```

### Ejecución Manual

Puedes ejecutar workflows manualmente desde GitHub:

1. Ve a **Actions** en tu repositorio
2. Selecciona el workflow deseado
3. Click en **Run workflow**
4. Selecciona la rama
5. Click en **Run workflow**

---

## 📊 Badges para README

Añade estos badges a tu README principal:

```markdown
[![CI/CD](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/ci.yml/badge.svg)](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/ci.yml)
[![Deploy](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/deploy.yml/badge.svg)](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/deploy.yml)
[![Quality](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/quality.yml/badge.svg)](https://github.com/tu-usuario/Proyecto-final-T4traveling/actions/workflows/quality.yml)
```

---

## 🔧 Configuración Requerida

### Variables de Entorno (Secrets)

Si necesitas configurar secrets para los workflows:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en **New repository secret**
3. Añade los siguientes secrets si son necesarios:

```
RENDER_API_KEY (opcional, para deploy automático)
SONAR_TOKEN (opcional, para análisis de código)
```

### Permisos

Asegúrate de que GitHub Actions tiene permisos para:
- ✅ Leer el código del repositorio
- ✅ Crear artefactos
- ✅ Comentar en Pull Requests (opcional)

---

## 📈 Monitoreo de Workflows

### Ver el Estado

1. Ve a la pestaña **Actions** en GitHub
2. Verás todos los workflows ejecutándose
3. Click en cualquiera para ver detalles

### Logs Detallados

- Cada job tiene logs detallados
- Puedes descargar logs para análisis offline
- Los artefactos se guardan por 7 días

### Notificaciones

GitHub enviará notificaciones por:
- ✅ Workflows exitosos
- ❌ Workflows fallidos
- ⚠️ Warnings importantes

---

## 🛠️ Mantenimiento

### Actualizar Versiones

Para actualizar las versiones de Node.js o Java:

```yaml
# En ci.yml, cambiar:
strategy:
  matrix:
    node-version: [20.x]  # Actualizar aquí
    java-version: [21]     # Actualizar aquí
```

### Añadir Nuevos Tests

Los workflows detectarán automáticamente nuevos tests si sigues las convenciones:
- Frontend: `*.spec.ts`
- Backend: `*Test.java`

### Optimización

Para reducir el tiempo de ejecución:
- Usa cache de dependencias (ya configurado)
- Ejecuta jobs en paralelo
- Skip tests en builds de documentación

---

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Angular CI Best Practices](https://angular.io/guide/deployment)
- [Maven CI/CD Guide](https://maven.apache.org/guides/mini/guide-using-ci-systems.html)
- [Render Deploy Docs](https://render.com/docs/deploy-node-express-app)

---

## 🎯 Próximas Mejoras

- [ ] Añadir análisis de código con SonarQube
- [ ] Implementar tests E2E con Playwright
- [ ] Configurar notificaciones a Slack/Discord
- [ ] Añadir análisis de performance con Lighthouse
- [ ] Implementar semantic release automático

---

## 💡 Tips

1. **Verifica los logs** si un workflow falla
2. **Usa workflow_dispatch** para testing manual
3. **Mantén los workflows simples** y modulares
4. **Documenta cambios** en este README
5. **Revisa regularmente** las actualizaciones de actions

---

**Última actualización:** 2026-02-16
**Mantenido por:** Equipo T4 Traveling
