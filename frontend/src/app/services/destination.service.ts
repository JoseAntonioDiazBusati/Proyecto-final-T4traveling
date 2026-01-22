import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

/**
 * Interfaz para un destino
 */
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  category: string;
}

/**
 * Servicio de datos de destinos
 * Ejemplo de servicio con lógica de negocio separada de la presentación
 */
@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private loadingService = inject(LoadingService);
  private notificationService = inject(NotificationService);

  // Datos de ejemplo (en producción vendría de una API)
  private mockDestinations: Destination[] = [
    {
      id: '1',
      name: 'París',
      country: 'Francia',
      description: 'La ciudad del amor y la luz',
      price: 1200,
      image: '/images/paris.jpeg',
      rating: 4.8,
      category: 'Europa'
    },
    {
      id: '2',
      name: 'Barcelona',
      country: 'España',
      description: 'Arte, playa y arquitectura única',
      price: 900,
      image: '/images/barcelona.jpeg',
      rating: 4.6,
      category: 'Europa'
    },
    {
      id: '3',
      name: 'Roma',
      country: 'Italia',
      description: 'Historia antigua en cada esquina',
      price: 1000,
      image: '/images/roma.jpeg',
      rating: 4.8,
      category: 'Europa'
    },
    {
      id: '4',
      name: 'Ámsterdam',
      country: 'Países Bajos',
      description: 'Canales, cultura y historia vibrante',
      price: 1100,
      image: '/images/amsterdam.jpeg',
      rating: 4.7,
      category: 'Europa'
    },
    {
      id: '5',
      name: 'Bruselas',
      country: 'Bélgica',
      description: 'Capital europea con encanto histórico',
      price: 950,
      image: '/images/bruselas.jpeg',
      rating: 4.5,
      category: 'Europa'
    },
    {
      id: '6',
      name: 'Londres',
      country: 'Reino Unido',
      description: 'Tradición británica y modernidad cosmopolita',
      price: 1300,
      image: '/images/londres.jpeg',
      rating: 4.7,
      category: 'Europa'
    },
    {
      id: '7',
      name: 'Kioto',
      country: 'Japón',
      description: 'Templos antiguos y jardines zen',
      price: 1800,
      image: '/images/kioto.jpeg',
      rating: 4.9,
      category: 'Asia'
    },
    {
      id: '8',
      name: 'Pekín',
      country: 'China',
      description: 'Historia milenaria y modernidad imperial',
      price: 1600,
      image: '/images/pekin.jpeg',
      rating: 4.6,
      category: 'Asia'
    },
    {
      id: '9',
      name: 'Nueva York',
      country: 'Estados Unidos',
      description: 'La ciudad que nunca duerme',
      price: 1500,
      image: '/images/ny.webp',
      rating: 4.7,
      category: 'América'
    }
  ];

  /**
   * Obtiene todos los destinos
   */
  getDestinations(): Observable<Destination[]> {
    return this.loadingService.wrap(
      'destinations',
      of(this.mockDestinations).pipe(
        delay(1000), // Simular latencia de red
        catchError(error => {
          this.notificationService.error('Error al cargar destinos');
          return throwError(() => error);
        })
      ),
      'Cargando destinos...'
    );
  }

  /**
   * Obtiene un destino por ID
   */
  getDestinationById(id: string): Observable<Destination | undefined> {
    return this.loadingService.wrap(
      `destination-${id}`,
      of(this.mockDestinations.find(d => d.id === id)).pipe(
        delay(500),
        map(destination => {
          if (!destination) {
            throw new Error('Destino no encontrado');
          }
          return destination;
        }),
        catchError(error => {
          this.notificationService.error('Destino no encontrado');
          return throwError(() => error);
        })
      )
    );
  }

  /**
   * Busca destinos por término
   */
  searchDestinations(query: string): Observable<Destination[]> {
    const lowerQuery = query.toLowerCase();

    return of(
      this.mockDestinations.filter(d =>
        d.name.toLowerCase().includes(lowerQuery) ||
        d.country.toLowerCase().includes(lowerQuery) ||
        d.description.toLowerCase().includes(lowerQuery)
      )
    ).pipe(delay(300));
  }

  /**
   * Filtra destinos por categoría
   */
  filterByCategory(category: string): Observable<Destination[]> {
    return of(
      this.mockDestinations.filter(d => d.category === category)
    ).pipe(delay(300));
  }

  /**
   * Filtra destinos por rango de precio
   */
  filterByPriceRange(min: number, max: number): Observable<Destination[]> {
    return of(
      this.mockDestinations.filter(d => d.price >= min && d.price <= max)
    ).pipe(delay(300));
  }

  /**
   * Obtiene categorías disponibles
   */
  getCategories(): string[] {
    return Array.from(new Set(this.mockDestinations.map(d => d.category)));
  }

  /**
   * Ordena destinos por criterio
   */
  sortDestinations(
    destinations: Destination[],
    sortBy: 'name' | 'price' | 'rating',
    order: 'asc' | 'desc' = 'asc'
  ): Destination[] {
    const sorted = [...destinations].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'rating':
          comparison = a.rating - b.rating;
          break;
      }

      return order === 'asc' ? comparison : -comparison;
    });

    return sorted;
  }

  /**
   * Crea una reserva (ejemplo de operación con loading y notificación)
   */
  createBooking(destinationId: string, data: any): Observable<any> {
    return this.loadingService.wrapGlobal(
      of({ id: this.generateId(), destinationId, ...data }).pipe(
        delay(2000), // Simular operación lenta
        map(booking => {
          this.notificationService.success(
            'Reserva creada exitosamente',
            {
              title: '¡Éxito!',
              duration: 5000,
              action: {
                label: 'Ver detalles',
                callback: () => console.log('Ver detalles de reserva', booking)
              }
            }
          );
          return booking;
        }),
        catchError(error => {
          this.notificationService.error(
            'No se pudo crear la reserva. Por favor, intenta de nuevo.',
            { title: 'Error al crear reserva' }
          );
          return throwError(() => error);
        })
      )
    );
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Obtiene destinos destacados
   */
  getFeaturedDestinations(): Observable<Destination[]> {
    return of(
      this.mockDestinations
        .filter(d => d.rating >= 4.7)
        .slice(0, 3)
    ).pipe(delay(500));
  }

  /**
   * Obtiene recomendaciones basadas en un destino
   */
  getRecommendations(destinationId: string): Observable<Destination[]> {
    const destination = this.mockDestinations.find(d => d.id === destinationId);

    if (!destination) {
      return of([]);
    }

    // Recomendar destinos de la misma categoría
    return of(
      this.mockDestinations
        .filter(d => d.id !== destinationId && d.category === destination.category)
        .slice(0, 3)
    ).pipe(delay(300));
  }
}

