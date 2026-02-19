# Backend - Sistema de Reservas de Viajes (T4traveling)

## Descripción

Sistema de gestión de reservas de viajes que permite a los usuarios crear reservas para diferentes destinos utilizando distintos tipos de transporte.

## Modelo de Datos

El sistema se basa en el siguiente modelo E/R:

- **Usuario**: Gestiona la información de los usuarios del sistema
- **Reserva**: Representa las reservas realizadas por los usuarios
- **Destino**: Almacena los destinos disponibles para viajar
- **Transporte**: Define los tipos de transporte disponibles (Avión, Autobús, Coche)

### Relaciones

- Un Usuario puede tener múltiples Reservas (1:N)
- Una Reserva pertenece a un Usuario, un Destino y un Transporte (N:1)
- Un Destino puede tener múltiples Reservas (1:N)
- Un Transporte puede tener múltiples Reservas (1:N)

## Características Principales

### CRUD Completo

Cada entidad cuenta con operaciones completas de:
- **Create**: Crear nuevos registros
- **Read**: Consultar registros (todos, por ID, y búsquedas específicas)
- **Update**: Actualizar registros existentes
- **Delete**: Eliminar registros

### Lógica de Negocio Implementada

#### Usuarios
- Validación de email y nombre únicos
- Contador de reservas activas
- Verificación de reservas pendientes

#### Destinos
- No se puede eliminar un destino con reservas asociadas
- Búsqueda por nombre (parcial)
- Consulta de destinos visitados por usuario
- Contador de reservas por destino

#### Transportes
- No se puede eliminar un transporte con reservas asociadas
- Consulta de transportes utilizados por usuario
- Obtención de tipos de transporte disponibles
- Contador de reservas por transporte

#### Reservas (Lógica Principal)
- **Validación de fechas**: No se permiten reservas con fechas pasadas
- **Límite de reservas**: Un usuario no puede tener más de 5 reservas futuras activas
- **Reservas duplicadas**: No se permite reservar el mismo destino para la misma fecha
- **Cancelación con anticipación**: No se puede eliminar una reserva con menos de 24 horas de anticipación
- **Modificación de reservas**: No se pueden modificar reservas con fechas pasadas
- Consulta de reservas futuras y pasadas
- Filtrado por rango de fechas
- Consultas por usuario, destino y combinaciones

## Endpoints de la API

### Usuarios (`/api/usuarios`)

#### Operaciones CRUD
- `POST /api/usuarios` - Crear usuario
- `GET /api/usuarios` - Obtener todos los usuarios
- `GET /api/usuarios/{id}` - Obtener usuario por ID
- `GET /api/usuarios/email/{email}` - Obtener usuario por email
- `GET /api/usuarios/nombre/{nombre}` - Obtener usuario por nombre
- `GET /api/usuarios/ubicacion/{ubicacion}` - Obtener usuarios por ubicación
- `PUT /api/usuarios/{id}` - Actualizar usuario
- `DELETE /api/usuarios/{id}` - Eliminar usuario

#### Lógica de Negocio
- `GET /api/usuarios/{id}/tiene-reservas` - Verificar si tiene reservas
- `GET /api/usuarios/{id}/contar-reservas` - Contar reservas del usuario

### Destinos (`/api/destinos`)

#### Operaciones CRUD
- `POST /api/destinos` - Crear destino
- `GET /api/destinos` - Obtener todos los destinos
- `GET /api/destinos/{id}` - Obtener destino por ID
- `GET /api/destinos/nombre/{nombre}` - Obtener destino por nombre exacto
- `GET /api/destinos/buscar/{nombre}` - Buscar destinos por nombre (contiene)
- `GET /api/destinos/usuario/{usuarioId}` - Destinos visitados por usuario
- `PUT /api/destinos/{id}` - Actualizar destino
- `DELETE /api/destinos/{id}` - Eliminar destino

#### Lógica de Negocio
- `GET /api/destinos/{id}/tiene-reservas` - Verificar si tiene reservas
- `GET /api/destinos/{id}/contar-reservas` - Contar reservas del destino

### Transportes (`/api/transportes`)

#### Operaciones CRUD
- `POST /api/transportes` - Crear transporte
- `GET /api/transportes` - Obtener todos los transportes
- `GET /api/transportes/{id}` - Obtener transporte por ID
- `GET /api/transportes/tipo/{tipo}` - Obtener transporte por tipo
- `GET /api/transportes/buscar-tipo/{tipo}` - Buscar transportes por tipo
- `GET /api/transportes/usuario/{usuarioId}` - Transportes utilizados por usuario
- `GET /api/transportes/tipos-disponibles` - Obtener tipos de transporte disponibles
- `PUT /api/transportes/{id}` - Actualizar transporte
- `DELETE /api/transportes/{id}` - Eliminar transporte

#### Lógica de Negocio
- `GET /api/transportes/{id}/tiene-reservas` - Verificar si tiene reservas
- `GET /api/transportes/{id}/contar-reservas` - Contar reservas del transporte

### Reservas (`/api/reservas`)

#### Operaciones CRUD
- `POST /api/reservas` - Crear reserva
- `GET /api/reservas` - Obtener todas las reservas
- `GET /api/reservas/{id}` - Obtener reserva por ID
- `GET /api/reservas/usuario/{usuarioId}` - Obtener reservas de un usuario
- `GET /api/reservas/destino/{destinoId}` - Obtener reservas de un destino
- `GET /api/reservas/fechas?fechaInicio={fecha}&fechaFin={fecha}` - Reservas por rango de fechas
- `GET /api/reservas/destino/{destinoId}/usuario/{usuarioId}` - Reservas por destino y usuario
- `GET /api/reservas/usuario/{usuarioId}/futuras` - Reservas futuras del usuario
- `GET /api/reservas/usuario/{usuarioId}/pasadas` - Reservas pasadas del usuario
- `PUT /api/reservas/{id}` - Actualizar reserva
- `DELETE /api/reservas/{id}` - Eliminar reserva

#### Lógica de Negocio
- `GET /api/reservas/usuario/{usuarioId}/puede-reservar` - Verificar si puede crear más reservas
- `GET /api/reservas/usuario/{usuarioId}/contar-futuras` - Contar reservas futuras

## Ejemplos de Uso

### Crear un Usuario

```json
POST /api/usuarios
Content-Type: application/json

{
  "nombre": "Juan Pérez",
  "ubicacion": "Madrid",
  "email": "juan.perez@example.com",
  "password": "password123"
}
```

### Crear un Destino

```json
POST /api/destinos
Content-Type: application/json

{
  "nombre": "París"
}
```

### Crear un Transporte

```json
POST /api/transportes
Content-Type: application/json

{
  "tipo": "AVION"
}
```

Tipos disponibles: `AVION`, `AUTOBUS`, `COCHE`

### Crear una Reserva

```json
POST /api/reservas
Content-Type: application/json

{
  "usuario": {
    "id": 1
  },
  "destino": {
    "id": 1
  },
  "transporte": {
    "id": 1
  },
  "fecha": "2025-12-20"
}
```

## Validaciones y Restricciones

### Usuario
- Email único y obligatorio
- Nombre único y obligatorio
- Ubicación obligatoria
- Password obligatorio

### Destino
- Nombre único y obligatorio
- No se puede eliminar si tiene reservas asociadas

### Transporte
- Tipo obligatorio (debe ser uno de los valores del enum)
- No se puede eliminar si tiene reservas asociadas

### Reserva
- Usuario, destino y transporte obligatorios
- La fecha no puede ser pasada
- No se permite duplicar una reserva (mismo usuario, destino y fecha)
- Un usuario no puede tener más de 5 reservas futuras activas
- No se puede eliminar con menos de 24 horas de anticipación
- No se puede modificar si la fecha ya pasó

## Manejo de Errores

El sistema devuelve respuestas HTTP apropiadas:

- `200 OK` - Operación exitosa
- `201 Created` - Recurso creado exitosamente
- `204 No Content` - Eliminación exitosa
- `400 Bad Request` - Error de validación o lógica de negocio
- `404 Not Found` - Recurso no encontrado
- `409 Conflict` - Conflicto con el estado actual (ej: eliminar recurso con dependencias)
- `500 Internal Server Error` - Error interno del servidor

### Formato de Errores

```json
{
  "error": "Descripción del error"
}
```

## Configuración CORS

El sistema tiene CORS configurado para aceptar peticiones desde cualquier origen (`*`) para facilitar el desarrollo frontend.

Métodos permitidos: `GET`, `POST`, `PUT`, `DELETE`, `OPTIONS`, `PATCH`

## Tecnologías Utilizadas

- **Spring Boot 4.0.0** - Framework principal
- **Spring Data JPA** - Persistencia de datos
- **Spring Web** - API REST
- **Spring Validation** - Validación de datos
- **Lombok** - Reducción de código boilerplate
- **MySQL** - Base de datos
- **Jakarta Persistence** - JPA 3.x
- **Java 21** - Lenguaje de programación

## Próximos Pasos (Recomendados para siguientes entregas)

### Seguridad
- Implementar Spring Security
- Autenticación JWT
- Roles y permisos (ADMIN, USER)
- Encriptación de passwords con BCrypt

### Funcionalidades Adicionales
- Paginación en las consultas
- Ordenamiento de resultados
- Filtros avanzados
- Auditoría (createdAt, updatedAt)
- Soft delete en lugar de eliminación física

### Testing
- Tests unitarios de servicios
- Tests de integración de controladores
- Tests de repositorios

## Estructura del Proyecto

```
backend/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── org/example/backend/
│   │   │       ├── BackendApplication.java
│   │   │       ├── config/
│   │   │       │   └── WebConfig.java
│   │   │       ├── controller/
│   │   │       │   ├── ControladorUsuario.java
│   │   │       │   ├── ControladorDestino.java
│   │   │       │   ├── ControladorTransporte.java
│   │   │       │   └── ControladorReserva.java
│   │   │       ├── model/
│   │   │       │   ├── entity/
│   │   │       │   │   ├── Usuario.java
│   │   │       │   │   ├── Destino.java
│   │   │       │   │   ├── Transporte.java
│   │   │       │   │   ├── Reserva.java
│   │   │       │   │   └── TipoTransporte.java
│   │   │       │   └── dto/
│   │   │       ├── repo/
│   │   │       │   ├── UsuarioRepo.java
│   │   │       │   ├── DestinoRepo.java
│   │   │       │   ├── TransporteRepo.java
│   │   │       │   └── ReservaRepo.java
│   │   │       ├── service/
│   │   │       │   ├── UsuarioService.java
│   │   │       │   ├── DestinoService.java
│   │   │       │   ├── TransporteService.java
│   │   │       │   └── ReservaService.java
│   │   │       └── exception/
│   │   │           └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
└── pom.xml
```

## Autor

Proyecto Final - T4traveling

