# Fase 5: Servicios y comunicación HTTP

## Descripción General

Esta fase implementa la comunicación HTTP entre el frontend Angular y el backend Spring Boot de T4Traveling. Se configuró `HttpClient` con interceptores para autenticación, manejo de errores y logging, además de servicios específicos para cada entidad del sistema.

## Estructura de Archivos Creados

```
frontend/src/
├── environments/
│   ├── environment.ts          # Configuración de desarrollo
│   └── environment.prod.ts     # Configuración de producción
├── app/
│   ├── models/
│   │   ├── api.models.ts       # Interfaces TypeScript para la API
│   │   └── index.ts            # Barrel export
│   ├── interceptors/
│   │   ├── auth.interceptor.ts     # Interceptor de autenticación
│   │   ├── error.interceptor.ts    # Interceptor de errores
│   │   ├── logging.interceptor.ts  # Interceptor de logging
│   │   └── index.ts                # Barrel export
│   ├── services/api/
│   │   ├── base-http.service.ts     # Servicio base HTTP
│   │   ├── destino-api.service.ts   # CRUD de destinos
│   │   ├── usuario-api.service.ts   # CRUD de usuarios
│   │   ├── reserva-api.service.ts   # CRUD de reservas
│   │   ├── transporte-api.service.ts # CRUD de transportes
│   │   └── index.ts                  # Barrel export
│   └── components/shared/
│       ├── loading-state/
│       ├── error-state/
│       └── empty-state/
```

## Configuración de HttpClient

### app.config.ts

Se configuró `provideHttpClient` con interceptores funcionales:

```typescript
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { authInterceptor, errorInterceptor, loggingInterceptor } from './interceptors';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... otros providers
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,  // Logging primero
        authInterceptor,     // Autenticación
        errorInterceptor     // Manejo de errores al final
      ])
    )
  ]
};
```

### Configuración de Entornos

**environment.ts (desarrollo):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  apiTimeout: 30000,
  enableLogging: true,
  retryAttempts: 3,
  retryDelay: 1000
};
```

## Interceptores HTTP

### 1. Auth Interceptor (auth.interceptor.ts)

Añade automáticamente el token JWT a las peticiones HTTP:

- Inyecta el header `Authorization: Bearer {token}`
- Excluye endpoints públicos (login, registro)
- Verifica si el usuario está autenticado antes de añadir el token

### 2. Error Interceptor (error.interceptor.ts)

Manejo centralizado de errores HTTP:

| Código | Acción |
|--------|--------|
| 0 | Error de conexión - Notificación al usuario |
| 400 | Bad Request - Mostrar mensaje de validación |
| 401 | Unauthorized - Logout y redirección a login |
| 403 | Forbidden - Redirección a página no autorizado |
| 404 | Not Found - Notificación al usuario |
| 409 | Conflict - Notificación de conflicto |
| 500+ | Server Error - Notificación de error del servidor |

### 3. Logging Interceptor (logging.interceptor.ts)

Logging de peticiones HTTP en desarrollo:

- Solo activo cuando `environment.enableLogging = true`
- Registra método, URL, tiempo de respuesta
- Muestra body de request y response
- Usa emojis para identificar tipos de respuesta

## Catálogo de Endpoints

### Destinos (`/api/destinos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los destinos |
| GET | `/:id` | Obtener destino por ID |
| GET | `/nombre/:nombre` | Obtener por nombre exacto |
| GET | `/buscar/:nombre` | Buscar por nombre (contiene) |
| GET | `/usuario/:id` | Destinos visitados por usuario |
| POST | `/` | Crear nuevo destino |
| PUT | `/:id` | Actualizar destino |
| DELETE | `/:id` | Eliminar destino |
| GET | `/:id/tiene-reservas` | Verificar si tiene reservas |

### Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los usuarios |
| GET | `/:id` | Obtener usuario por ID |
| GET | `/email/:email` | Obtener por email |
| GET | `/nombre/:nombre` | Obtener por nombre |
| GET | `/ubicacion/:ubicacion` | Obtener por ubicación |
| POST | `/` | Crear nuevo usuario |
| PUT | `/:id` | Actualizar usuario |
| DELETE | `/:id` | Eliminar usuario |
| GET | `/:id/tiene-reservas` | Verificar reservas activas |
| GET | `/:id/contar-reservas` | Contar reservas |

### Reservas (`/api/reservas`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todas las reservas |
| GET | `/:id` | Obtener reserva por ID |
| GET | `/usuario/:id` | Reservas por usuario |
| GET | `/destino/:id` | Reservas por destino |
| GET | `/fechas?inicio=&fin=` | Reservas por rango de fechas |
| GET | `/destino/:dId/usuario/:uId` | Reservas por destino y usuario |
| GET | `/usuario/:id/futuras` | Reservas futuras del usuario |
| GET | `/usuario/:id/pasadas` | Reservas pasadas del usuario |
| POST | `/` | Crear nueva reserva |
| PUT | `/:id` | Actualizar reserva |
| DELETE | `/:id` | Eliminar reserva |
| GET | `/usuario/:id/puede-reservar` | Verificar si puede reservar |
| GET | `/usuario/:id/contar-futuras` | Contar reservas futuras |

### Transportes (`/api/transportes`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/` | Obtener todos los transportes |
| GET | `/:id` | Obtener transporte por ID |
| GET | `/tipo/:tipo` | Obtener por tipo |
| GET | `/buscar-tipo/:tipo` | Buscar por tipo |
| GET | `/usuario/:id` | Transportes usados por usuario |
| GET | `/tipos-disponibles` | Tipos de transporte disponibles |
| POST | `/` | Crear nuevo transporte |
| PUT | `/:id` | Actualizar transporte |
| DELETE | `/:id` | Eliminar transporte |
| GET | `/:id/tiene-reservas` | Verificar si tiene reservas |

## Interfaces TypeScript (api.models.ts)

### Entidades Principales

```typescript
// Destino
interface Destino {
  id: number;
  nombre: string;
}

// Usuario
interface Usuario {
  id: number;
  nombre: string;
  ubicacion: string;
  email: string;
  password?: string;
}

// Transporte
type TipoTransporte = 'AVION' | 'AUTOBUS' | 'COCHE';

interface Transporte {
  id: number;
  tipo: TipoTransporte;
}

// Reserva
interface Reserva {
  id: number;
  usuario: Usuario;
  destino: Destino;
  transporte: Transporte;
  fecha: string; // ISO date (YYYY-MM-DD)
}
```

### DTOs de Request

```typescript
interface DestinoRequest {
  nombre: string;
}

interface UsuarioCreateRequest {
  nombre: string;
  ubicacion: string;
  email: string;
  password: string;
}

interface ReservaCreateRequest {
  usuario: { id: number };
  destino: { id: number };
  transporte: { id: number };
  fecha: string;
}
```

### Respuestas de API

```typescript
interface ApiError {
  error: string;
  message?: string;
  status?: number;
}

interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
```

## Servicio Base HTTP (base-http.service.ts)

### Características

- **Métodos CRUD genéricos tipados**: `get<T>`, `post<T>`, `put<T>`, `patch<T>`, `delete<T>`
- **Retry automático**: Reintenta peticiones fallidas según configuración
- **Timeout configurable**: Previene peticiones colgadas
- **Integración con LoadingService**: Muestra estado de carga automáticamente
- **Soporte FormData**: Para upload de archivos

### Opciones de Petición

```typescript
interface HttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  loadingKey?: string;      // Clave única para el estado de carga
  loadingMessage?: string;  // Mensaje mostrado durante la carga
  showLoading?: boolean;    // Habilitar/deshabilitar loading
  retryCount?: number;      // Número de reintentos
  timeoutMs?: number;       // Timeout en milisegundos
}
```

### Ejemplo de Uso

```typescript
// Inyectar el servicio
private destinoApi = inject(DestinoApiService);

// Obtener todos los destinos
this.destinoApi.getAll().subscribe({
  next: (destinos) => console.log(destinos),
  error: (err) => console.error(err)
});

// Crear un nuevo destino
this.destinoApi.create({ nombre: 'París' }).subscribe({
  next: (destino) => console.log('Creado:', destino),
  error: (err) => console.error(err)
});

// Buscar destinos
this.destinoApi.searchByNombre('Par').subscribe({
  next: (destinos) => console.log('Resultados:', destinos)
});
```

## Componentes de Estado UI

### LoadingStateComponent

Indicador de carga con soporte para modo overlay e inline:

```html
<!-- Inline -->
<app-loading-state message="Cargando destinos..." />

<!-- Overlay de pantalla completa -->
<app-loading-state [overlay]="true" message="Procesando..." />
```

### ErrorStateComponent

Muestra errores con opción de reintentar:

```html
<app-error-state
  title="Error al cargar datos"
  message="No se pudieron obtener los destinos"
  [showRetry]="true"
  (retry)="loadDestinos()"
/>
```

### EmptyStateComponent

Estado cuando no hay datos con iconos personalizables:

```html
<app-empty-state
  title="No hay destinos"
  message="Aún no se han agregado destinos al sistema"
  icon="map"
  actionLabel="Agregar destino"
  (action)="openAddModal()"
/>
```

**Iconos disponibles:** `search`, `folder`, `inbox`, `calendar`, `users`, `map`, `default`

## Estrategia de Manejo de Errores

### Flujo de Errores

1. **Interceptor de errores** captura todos los errores HTTP
2. **Notificación automática** al usuario según tipo de error
3. **Redirección** a login (401) o página no autorizado (403)
4. **Re-lanzamiento** del error para manejo específico en componentes

### Manejo en Componentes

```typescript
this.destinoApi.getAll().subscribe({
  next: (destinos) => {
    this.destinos = destinos;
    this.error = null;
  },
  error: (err) => {
    // El interceptor ya mostró la notificación
    // Aquí solo manejamos el estado del componente
    this.error = err.userMessage || 'Error desconocido';
    this.destinos = [];
  }
});
```

## Soporte para Upload de Archivos

```typescript
// Upload de un archivo
this.baseHttp.uploadFile<any>(
  '/upload',
  file,
  'imagen',
  { descripcion: 'Foto de destino' }
).subscribe(response => console.log(response));

// Upload de múltiples archivos
this.baseHttp.uploadFiles<any>(
  '/upload-multiple',
  files,
  'imagenes'
).subscribe(response => console.log(response));
```

## Query Params y Filtros

```typescript
// Construir parámetros de búsqueda
const params = this.baseHttp.buildParams({
  nombre: 'París',
  precioMin: 100,
  precioMax: 500,
  page: 0,
  size: 10
});

// Usar en petición
this.get<Destino[]>('/destinos/search', { params });
```

## Integración con LoadingService

Los servicios de API se integran automáticamente con `LoadingService`:

```typescript
// En el template
@if (loadingService.isLoading('destinos-list')) {
  <app-loading-state message="Cargando destinos..." />
}

// Los servicios de API configuran loadingKey automáticamente
this.destinoApi.getAll({
  loadingKey: 'custom-key',
  loadingMessage: 'Mensaje personalizado...'
});
```

## Requisitos del Backend

Para que el frontend funcione correctamente, el backend debe:

1. **Estar corriendo** en `http://localhost:8080`
2. **Tener CORS habilitado** (`@CrossOrigin(origins = "*")`)
3. **Retornar JSON** con estructura consistente
4. **Manejar errores** con formato `{ "error": "mensaje" }`

## Consideraciones de Producción

1. **Cambiar `apiUrl`** en `environment.prod.ts` a la URL de producción
2. **Deshabilitar logging** (`enableLogging: false`)
3. **Configurar CORS** correctamente en el backend
4. **Implementar refresh token** si se usa autenticación JWT real

