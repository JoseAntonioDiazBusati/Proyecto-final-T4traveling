import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './guards/auth.guard';
import { unsavedChangesGuard } from './guards/unsaved-changes.guard';
import {
  destinationResolver,
  destinationsListResolver,
  featuredDestinationsResolver
} from './resolvers/destination.resolver';

/**
 * Configuración de rutas de la aplicación T4 Traveling
 *
 * Características implementadas:
 * - Rutas principales con lazy loading
 * - Rutas con parámetros (/destinos/:id)
 * - Rutas hijas anidadas
 * - Ruta wildcard para 404
 * - Guards (CanActivate, CanDeactivate)
 * - Resolvers para precargar datos
 * - Breadcrumbs dinámicos (data.breadcrumb)
 */
export const routes: Routes = [
  // =====================================
  // RUTAS PÚBLICAS
  // =====================================

  /**
   * Home - Página principal
   * Usa resolver para precargar destinos destacados
   */
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    resolve: {
      featuredDestinations: featuredDestinationsResolver
    },
    data: {
      breadcrumb: 'Inicio',
      breadcrumbIcon: '🏠'
    }
  },

  /**
   * Login - Solo accesible si NO está autenticado
   */
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    canActivate: [guestGuard],
    data: {
      breadcrumb: 'Iniciar sesión'
    }
  },

  /**
   * Style Guide - Guía de estilos del sistema
   * Acceso directo para desarrollo y documentación
   */
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide.component').then(m => m.StyleGuideComponent),
    data: {
      breadcrumb: 'Guía de Estilos',
      breadcrumbIcon: '🎨'
    }
  },

  /**
   * Formularios - Demo de formularios y validaciones
   */
  {
    path: 'formularios',
    loadComponent: () => import('./pages/forms-demo/forms-demo.component').then(m => m.FormsDemoComponent),
    data: {
      breadcrumb: 'Formularios',
      breadcrumbIcon: '📝'
    }
  },

  /**
   * Componentes - Demo interactiva de componentes
   */
  {
    path: 'componentes',
    loadComponent: () => import('./pages/interactive-demo/interactive-demo.component').then(m => m.InteractiveDemoComponent),
    data: {
      breadcrumb: 'Componentes',
      breadcrumbIcon: '🧩'
    }
  },

  /**
   * Servicios - Demo de servicios y comunicación
   */
  {
    path: 'servicios',
    loadComponent: () => import('./pages/services-demo/services-demo.component').then(m => m.ServicesDemoComponent),
    data: {
      breadcrumb: 'Servicios',
      breadcrumbIcon: '⚙️'
    }
  },

  // =====================================
  // RUTAS DE DESTINOS (con rutas hijas)
  // =====================================

  {
    path: 'destinos',
    data: {
      breadcrumb: 'Destinos',
      breadcrumbIcon: '🌍'
    },
    children: [
      /**
       * Listado de destinos
       * Usa resolver para precargar todos los destinos
       */
      {
        path: '',
        loadComponent: () => import('./pages/destinations/destinations.component').then(m => m.DestinationsComponent),
        resolve: {
          destinations: destinationsListResolver
        }
      },

      /**
       * Detalle de destino - Ruta con parámetro :id
       * Usa resolver para precargar el destino específico
       * Breadcrumb dinámico basado en datos resueltos
       */
      {
        path: ':id',
        loadComponent: () => import('./pages/destination-detail/destination-detail.component').then(m => m.DestinationDetailComponent),
        resolve: {
          destination: destinationResolver
        },
        data: {
          breadcrumb: (data: any) => data['destination']?.name || 'Detalle'
        }
      }
    ]
  },

  // =====================================
  // RUTAS PROTEGIDAS (requieren autenticación)
  // =====================================

  /**
   * Reservar - Requiere autenticación
   * Usa CanDeactivate para prevenir pérdida de datos
   */
  {
    path: 'reservar',
    loadComponent: () => import('./pages/forms-demo/booking-form.component').then(m => m.BookingFormComponent),
    canActivate: [authGuard],
    canDeactivate: [unsavedChangesGuard],
    data: {
      breadcrumb: 'Reservar',
      breadcrumbIcon: '📝'
    }
  },

  /**
   * Mis reservas - Requiere autenticación
   */
  {
    path: 'mis-reservas',
    loadComponent: () => import('./pages/services-demo/services-demo.component').then(m => m.ServicesDemoComponent),
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Mis reservas',
      breadcrumbIcon: '📋'
    }
  },

  /**
   * Perfil de usuario - Requiere autenticación
   */
  {
    path: 'perfil',
    loadComponent: () => import('./pages/forms-demo/registration-form.component').then(m => m.RegistrationFormComponent),
    canActivate: [authGuard],
    data: {
      breadcrumb: 'Mi perfil',
      breadcrumbIcon: '👤'
    }
  },

  // =====================================
  // RUTAS DE ADMINISTRACIÓN
  // =====================================

  /**
   * Panel de administración - Requiere rol admin
   */
  {
    path: 'admin',
    canActivate: [adminGuard],
    data: {
      breadcrumb: 'Administración',
      breadcrumbIcon: '⚙️'
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/interactive-demo/interactive-demo.component').then(m => m.InteractiveDemoComponent)
      },
      {
        path: 'destinos',
        loadComponent: () => import('./pages/services-demo/services-demo.component').then(m => m.ServicesDemoComponent),
        data: {
          breadcrumb: 'Gestionar destinos'
        }
      }
    ]
  },


  // =====================================
  // RUTAS DE ERROR
  // =====================================

  /**
   * Acceso no autorizado (403)
   */
  {
    path: 'unauthorized',
    loadComponent: () => import('./pages/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent),
    data: {
      breadcrumb: 'Acceso denegado'
    }
  },

  /**
   * Página no encontrada (404)
   */
  {
    path: 'not-found',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    data: {
      breadcrumb: 'No encontrado'
    }
  },

  /**
   * Wildcard - Redirige cualquier ruta no encontrada a 404
   */
  {
    path: '**',
    redirectTo: 'not-found'
  }
];

