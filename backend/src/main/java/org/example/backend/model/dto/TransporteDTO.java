package org.example.backend.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.backend.model.entity.TipoTransporte;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransporteDTO {

    private Long id;
    private TipoTransporte tipo;
}