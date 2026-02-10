package org.example.backend.repo;

import org.example.backend.model.Reserva;
import org.example.backend.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReservaRepo extends JpaRepository<Reserva, Long> {

    List<Reserva> findByUsuario(Usuario usuario);

    List<Reserva> findByDestino(Usuario.Destino destino);

    @Query("SELECT r FROM Reserva r WHERE r.usuario.id = :usuarioId ORDER BY r.fecha DESC")
    List<Reserva> findReservasByUsuarioId(@Param("usuarioId") Long usuarioId);

    @Query("SELECT r FROM Reserva r WHERE r.fecha BETWEEN :fechaInicio AND :fechaFin")
    List<Reserva> findReservasByFechaRange(@Param("fechaInicio") LocalDate fechaInicio,
                                           @Param("fechaFin") LocalDate fechaFin);

    @Query("SELECT r FROM Reserva r WHERE r.destino.id = :destinoId AND r.usuario.id = :usuarioId")
    List<Reserva> findReservasByDestinoAndUsuario(@Param("destinoId") Long destinoId,
                                                  @Param("usuarioId") Long usuarioId);
}
