package org.example.backend.repo;

import org.example.backend.model.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface UsuarioRepo extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByEmail(String email);

    Optional<Usuario> findByNombre(String nombre);

    @Query("SELECT u FROM Usuario u WHERE u.ubicacion = :ubicacion")
    List<Usuario> findByUbicacion(@Param("ubicacion") String ubicacion);

    @Query("SELECT u FROM Usuario u WHERE u.email LIKE %:email%")
    List<Usuario> findUsuariosByEmailContaining(@Param("email") String email);
}