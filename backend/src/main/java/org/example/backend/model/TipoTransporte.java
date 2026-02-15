package org.example.backend.model;

public enum TipoTransporte {
    AVION("Avión"),
    AUTOBUS("Autobús"),
    COCHE("Coche");

    private final String descripcion;

    TipoTransporte(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getDescripcion() {
        return descripcion;
    }
}
