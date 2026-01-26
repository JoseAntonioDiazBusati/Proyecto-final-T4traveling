package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.backend.model.entity.Reserva;
import org.example.backend.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
@Tag(name = "Reservas", description = "Gestión de reservas de viajes")
@SecurityRequirement(name = "bearerAuth")
public class ControladorReserva {

    @Autowired
    private ReservaService reservaService;

    // CREATE
    @Operation(summary = "Crear reserva", description = "Crea una nueva reserva de viaje")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Reserva creada exitosamente",
                    content = @Content(schema = @Schema(implementation = Reserva.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o violación de reglas de negocio"),
            @ApiResponse(responseCode = "401", description = "No autenticado")
    })
    @PostMapping
    public ResponseEntity<?> crearReserva(@Valid @RequestBody Reserva reserva) {
        try {
            Reserva nuevaReserva = reservaService.crearReserva(reserva);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevaReserva);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ - Obtener todas
    @Operation(summary = "Obtener todas las reservas", description = "Obtiene una lista de todas las reservas")
    @ApiResponse(responseCode = "200", description = "Lista de reservas retornada exitosamente")
    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodas() {
        return ResponseEntity.ok(reservaService.obtenerTodas());
    }

    // READ - Obtener por ID
    @Operation(summary = "Obtener reserva por ID", description = "Obtiene los detalles de una reserva específica por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reserva encontrada",
                    content = @Content(schema = @Schema(implementation = Reserva.class))),
            @ApiResponse(responseCode = "404", description = "Reserva no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return reservaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por usuario
    @Operation(summary = "Obtener reservas por usuario", description = "Obtiene una lista de reservas asociadas a un usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de reservas del usuario retornada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Usuario no encontrado")
    })
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        try {
            return ResponseEntity.ok(reservaService.obtenerPorUsuario(usuarioId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Obtener por destino
    @Operation(summary = "Obtener reservas por destino", description = "Obtiene una lista de reservas asociadas a un destino")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de reservas del destino retornada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Destino no encontrado")
    })
    @GetMapping("/destino/{destinoId}")
    public ResponseEntity<List<Reserva>> obtenerPorDestino(@PathVariable Long destinoId) {
        try {
            return ResponseEntity.ok(reservaService.obtenerPorDestino(destinoId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Obtener por rango de fechas
    @Operation(summary = "Obtener reservas por rango de fechas", description = "Obtiene una lista de reservas dentro de un rango de fechas específico")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Lista de reservas en el rango de fechas retornada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Rango de fechas inválido"),
    })
    @GetMapping("/fechas")
    public ResponseEntity<?> obtenerPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaInicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fechaFin) {
        try {
            List<Reserva> reservas = reservaService.obtenerReservasPorRangoFechas(fechaInicio, fechaFin);
            return ResponseEntity.ok(reservas);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // READ - Obtener por destino y usuario
    @Operation(summary = "Obtener reservas por destino y usuario", description = "Obtiene una lista de reservas asociadas a un destino y usuario específicos")
    @ApiResponse(responseCode = "200", description = "Lista de reservas por destino y usuario retornada exitosamente")
    @GetMapping("/destino/{destinoId}/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerPorDestinoYUsuario(
            @PathVariable Long destinoId,
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasPorDestinoYUsuario(destinoId, usuarioId));
    }

    // READ - Reservas futuras de un usuario
    @Operation(summary = "Obtener reservas futuras de un usuario", description = "Obtiene una lista de reservas futuras asociadas a un usuario")
    @ApiResponse(responseCode = "200", description = "Lista de reservas futuras retornada exitosamente")
    @GetMapping("/usuario/{usuarioId}/futuras")
    public ResponseEntity<List<Reserva>> obtenerReservasFuturas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasFuturas(usuarioId));
    }

    // READ - Reservas pasadas de un usuario
    @Operation(summary = "Obtener reservas pasadas de un usuario", description = "Obtiene una lista de reservas pasadas asociadas a un usuario")
    @ApiResponse(responseCode = "200", description = "Lista de reservas pasadas retornada exitosamente")
    @GetMapping("/usuario/{usuarioId}/pasadas")
    public ResponseEntity<List<Reserva>> obtenerReservasPasadas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasPasadas(usuarioId));
    }

    // UPDATE
    @Operation(summary = "Actualizar reserva", description = "Actualiza los detalles de una reserva existente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Reserva actualizada exitosamente",
                    content = @Content(schema = @Schema(implementation = Reserva.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o violación de reglas de negocio"),
            @ApiResponse(responseCode = "404", description = "Reserva no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarReserva(@PathVariable Long id,
                                              @Valid @RequestBody Reserva reserva) {
        try {
            Reserva reservaActualizada = reservaService.actualizarReserva(id, reserva);
            return ResponseEntity.ok(reservaActualizada);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // DELETE
    @Operation(summary = "Eliminar reserva", description = "Elimina una reserva existente por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Reserva eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Reserva no encontrada"),
            @ApiResponse(responseCode = "409", description = "Conflicto al eliminar reserva")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Long id) {
        try {
            if (reservaService.eliminarReserva(id)) {
                return ResponseEntity.noContent().build();
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // ENDPOINTS DE LÓGICA DE NEGOCIO
    @Operation(summary = "Verificar si un usuario puede reservar", description = "Verifica si un usuario tiene la capacidad de realizar nuevas reservas")
    @ApiResponse(responseCode = "200", description = "Información sobre la capacidad de reserva del usuario retornada exitosamente")
    @GetMapping("/usuario/{usuarioId}/puede-reservar")
    public ResponseEntity<Map<String, Object>> usuarioPuedeReservar(@PathVariable Long usuarioId) {
        boolean puedeReservar = reservaService.usuarioPuedeReservar(usuarioId);
        int reservasActivas = reservaService.contarReservasFuturasUsuario(usuarioId);
        return ResponseEntity.ok(Map.of(
                "puedeReservar", puedeReservar,
                "reservasActivas", reservasActivas,
                "limiteReservas", 5
        ));
    }

    @Operation(summary = "Contar reservas futuras de un usuario", description = "Obtiene la cantidad de reservas futuras asociadas a un usuario")
    @ApiResponse(responseCode = "200", description = "Cantidad de reservas futuras retornada exitosamente")
    @GetMapping("/usuario/{usuarioId}/contar-futuras")
    public ResponseEntity<Map<String, Integer>> contarReservasFuturas(@PathVariable Long usuarioId) {
        int cantidad = reservaService.contarReservasFuturasUsuario(usuarioId);
        return ResponseEntity.ok(Map.of("cantidadReservasFuturas", cantidad));
    }
}