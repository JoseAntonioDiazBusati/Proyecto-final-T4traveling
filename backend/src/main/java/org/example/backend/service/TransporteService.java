package org.example.backend.service;

import org.example.backend.model.entity.Transporte;
import org.example.backend.model.entity.TipoTransporte;
import org.example.backend.repo.TransporteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TransporteService {

    @Autowired
    private TransporteRepo transporteRepo;

    // CREATE
    public Transporte crearTransporte(Transporte transporte) {
        // Validar que el tipo de transporte no sea nulo
        if (transporte.getTipo() == null) {
            throw new IllegalArgumentException("El tipo de transporte es obligatorio");
        }
        return transporteRepo.save(transporte);
    }

    // READ
    @Transactional(readOnly = true)
    public List<Transporte> obtenerTodos() {
        return transporteRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Transporte> obtenerPorId(Long id) {
        return transporteRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Transporte> obtenerPorTipo(TipoTransporte tipo) {
        return transporteRepo.findByTipo(tipo);
    }

    @Transactional(readOnly = true)
    public List<Transporte> obtenerPorTipoTransporte(TipoTransporte tipo) {
        return transporteRepo.findTransportesByTipo(tipo);
    }

    @Transactional(readOnly = true)
    public List<Transporte> obtenerTransportesUtilizadosPorUsuario(Long usuarioId) {
        return transporteRepo.findTransportesUtilizadosByUsuario(usuarioId);
    }

    // UPDATE
    public Transporte actualizarTransporte(Long id, Transporte transporteActualizado) {
        Transporte transporte = transporteRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Transporte no encontrado con id: " + id));

        if (transporteActualizado.getTipo() == null) {
            throw new IllegalArgumentException("El tipo de transporte es obligatorio");
        }

        transporte.setTipo(transporteActualizado.getTipo());
        return transporteRepo.save(transporte);
    }

    // DELETE
    public boolean eliminarTransporte(Long id) {
        Optional<Transporte> transporte = transporteRepo.findById(id);
        if (transporte.isEmpty()) {
            return false;
        }

        // LÓGICA DE NEGOCIO: No permitir eliminar transportes con reservas activas
        if (transporte.get().getReservas() != null && !transporte.get().getReservas().isEmpty()) {
            throw new IllegalStateException("No se puede eliminar un transporte con reservas asociadas");
        }

        transporteRepo.deleteById(id);
        return true;
    }

    // LÓGICA DE NEGOCIO
    @Transactional(readOnly = true)
    public boolean tieneReservas(Long transporteId) {
        Transporte transporte = transporteRepo.findById(transporteId)
                .orElseThrow(() -> new IllegalArgumentException("Transporte no encontrado"));
        return transporte.getReservas() != null && !transporte.getReservas().isEmpty();
    }

    @Transactional(readOnly = true)
    public int contarReservas(Long transporteId) {
        Transporte transporte = transporteRepo.findById(transporteId)
                .orElseThrow(() -> new IllegalArgumentException("Transporte no encontrado"));
        return transporte.getReservas() != null ? transporte.getReservas().size() : 0;
    }

    @Transactional(readOnly = true)
    public List<TipoTransporte> obtenerTiposDisponibles() {
        return List.of(TipoTransporte.values());
    }
}

