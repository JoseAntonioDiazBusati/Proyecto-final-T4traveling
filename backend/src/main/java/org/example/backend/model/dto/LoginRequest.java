package org.example.backend.model.dto;
}
    private String password;
    @NotBlank(message = "La contraseña es obligatoria")

    private String email;
    @Email(message = "El email debe ser válido")
    @NotBlank(message = "El email es obligatorio")

public class LoginRequest {
@AllArgsConstructor
@NoArgsConstructor
@Data

import lombok.NoArgsConstructor;
import lombok.Data;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;


