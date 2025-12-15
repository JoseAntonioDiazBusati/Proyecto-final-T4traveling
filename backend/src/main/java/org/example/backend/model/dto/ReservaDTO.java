package org.example.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReservaDTO {

    private Long id;
    private Long usuarioId;
    private Long destinoId;
    private Long transporteId;
    private LocalDate fecha;
}