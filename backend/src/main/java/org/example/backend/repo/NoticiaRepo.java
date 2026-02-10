package org.example.backend.repo;

import org.example.backend.model.Noticia;
import java.util.List;
import java.util.Optional;

public interface NoticiaRepo {

    Optional<Noticia> findByNombre(String nombre);

    List<Noticia> findAll();
}
