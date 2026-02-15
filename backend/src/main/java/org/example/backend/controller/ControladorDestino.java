package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.backend.model.Destino;
import org.example.backend.service.DestinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/destinos")
@Tag(name = "Destinos", description = "Gestión de destinos de viaje")
@SecurityRequirement(name = "bearerAuth")
public class ControladorDestino {

    @Autowired
    private DestinoService destinoService;

    // CREATE
    @Operation(summary = "Crear destino", description = "Crea un nuevo destino en el sistema (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Destino creado exitosamente",
                    content = @Content(schema = @Schema(implementation = Destino.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o nombre ya registrado"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @PostMapping
    public ResponseEntity<?> crearDestino(@Valid @RequestBody Destino destino) {
        try {
            Destino nuevoDestino = destinoService.crearDestino(destino);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoDestino);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ - Obtener todos
    @Operation(summary = "Obtener todos los destinos", description = "Obtiene una lista de todos los destinos disponibles")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de destinos obtenida exitosamente"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping
    public ResponseEntity<List<Destino>> obtenerTodos() {
        return ResponseEntity.ok(destinoService.obtenerTodos());
    }

    // READ - Obtener por ID
    @Operation(summary = "Obtener destino por ID", description = "Obtiene los detalles de un destino específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Destino encontrado",
                    content = @Content(schema = @Schema(implementation = Destino.class))),
            @ApiResponse(responseCode = "404", description = "Destino no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return destinoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por nombre exacto
    @Operation(summary = "Obtener destino por nombre", description = "Obtiene un destino específico por su nombre")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Destino encontrado",
                    content = @Content(schema = @Schema(implementation = Destino.class))),
            @ApiResponse(responseCode = "404", description = "Destino no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPorNombre(@PathVariable String nombre) {
        return destinoService.obtenerPorNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Buscar por nombre (contiene)
    @Operation(summary = "Buscar destinos por nombre", description = "Busca destinos que contengan el nombre dado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de destinos encontrada"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<Destino>> buscarPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(destinoService.buscarPorNombre(nombre));
    }

    // READ - Destinos visitados por usuario
    @Operation(summary = "Obtener destinos visitados por usuario", description = "Obtiene los destinos que un usuario específico ha visitado")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de destinos visitados obtenida exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Destino>> obtenerDestinosVisitadosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(destinoService.obtenerDestinosVisitadosPorUsuario(usuarioId));
    }

    // UPDATE
    @Operation(summary = "Actualizar destino", description = "Actualiza los datos de un destino existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Destino actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = Destino.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o nombre ya registrado"),
            @ApiResponse(responseCode = "404", description = "Destino no encontrado"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarDestino(@PathVariable Long id,
                                              @Valid @RequestBody Destino destino) {
        try {
            Destino destinoActualizado = destinoService.actualizarDestino(id, destino);
            return ResponseEntity.ok(destinoActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @Operation(summary = "Eliminar destino", description = "Elimina un destino del sistema (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Destino eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Destino no encontrado"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarDestino(@PathVariable Long id) {
        try {
            if (destinoService.eliminarDestino(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ENDPOINTS DE LÓGICA DE NEGOCIO
    @GetMapping("/{id}/tiene-reservas")
    public ResponseEntity<Map<String, Boolean>> tieneReservas(@PathVariable Long id) {
        try {
            boolean tieneReservas = destinoService.tieneReservas(id);
            return ResponseEntity.ok(Map.of("tieneReservas", tieneReservas));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{id}/contar-reservas")
    public ResponseEntity<Map<String, Integer>> contarReservas(@PathVariable Long id) {
        try {
            int cantidad = destinoService.contarReservas(id);
            return ResponseEntity.ok(Map.of("cantidadReservas", cantidad));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}