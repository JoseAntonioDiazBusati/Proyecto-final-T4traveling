package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.model.entity.Transporte;
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
@CrossOrigin(origins = "*")
public class ControladorTransporte {

    @Autowired
    private TransporteService transporteService;

    // CREATE
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
    @GetMapping
    public ResponseEntity<List<Transporte>> obtenerTodos() {
        return ResponseEntity.ok(transporteService.obtenerTodos());
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return transporteService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por tipo
    @GetMapping("/tipo/{tipo}")
    public ResponseEntity<?> obtenerPorTipo(@PathVariable TipoTransporte tipo) {
        return transporteService.obtenerPorTipo(tipo)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener todos por tipo
    @GetMapping("/buscar-tipo/{tipo}")
    public ResponseEntity<List<Transporte>> obtenerPorTipoTransporte(@PathVariable TipoTransporte tipo) {
        return ResponseEntity.ok(transporteService.obtenerPorTipoTransporte(tipo));
    }

    // READ - Transportes utilizados por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Transporte>> obtenerTransportesUtilizadosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(transporteService.obtenerTransportesUtilizadosPorUsuario(usuarioId));
    }

    // READ - Obtener tipos disponibles
    @GetMapping("/tipos-disponibles")
    public ResponseEntity<List<TipoTransporte>> obtenerTiposDisponibles() {
        return ResponseEntity.ok(transporteService.obtenerTiposDisponibles());
    }

    // UPDATE
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
    @GetMapping("/{id}/tiene-reservas")
    public ResponseEntity<Map<String, Boolean>> tieneReservas(@PathVariable Long id) {
        try {
            boolean tieneReservas = transporteService.tieneReservas(id);
            return ResponseEntity.ok(Map.of("tieneReservas", tieneReservas));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

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