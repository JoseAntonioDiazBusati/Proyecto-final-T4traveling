import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router, Data } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

/**
 * Interfaz para un elemento del breadcrumb
 */
export interface Breadcrumb {
  label: string;
  url: string;
  icon?: string;
  isActive: boolean;
}

/**
 * BreadcrumbService - Servicio para generar breadcrumbs dinámicos
 *
 * Genera automáticamente breadcrumbs basándose en la configuración de rutas.
 * Las rutas deben incluir data.breadcrumb para aparecer en el breadcrumb.
 *
 * Configuración en rutas:
 * ```typescript
 * {
 *   path: 'destinos',
 *   data: {
 *     breadcrumb: 'Destinos',
 *     breadcrumbIcon: '🌍' // opcional
 *   }
 * }
 * ```
 *
 * Para breadcrumbs dinámicos con parámetros:
 * ```typescript
 * {
 *   path: ':id',
 *   data: {
 *     breadcrumb: (data: Data) => data['destination']?.name || 'Detalle'
 *   }
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  // Subject para los breadcrumbs actuales
  private breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  public breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private router: Router) {
    // Escuchar cambios de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const breadcrumbs = this.createBreadcrumbs(this.router.routerState.snapshot.root);
      this.breadcrumbsSubject.next(breadcrumbs);
    });
  }

  /**
   * Crea los breadcrumbs recursivamente desde la raíz de rutas
   */
  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    // Obtener los hijos de la ruta
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      // Construir la URL
      const routeUrl = child.url.map(segment => segment.path).join('/');

      if (routeUrl) {
        url += `/${routeUrl}`;
      }

      // Obtener el label del breadcrumb
      const label = this.getLabel(child.data, child);

      if (label) {
        const breadcrumb: Breadcrumb = {
          label,
          url,
          icon: child.data['breadcrumbIcon'],
          isActive: child.children.length === 0 ||
                    !child.children.some(c => c.data['breadcrumb'])
        };
        breadcrumbs.push(breadcrumb);
      }

      // Recursión para rutas hijas
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  /**
   * Obtiene el label del breadcrumb
   * Soporta string estático o función dinámica
   */
  private getLabel(data: Data, route: ActivatedRouteSnapshot): string | null {
    const breadcrumb = data['breadcrumb'];

    if (!breadcrumb) {
      return null;
    }

    // Si es una función, ejecutarla con los datos resueltos
    if (typeof breadcrumb === 'function') {
      return breadcrumb(route.data);
    }

    // Si es un string, devolverlo directamente
    return breadcrumb;
  }

  /**
   * Obtiene los breadcrumbs actuales de forma síncrona
   */
  getBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.value;
  }

  /**
   * Añade un breadcrumb manualmente (para casos especiales)
   */
  addBreadcrumb(breadcrumb: Breadcrumb): void {
    const current = this.breadcrumbsSubject.value;
    // Marcar todos como no activos
    current.forEach(b => b.isActive = false);
    // Añadir el nuevo como activo
    this.breadcrumbsSubject.next([...current, { ...breadcrumb, isActive: true }]);
  }

  /**
   * Actualiza el label del último breadcrumb
   */
  updateLastBreadcrumb(label: string): void {
    const current = [...this.breadcrumbsSubject.value];
    if (current.length > 0) {
      current[current.length - 1].label = label;
      this.breadcrumbsSubject.next(current);
    }
  }
}

