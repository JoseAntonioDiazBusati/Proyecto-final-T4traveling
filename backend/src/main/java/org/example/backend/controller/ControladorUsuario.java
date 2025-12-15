package org.example.backend.controller;

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
@CrossOrigin(origins = "*")
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
    @GetMapping
    public ResponseEntity<List<Usuario>> obtenerTodos() {
        return ResponseEntity.ok(usuarioService.obtenerTodos());
    }

    // READ - Obtener por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        return usuarioService.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> obtenerPorEmail(@PathVariable String email) {
        return usuarioService.obtenerPorEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<?> obtenerPorNombre(@PathVariable String nombre) {
        return usuarioService.obtenerPorNombre(nombre)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // READ - Obtener por ubicación
    @GetMapping("/ubicacion/{ubicacion}")
    public ResponseEntity<List<Usuario>> obtenerPorUbicacion(@PathVariable String ubicacion) {
        return ResponseEntity.ok(usuarioService.obtenerPorUbicacion(ubicacion));
    }

    // UPDATE
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
    @GetMapping("/{id}/tiene-reservas")
    public ResponseEntity<Map<String, Boolean>> tieneReservas(@PathVariable Long id) {
        try {
            boolean tieneReservas = usuarioService.tieneReservasActivas(id);
            return ResponseEntity.ok(Map.of("tieneReservas", tieneReservas));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

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