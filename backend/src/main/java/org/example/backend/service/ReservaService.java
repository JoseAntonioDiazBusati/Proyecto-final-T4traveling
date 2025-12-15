package org.example.backend.service;

import org.example.backend.model.entity.Reserva;
import org.example.backend.model.entity.Usuario;
import org.example.backend.model.entity.Destino;
import org.example.backend.model.entity.Transporte;
import org.example.backend.repo.ReservaRepo;
import org.example.backend.repo.UsuarioRepo;
import org.example.backend.repo.DestinoRepo;
import org.example.backend.repo.TransporteRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ReservaService {

    @Autowired
    private ReservaRepo reservaRepo;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private DestinoRepo destinoRepo;

    @Autowired
    private TransporteRepo transporteRepo;

    // CREATE
    public Reserva crearReserva(Reserva reserva) {
        // Validar que el usuario existe
        if (reserva.getUsuario() == null || reserva.getUsuario().getId() == null) {
            throw new IllegalArgumentException("El usuario es obligatorio");
        }
        Usuario usuario = usuarioRepo.findById(reserva.getUsuario().getId())
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        // Validar que el destino existe
        if (reserva.getDestino() == null || reserva.getDestino().getId() == null) {
            throw new IllegalArgumentException("El destino es obligatorio");
        }
        Destino destino = destinoRepo.findById(reserva.getDestino().getId())
                .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));

        // Validar que el transporte existe
        if (reserva.getTransporte() == null || reserva.getTransporte().getId() == null) {
            throw new IllegalArgumentException("El transporte es obligatorio");
        }
        Transporte transporte = transporteRepo.findById(reserva.getTransporte().getId())
                .orElseThrow(() -> new IllegalArgumentException("Transporte no encontrado"));

        // Validar que la fecha no sea nula y no sea pasada
        if (reserva.getFecha() == null) {
            throw new IllegalArgumentException("La fecha es obligatoria");
        }

        if (reserva.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException("No se pueden crear reservas con fechas pasadas");
        }

        // LÓGICA DE NEGOCIO: Validar que el usuario no tenga ya una reserva para el mismo destino en la misma fecha
        List<Reserva> reservasExistentes = reservaRepo.findReservasByDestinoAndUsuario(
                destino.getId(), usuario.getId());

        for (Reserva r : reservasExistentes) {
            if (r.getFecha().equals(reserva.getFecha())) {
                throw new IllegalStateException(
                    "Ya existe una reserva para este usuario en este destino para la fecha indicada");
            }
        }

        // Establecer las entidades completas
        reserva.setUsuario(usuario);
        reserva.setDestino(destino);
        reserva.setTransporte(transporte);

        return reservaRepo.save(reserva);
    }

    // READ
    @Transactional(readOnly = true)
    public List<Reserva> obtenerTodas() {
        return reservaRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Reserva> obtenerPorId(Long id) {
        return reservaRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerPorUsuario(Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return reservaRepo.findByUsuario(usuario);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerPorDestino(Long destinoId) {
        Destino destino = destinoRepo.findById(destinoId)
                .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));
        return reservaRepo.findByDestino(destino);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasPorUsuarioId(Long usuarioId) {
        return reservaRepo.findReservasByUsuarioId(usuarioId);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasPorRangoFechas(LocalDate fechaInicio, LocalDate fechaFin) {
        if (fechaInicio.isAfter(fechaFin)) {
            throw new IllegalArgumentException("La fecha de inicio debe ser anterior a la fecha fin");
        }
        return reservaRepo.findReservasByFechaRange(fechaInicio, fechaFin);
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasPorDestinoYUsuario(Long destinoId, Long usuarioId) {
        return reservaRepo.findReservasByDestinoAndUsuario(destinoId, usuarioId);
    }

    // UPDATE
    public Reserva actualizarReserva(Long id, Reserva reservaActualizada) {
        Reserva reserva = reservaRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Reserva no encontrada con id: " + id));

        // Validar que la fecha de la reserva no haya pasado
        if (reserva.getFecha().isBefore(LocalDate.now())) {
            throw new IllegalStateException("No se puede modificar una reserva con fecha pasada");
        }

        // Si se está actualizando el destino
        if (reservaActualizada.getDestino() != null && reservaActualizada.getDestino().getId() != null) {
            Destino destino = destinoRepo.findById(reservaActualizada.getDestino().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Destino no encontrado"));
            reserva.setDestino(destino);
        }

        // Si se está actualizando el transporte
        if (reservaActualizada.getTransporte() != null && reservaActualizada.getTransporte().getId() != null) {
            Transporte transporte = transporteRepo.findById(reservaActualizada.getTransporte().getId())
                    .orElseThrow(() -> new IllegalArgumentException("Transporte no encontrado"));
            reserva.setTransporte(transporte);
        }

        // Si se está actualizando la fecha
        if (reservaActualizada.getFecha() != null) {
            if (reservaActualizada.getFecha().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException("No se pueden asignar fechas pasadas");
            }
            reserva.setFecha(reservaActualizada.getFecha());
        }

        return reservaRepo.save(reserva);
    }

    // DELETE
    public boolean eliminarReserva(Long id) {
        Optional<Reserva> reserva = reservaRepo.findById(id);
        if (reserva.isEmpty()) {
            return false;
        }

        // LÓGICA DE NEGOCIO: No permitir eliminar reservas con menos de 24 horas de anticipación
        if (reserva.get().getFecha().isBefore(LocalDate.now().plusDays(1))) {
            throw new IllegalStateException(
                "No se puede eliminar una reserva con menos de 24 horas de anticipación");
        }

        reservaRepo.deleteById(id);
        return true;
    }

    // LÓGICA DE NEGOCIO ADICIONAL
    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasFuturas(Long usuarioId) {
        List<Reserva> reservas = reservaRepo.findReservasByUsuarioId(usuarioId);
        return reservas.stream()
                .filter(r -> r.getFecha().isAfter(LocalDate.now()) || r.getFecha().isEqual(LocalDate.now()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Reserva> obtenerReservasPasadas(Long usuarioId) {
        List<Reserva> reservas = reservaRepo.findReservasByUsuarioId(usuarioId);
        return reservas.stream()
                .filter(r -> r.getFecha().isBefore(LocalDate.now()))
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean usuarioPuedeReservar(Long usuarioId) {
        // LÓGICA DE NEGOCIO: Ejemplo - Un usuario no puede tener más de 5 reservas futuras activas
        List<Reserva> reservasFuturas = obtenerReservasFuturas(usuarioId);
        return reservasFuturas.size() < 5;
    }

    @Transactional(readOnly = true)
    public int contarReservasFuturasUsuario(Long usuarioId) {
        return obtenerReservasFuturas(usuarioId).size();
    }
}

