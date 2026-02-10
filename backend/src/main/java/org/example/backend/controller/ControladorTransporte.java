package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.backend.model.Transporte;
import org.example.backend.model.entity.TipoTransporte;
import org.example.backend.service.TransporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/transportes")
@Tag(name = "Transportes", description = "Gestión de tipos de transporte")
@SecurityRequirement(name = "bearerAuth")
public class ControladorTransporte {

    @Autowired
    private TransporteService transporteService;

    // CREATE
    @Operation(summary = "Crear transporte", description = "Crea un nuevo transporte en el sistema (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Transporte creado exitosamente",
                    content = @Content(schema = @Schema(implementation = Transporte.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @PostMapping
    public ResponseEntity<?> crearTransporte(@Valid @RequestBody Transporte transporte) {
        try {
            Transporte nuevoTransporte = transporteService.crearTransporte(transporte);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoTransporte);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ - Obtener todos
    @Operation(summary = "Obtener todos los transportes", description = "Obtiene una lista de todos los transportes disponibles")
    @GetMapping
    public ResponseEntity<List<Transporte>> obtenerTodos() {
        return ResponseEntity.ok(transporteService.obtenerTodos());
    }

    // READ - Obtener por ID
    @Operation(summary = "Obtener transporte por ID", description = "Obtiene los detalles de un transporte específico por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transporte encontrado",
                    content = @Content(schema = @Schema(implementation = Transporte.class))),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return transporteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por tipo
    @Operation(summary = "Obtener transporte por tipo", description = "Obtiene un transporte específico por su tipo")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transporte encontrado",
                    content = @Content(schema = @Schema(implementation = Transporte.class))),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado")
    })
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<?> obtenerPorTipo(@PathVariable TipoTransporte tipo) {
        return transporteService.obtenerPorTipo(tipo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener todos por tipo
    @Operation(summary = "Obtener todos los transportes por tipo", description = "Obtiene una lista de transportes filtrados por tipo")
    @ApiResponse(responseCode = "200", description = "Lista de transportes por tipo",
            content = @Content(schema = @Schema(implementation = Transporte.class)))
    @GetMapping("/buscar-tipo/{tipo}")
    public ResponseEntity<List<Transporte>> obtenerPorTipoTransporte(@PathVariable TipoTransporte tipo) {
        return ResponseEntity.ok(transporteService.obtenerPorTipoTransporte(tipo));
    }

    // READ - Transportes utilizados por usuario
    @Operation(summary = "Obtener transportes utilizados por usuario", description = "Obtiene una lista de transportes que ha utilizado un usuario específico")
    @ApiResponse(responseCode = "200", description = "Lista de transportes utilizados por el usuario",
            content = @Content(schema = @Schema(implementation = Transporte.class)))
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transporte>> obtenerTransportesUtilizadosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(transporteService.obtenerTransportesUtilizadosPorUsuario(usuarioId));
    }

    // READ - Obtener tipos disponibles
    @Operation(summary = "Obtener tipos de transporte disponibles", description = "Obtiene una lista de los tipos de transporte que están disponibles")
    @ApiResponse(responseCode = "200", description = "Lista de tipos de transporte disponibles",
            content = @Content(schema = @Schema(implementation = TipoTransporte.class)))
    @GetMapping("/tipos-disponibles")
    public ResponseEntity<List<TipoTransporte>> obtenerTiposDisponibles() {
        return ResponseEntity.ok(transporteService.obtenerTiposDisponibles());
    }

    // UPDATE
    @Operation(summary = "Actualizar transporte", description = "Actualiza los datos de un transporte existente (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Transporte actualizado exitosamente",
                    content = @Content(schema = @Schema(implementation = Transporte.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos"),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado"),
            @ApiResponse(responseCode = "403", description = "No tiene permisos (requiere rol ADMIN)")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarTransporte(@PathVariable Long id,
                                                 @Valid @RequestBody Transporte transporte) {
        try {
            Transporte transporteActualizado = transporteService.actualizarTransporte(id, transporte);
            return ResponseEntity.ok(transporteActualizado);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @Operation(summary = "Eliminar transporte", description = "Elimina un transporte del sistema (requiere rol ADMIN)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Transporte eliminado exitosamente"),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado"),
            @ApiResponse(responseCode = "409", description = "Conflicto al eliminar transporte")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarTransporte(@PathVariable Long id) {
        try {
            if (transporteService.eliminarTransporte(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ENDPOINTS DE LÓGICA DE NEGOCIO
    @Operation(summary = "Verificar si un transporte tiene reservas", description = "Verifica si hay reservas asociadas a un transporte")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Estado de reservas del transporte",
                    content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado")
    })
    @GetMapping("/{id}/tiene-reservas")
    public ResponseEntity<Map<String, Boolean>> tieneReservas(@PathVariable Long id) {
        try {
            boolean tieneReservas = transporteService.tieneReservas(id);
            return ResponseEntity.ok(Map.of("tieneReservas", tieneReservas));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @Operation(summary = "Contar reservas de un transporte", description = "Obtiene la cantidad de reservas asociadas a un transporte")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Cantidad de reservas del transporte",
                    content = @Content(schema = @Schema(implementation = Map.class))),
            @ApiResponse(responseCode = "404", description = "Transporte no encontrado")
    })
    @GetMapping("/{id}/contar-reservas")
    public ResponseEntity<Map<String, Integer>> contarReservas(@PathVariable Long id) {
        try {
            int cantidad = transporteService.contarReservas(id);
            return ResponseEntity.ok(Map.of("cantidadReservas", cantidad));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}