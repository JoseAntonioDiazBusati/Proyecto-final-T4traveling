package org.example.backend.repo;

import org.example.backend.model.Transporte;
import org.example.backend.model.entity.TipoTransporte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TransporteRepo extends JpaRepository<Transporte, Long> {

    Optional<Transporte> findByTipo(TipoTransporte tipo);

    @Query("SELECT t FROM Transporte t WHERE t.tipo = :tipo")
    List<Transporte> findTransportesByTipo(@Param("tipo") TipoTransporte tipo);

    @Query("SELECT DISTINCT t FROM Transporte t JOIN t.reservas r WHERE r.usuario.id = :usuarioId")
    List<Transporte> findTransportesUtilizadosByUsuario(@Param("usuarioId") Long usuarioId);
}