package org.example.backend.controller;

import jakarta.validation.Valid;
import org.example.backend.model.entity.Destino;
import org.example.backend.service.DestinoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/destinos")
@CrossOrigin(origins = "*")
public class ControladorDestino {

    @Autowired
    private DestinoService destinoService;

    // CREATE
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
    @GetMapping
    public ResponseEntity<List<Destino>> obtenerTodos() {
        return ResponseEntity.ok(destinoService.obtenerTodos());
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return destinoService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por nombre exacto
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPorNombre(@PathVariable String nombre) {
        return destinoService.obtenerPorNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Buscar por nombre (contiene)
    @GetMapping("/buscar/{nombre}")
    public ResponseEntity<List<Destino>> buscarPorNombre(@PathVariable String nombre) {
        return ResponseEntity.ok(destinoService.buscarPorNombre(nombre));
    }

    // READ - Destinos visitados por usuario
    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Destino>> obtenerDestinosVisitadosPorUsuario(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(destinoService.obtenerDestinosVisitadosPorUsuario(usuarioId));
    }

    // UPDATE
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