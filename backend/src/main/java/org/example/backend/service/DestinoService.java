package org.example.backend.service;

import org.example.backend.model.Usuario;
import org.example.backend.repo.DestinoRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class DestinoService {

    @Autowired
    private DestinoRepo destinoRepo;

    // CREATE
    public Usuario.Destino crearDestino(Usuario.Destino destino) {
        // Validar que el nombre no exista
        if (destinoRepo.findByNombre(destino.getNombre()).isPresent()) {
            throw new IllegalArgumentException("Ya existe un destino con ese nombre");
        }
        return destinoRepo.save(destino);
    }

    // READ
    @Transactional(readOnly = true)
    public List<Usuario.Destino> obtenerTodos() {
        return destinoRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Usuario.Destino> obtenerPorId(Long id) {
        return destinoRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario.Destino> obtenerPorNombre(String nombre) {
        return destinoRepo.findByNombre(nombre);
    }

    @Transactional(readOnly = true)
    public List<Usuario.Destino> buscarPorNombre(String nombre) {
        return destinoRepo.findDestinosByNombreContaining(nombre);
    }

    @Transactional(readOnly = true)
    public List<Usuario.Destino> obtenerDestinosVisitadosPorUsuario(Long usuarioId) {
        return destinoRepo.findDestinosVisitadosByUsuario(usuarioId);
    }

    // UPDATE
    public Usuario.Destino actualizarDestino(Long id, Usuario.Destino destinoActualizado) {
        Usuario.Destino destino = destinoRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado con id: " + id));

        // Validar nombre único si se está cambiando
        if (!destino.getNombre().equals(destinoActualizado.getNombre())) {
            if (destinoRepo.findByNombre(destinoActualizado.getNombre()).isPresent()) {
                throw new IllegalArgumentException("Ya existe un destino con ese nombre");
            }
        }

        destino.setNombre(destinoActualizado.getNombre());
        return destinoRepo.save(destino);
    }

    // DELETE
    public boolean eliminarDestino(Long id) {
        Optional<Usuario.Destino> destino = destinoRepo.findById(id);
        if (destino.isEmpty()) {
            return false;
        }

        // LÓGICA DE NEGOCIO: No permitir eliminar destinos con reservas activas
        if (destino.get().getReservas() != null && !destino.get().getReservas().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar un destino con reservas asociadas");
        }

        destinoRepo.deleteById(id);
        return true;
    }

    // LÓGICA DE NEGOCIO
    @Transactional(readOnly = true)
    public boolean tieneReservas(Long destinoId) {
        Usuario.Destino destino = destinoRepo.findById(destinoId)
                .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));
        return destino.getReservas() != null && !destino.getReservas().isEmpty();
    }

    @Transactional(readOnly = true)
    public int contarReservas(Long destinoId) {
        Usuario.Destino destino = destinoRepo.findById(destinoId)
                .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));
        return destino.getReservas() != null ? destino.getReservas().size() : 0;
    }
}

