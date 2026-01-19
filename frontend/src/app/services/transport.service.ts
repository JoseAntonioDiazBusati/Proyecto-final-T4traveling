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
    // Automóviles (3)
    { id: 't1', type: 'automovil', name: 'Renault Clio Económico', company: 'EuropCar', price: 35, continent: 'Europa', description: 'Compacto ideal para ciudad', icon: '🚗' },
    { id: 't2', type: 'automovil', name: 'Toyota Corolla Sedán', company: 'Hertz', price: 50, continent: 'Asia', description: 'Sedán confortable 5 plazas', icon: '🚗' },
    { id: 't3', type: 'automovil', name: 'Ford Explorer SUV', company: 'Avis', price: 75, continent: 'América', description: 'SUV familiar 7 plazas', icon: '🚙' },

    // Autobuses (3)
    { id: 't4', type: 'autobus', name: 'FlixBus Estándar', company: 'FlixBus', price: 15, continent: 'Europa', description: 'Bus interurbano económico', icon: '🚌' },
    { id: 't5', type: 'autobus', name: 'Greyhound Premium', company: 'Greyhound', price: 25, continent: 'América', description: 'Bus de larga distancia con WiFi', icon: '🚌' },
    { id: 't6', type: 'autobus', name: 'Willer Express Luxury', company: 'Willer', price: 35, continent: 'Asia', description: 'Bus de lujo con asientos reclinables', icon: '🚌' },

    // Aviones (3)
    { id: 't7', type: 'avion', name: 'Vuelo Economy Europa', company: 'Iberia / Vueling', price: 150, continent: 'Europa', description: 'Clase económica, equipaje incluido', icon: '✈️' },
    { id: 't8', type: 'avion', name: 'Vuelo Economy Intercontinental', company: 'American Airlines', price: 400, continent: 'América', description: 'Vuelo largo, comidas incluidas', icon: '✈️' },
    { id: 't9', type: 'avion', name: 'Vuelo Business Premium', company: 'Emirates / Qatar', price: 1200, continent: 'Asia', description: 'Clase business, lounge y prioridad', icon: '🛫' },
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
