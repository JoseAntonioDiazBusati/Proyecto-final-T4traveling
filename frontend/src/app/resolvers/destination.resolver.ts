import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, delay, of } from 'rxjs';
import { DestinationService, Destination } from '../services/destination.service';

/**
 * DestinationResolver - Resolver para precargar datos de destino
 *
 * Precarga los datos de un destino específico antes de activar la ruta.
 * Muestra loading mientras resuelve y maneja errores.
 *
 * Uso en rutas:
 * {
 *   path: 'destino/:id',
 *   resolve: { destination: destinationResolver },
 *   component: DestinationDetailComponent
 * }
 *
 * En el componente:
 * ```typescript
 * constructor(private route: ActivatedRoute) {
 *   this.destination = this.route.snapshot.data['destination'];
 * }
 * ```
 */
export const destinationResolver: ResolveFn<Destination | null | undefined> = (route) => {
  const destinationService = inject(DestinationService);
  const router = inject(Router);

  const id = route.paramMap.get('id');

  if (!id) {
    router.navigate(['/destinos']);
    return of(null);
  }

  return destinationService.getDestinationById(id).pipe(
    delay(500),
    catchError((error) => {
      console.error('Error al cargar destino:', error);
      router.navigate(['/not-found']);
      return of(null);
    })
  );
};

/**
 * DestinationsListResolver - Resolver para lista de destinos
 *
 * Precarga todos los destinos antes de mostrar la lista.
 */
export const destinationsListResolver: ResolveFn<Destination[]> = () => {
  const destinationService = inject(DestinationService);

  return destinationService.getDestinations().pipe(
    delay(300), // Simular latencia
    catchError((error) => {
      console.error('Error al cargar destinos:', error);
      return of([]);
    })
  );
};

/**
 * FeaturedDestinationsResolver - Resolver para destinos destacados
 *
 * Precarga destinos destacados para la página principal.
 */
export const featuredDestinationsResolver: ResolveFn<Destination[]> = () => {
  const destinationService = inject(DestinationService);

  return destinationService.getFeaturedDestinations().pipe(
    catchError(() => of([]))
  );
};

