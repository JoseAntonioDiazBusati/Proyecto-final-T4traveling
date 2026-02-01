package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import jakarta.validation.Valid;
import org.example.backend.model.entity.Usuario;
import org.example.backend.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
public class ControladorUsuario {

    @Autowired
    private UsuarioService usuarioService;

    // CREATE
    @PostMapping
    public ResponseEntity<?> crearUsuario(@Valid @RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.crearUsuario(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ - Obtener todos
    @Operation(summary = "Obtener todos los usuarios", description = "Obtiene una lista de todos los usuarios registrados")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de usuarios obtenida exitosamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // READ - Obtener por ID
    @Operation(summary = "Obtener usuario por ID", description = "Obtiene los detalles de un usuario específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado",
                    content = @Content(schema = @Schema(implementation = Usuario.class))),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por email
    @Operation(summary = "Obtener usuario por email", description = "Busca un usuario por su dirección de email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/email/{email}")
    public ResponseEntity<?> obtenerPorEmail(@PathVariable String email) {
        return usuarioService.obtenerPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por nombre
    @Operation(summary = "Obtener usuario por nombre", description = "Busca un usuario por su nombre")
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPorNombre(@PathVariable String nombre) {
        return usuarioService.obtenerPorNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por ubicación
    @Operation(summary = "Obtener usuarios por ubicación", description = "Obtiene todos los usuarios de una ubicación específica")
    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<Usuario>> obtenerPorUbicacion(@PathVariable String ubicacion) {
        return ResponseEntity.ok(usuarioService.obtenerPorUbicacion(ubicacion));
    }

    // UPDATE
    @Operation(summary = "Actualizar usuario", description = "Actualiza los datos de un usuario existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Usuario actualizado exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id,
                                              @Valid @RequestBody Usuario usuario) {
        try {
            Usuario usuarioActualizado = usuarioService.actualizarUsuario(id, usuario);
            return ResponseEntity.ok(usuarioActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @Operation(summary = "Eliminar usuario", description = "Elimina un usuario del sistema (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Usuario eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            if (usuarioService.eliminarUsuario(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ENDPOINTS DE LÓGICA DE NEGOCIO
    @Operation(summary = "Verificar si tiene reservas", description = "Verifica si un usuario tiene reservas activas")
    @GetMapping("/{id}/tiene-reservas")
    public ResponseEntity<Map<String, Boolean>> tieneReservas(@PathVariable Long id) {
        try {
            boolean tieneReservas = usuarioService.tieneReservasActivas(id);
            return ResponseEntity.ok(Map.of("tieneReservas", tieneReservas));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Contar reservas", description = "Obtiene el número de reservas de un usuario")
    @GetMapping("/{id}/contar-reservas")
    public ResponseEntity<Map<String, Integer>> contarReservas(@PathVariable Long id) {
        try {
            int cantidad = usuarioService.contarReservas(id);
            return ResponseEntity.ok(Map.of("cantidadReservas", cantidad));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}