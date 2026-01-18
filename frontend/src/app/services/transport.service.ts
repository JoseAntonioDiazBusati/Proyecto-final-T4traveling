import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface Transport {
  id: string;
  type: 'automovil' | 'autobus' | 'avion';
  name: string;
  company: string;
  price: number;
  continent: string;
  description: string;
  icon: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransportService {
  private mockTransports: Transport[] = [
    // Automóviles
    { id: 't1', type: 'automovil', name: 'Renault Clio', company: 'EuropCar', price: 45, continent: 'Europa', description: 'Compacto económico', icon: '🚗' },
    { id: 't2', type: 'automovil', name: 'Toyota Corolla', company: 'Hertz', price: 55, continent: 'Asia', description: 'Sedán confortable', icon: '🚗' },
    { id: 't3', type: 'automovil', name: 'Ford Focus', company: 'Avis', price: 50, continent: 'América', description: 'Sedán familiar', icon: '🚗' },
    { id: 't4', type: 'automovil', name: 'Peugeot 308', company: 'Sixt', price: 48, continent: 'Europa', description: 'Berlina moderna', icon: '🚗' },
    { id: 't5', type: 'automovil', name: 'Honda Civic', company: 'Budget', price: 52, continent: 'Asia', description: 'Sedán deportivo', icon: '🚗' },

    // Autobuses
    { id: 't6', type: 'autobus', name: 'FlixBus', company: 'FlixBus', price: 25, continent: 'Europa', description: 'Bus interurbano', icon: '🚌' },
    { id: 't7', type: 'autobus', name: 'Greyhound', company: 'Greyhound', price: 30, continent: 'América', description: 'Bus de larga distancia', icon: '🚌' },
    { id: 't8', type: 'autobus', name: 'ALSA', company: 'ALSA', price: 22, continent: 'Europa', description: 'Bus premium', icon: '🚌' },
    { id: 't9', type: 'autobus', name: 'Willer Express', company: 'Willer', price: 28, continent: 'Asia', description: 'Bus de lujo', icon: '🚌' },
    { id: 't10', type: 'autobus', name: 'Intercape', company: 'Intercape', price: 20, continent: 'África', description: 'Bus turístico', icon: '🚌' },

    // Aviones
    { id: 't11', type: 'avion', name: 'Vuelo Economy', company: 'Iberia', price: 250, continent: 'Europa', description: 'Clase económica', icon: '✈️' },
    { id: 't12', type: 'avion', name: 'Vuelo Economy', company: 'American Airlines', price: 450, continent: 'América', description: 'Clase económica', icon: '✈️' },
    { id: 't13', type: 'avion', name: 'Vuelo Economy', company: 'Japan Airlines', price: 650, continent: 'Asia', description: 'Clase económica', icon: '✈️' },
    { id: 't14', type: 'avion', name: 'Vuelo Business', company: 'Air France', price: 800, continent: 'Europa', description: 'Clase business', icon: '✈️' },
    { id: 't15', type: 'avion', name: 'Vuelo Business', company: 'Emirates', price: 1200, continent: 'Asia', description: 'Clase business', icon: '✈️' },
  ];

  getTransports(): Observable<Transport[]> {
    return of(this.mockTransports);
  }

  getTransportById(id: string): Observable<Transport | undefined> {
    return of(this.mockTransports.find(t => t.id === id));
  }

  filterByContinent(continent: string): Observable<Transport[]> {
    return of(this.mockTransports.filter(t => t.continent === continent));
  }

  filterByType(type: 'automovil' | 'autobus' | 'avion'): Observable<Transport[]> {
    return of(this.mockTransports.filter(t => t.type === type));
  }

  filterByContinentAndType(continent: string, type: 'automovil' | 'autobus' | 'avion'): Observable<Transport[]> {
    return of(this.mockTransports.filter(t => t.continent === continent && t.type === type));
  }
}
