package org.example.backend.repo;

import org.example.backend.model.entity.Destino;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface DestinoRepo extends JpaRepository<Destino, Long> {

    Optional<Destino> findByNombre(String nombre);

    @Query("SELECT d FROM Destino d WHERE d.nombre LIKE %:nombre%")
    List<Destino> findDestinosByNombreContaining(@Param("nombre") String nombre);

    @Query("SELECT DISTINCT d FROM Destino d JOIN d.reservas r WHERE r.usuario.id = :usuarioId")
    List<Destino> findDestinosVisitadosByUsuario(@Param("usuarioId") Long usuarioId);
}
