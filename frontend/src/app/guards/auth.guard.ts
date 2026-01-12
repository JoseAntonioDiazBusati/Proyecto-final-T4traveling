import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * AuthGuard - Guard funcional para proteger rutas
 *
 * Verifica si el usuario está autenticado antes de permitir acceso a la ruta.
 * Si no está autenticado, redirige al login guardando la URL de retorno.
 *
 * Uso en rutas:
 * {
 *   path: 'protected',
 *   canActivate: [authGuard],
 *   component: ProtectedComponent
 * }
 */
export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Guardar la URL intentada para redirigir después del login
  authService.setReturnUrl(state.url);

  // Redirigir al login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url }
  });

  return false;
};

/**
 * AdminGuard - Guard para rutas de administrador
 *
 * Verifica que el usuario esté autenticado Y tenga rol de admin.
 */
export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    authService.setReturnUrl(state.url);
    router.navigate(['/login']);
    return false;
  }

  if (!authService.hasRole('admin')) {
    // Usuario autenticado pero sin permisos
    router.navigate(['/unauthorized']);
    return false;
  }

  return true;
};

/**
 * GuestGuard - Guard para rutas de invitados
 *
 * Solo permite acceso si NO está autenticado (ej: página de login).
 * Si está autenticado, redirige al home.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};

