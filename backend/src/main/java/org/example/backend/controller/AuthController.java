package org.example.backend.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.example.backend.model.dto.AuthResponse;
import org.example.backend.model.dto.LoginRequest;
import org.example.backend.model.dto.RegisterRequest;
import org.example.backend.model.Rol;
import org.example.backend.model.Usuario;
import org.example.backend.repo.UsuarioRepo;
import org.example.backend.security.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Autenticación", description = "Endpoints de autenticación y registro")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UsuarioRepo usuarioRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Login exitoso",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "401", description = "Credenciales inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            Usuario usuario = usuarioRepo.findByEmail(loginRequest.getEmail())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

            AuthResponse response = new AuthResponse(
                    token,
                    usuario.getId(),
                    usuario.getNombre(),
                    usuario.getEmail(),
                    usuario.getRol().name()
            );

            return ResponseEntity.ok(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
        }
    }

    @Operation(summary = "Registrar usuario", description = "Crea una nueva cuenta de usuario")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Usuario registrado exitosamente",
                    content = @Content(schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "Datos inválidos o email ya registrado")
    })
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Verificar si el email ya existe
        if (usuarioRepo.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El email ya está registrado"));
        }

        // Verificar si el nombre ya existe
        if (usuarioRepo.findByNombre(registerRequest.getNombre()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "El nombre de usuario ya existe"));
        }

        // Crear nuevo usuario
        Usuario usuario = new Usuario();
        usuario.setNombre(registerRequest.getNombre());
        usuario.setUbicacion(registerRequest.getUbicacion());
        usuario.setEmail(registerRequest.getEmail());
        usuario.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        usuario.setRol(Rol.ROLE_USER);

        Usuario savedUsuario = usuarioRepo.save(usuario);

        // Generar token para el nuevo usuario
        UserDetails userDetails = org.springframework.security.core.userdetails.User
                .withUsername(savedUsuario.getEmail())
                .password(savedUsuario.getPassword())
                .authorities(savedUsuario.getRol().name())
                .build();

        String token = jwtService.generateToken(userDetails);

        AuthResponse response = new AuthResponse(
                token,
                savedUsuario.getId(),
                savedUsuario.getNombre(),
                savedUsuario.getEmail(),
                savedUsuario.getRol().name()
        );

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
