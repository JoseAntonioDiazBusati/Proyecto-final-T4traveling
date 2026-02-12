package org.example.backend.service;

import org.example.backend.model.Usuario;
import org.example.backend.repo.UsuarioRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UsuarioService {

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // CREATE
    public Usuario crearUsuario(Usuario usuario) {
        // Validar que el email no exista
        if (usuarioRepo.findByEmail(usuario.getEmail()).isPresent()) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        // Validar que el nombre de usuario no exista
        if (usuarioRepo.findByNombre(usuario.getNombre()).isPresent()) {
            throw new IllegalArgumentException("El nombre de usuario ya existe");
        }

        return usuarioRepo.save(usuario);
    }

    // READ
    @Transactional(readOnly = true)
    public List<Usuario> obtenerTodos() {
        return usuarioRepo.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorId(Long id) {
        return usuarioRepo.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorEmail(String email) {
        return usuarioRepo.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public Optional<Usuario> obtenerPorNombre(String nombre) {
        return usuarioRepo.findByNombre(nombre);
    }

    @Transactional(readOnly = true)
    public List<Usuario> obtenerPorUbicacion(String ubicacion) {
        return usuarioRepo.findByUbicacion(ubicacion);
    }

    // UPDATE
    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepo.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado con id: " + id));

        // Validar email único si se está cambiando
        if (!usuario.getEmail().equals(usuarioActualizado.getEmail())) {
            if (usuarioRepo.findByEmail(usuarioActualizado.getEmail()).isPresent()) {
                throw new IllegalArgumentException("El email ya está registrado");
            }
            usuario.setEmail(usuarioActualizado.getEmail());
        }

        // Validar nombre único si se está cambiando
        if (!usuario.getNombre().equals(usuarioActualizado.getNombre())) {
            if (usuarioRepo.findByNombre(usuarioActualizado.getNombre()).isPresent()) {
                throw new IllegalArgumentException("El nombre de usuario ya existe");
            }
            usuario.setNombre(usuarioActualizado.getNombre());
        }

        usuario.setUbicacion(usuarioActualizado.getUbicacion());

        // Solo actualizar password si se proporciona uno nuevo
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            usuario.setPassword(passwordEncoder.encode(usuarioActualizado.getPassword()));
        }

        return usuarioRepo.save(usuario);
    }

    // DELETE
    public boolean eliminarUsuario(Long id) {
        if (!usuarioRepo.existsById(id)) {
            return false;
        }
        usuarioRepo.deleteById(id);
        return true;
    }

    // LÓGICA DE NEGOCIO
    @Transactional(readOnly = true)
    public boolean tieneReservasActivas(Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return usuario.getReservas() != null && !usuario.getReservas().isEmpty();
    }

    @Transactional(readOnly = true)
    public int contarReservas(Long usuarioId) {
        Usuario usuario = usuarioRepo.findById(usuarioId)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        return usuario.getReservas() != null ? usuario.getReservas().size() : 0;
    }
}

