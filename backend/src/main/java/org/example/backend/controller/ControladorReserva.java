package org.example.backend.controller;

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
public class ControladorReserva {

    @Autowired
    private ReservaService reservaService;

    // CREATE
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
    @GetMapping
    public ResponseEntity<List<Reserva>> obtenerTodas() {
        return ResponseEntity.ok(reservaService.obtenerTodas());
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return reservaService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerPorUsuario(@PathVariable Long usuarioId) {
        try {
            return ResponseEntity.ok(reservaService.obtenerPorUsuario(usuarioId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Obtener por destino
    @GetMapping("/destino/{destinoId}")
    public ResponseEntity<List<Reserva>> obtenerPorDestino(@PathVariable Long destinoId) {
        try {
            return ResponseEntity.ok(reservaService.obtenerPorDestino(destinoId));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // READ - Obtener por rango de fechas
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
    @GetMapping("/destino/{destinoId}/usuario/{usuarioId}")
    public ResponseEntity<List<Reserva>> obtenerPorDestinoYUsuario(
            @PathVariable Long destinoId,
            @PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasPorDestinoYUsuario(destinoId, usuarioId));
    }

    // READ - Reservas futuras de un usuario
    @GetMapping("/usuario/{usuarioId}/futuras")
    public ResponseEntity<List<Reserva>> obtenerReservasFuturas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasFuturas(usuarioId));
    }

    // READ - Reservas pasadas de un usuario
    @GetMapping("/usuario/{usuarioId}/pasadas")
    public ResponseEntity<List<Reserva>> obtenerReservasPasadas(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(reservaService.obtenerReservasPasadas(usuarioId));
    }

    // UPDATE
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

    @GetMapping("/usuario/{usuarioId}/contar-futuras")
    public ResponseEntity<Map<String, Integer>> contarReservasFuturas(@PathVariable Long usuarioId) {
        int cantidad = reservaService.contarReservasFuturasUsuario(usuarioId);
        return ResponseEntity.ok(Map.of("cantidadReservasFuturas", cantidad));
    }
}