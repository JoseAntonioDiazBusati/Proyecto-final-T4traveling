import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de autenticación
 *
 * Añade el token JWT a las peticiones HTTP salientes.
 * Se excluyen las rutas de autenticación (login, registro).
 *
 * Características:
 * - Inyecta token Bearer en el header Authorization
 * - Excluye endpoints públicos
 * - Maneja casos donde no hay token
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const authService = inject(AuthService);

  // Lista de endpoints que no requieren autenticación
  const publicEndpoints = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/auth/refresh'
  ];

  // Verificar si es un endpoint público
  const isPublicEndpoint = publicEndpoints.some(endpoint =>
    req.url.includes(endpoint)
  );

  // Si es público o no hay autenticación, continuar sin modificar
  if (isPublicEndpoint || !authService.isAuthenticated()) {
    return next(req);
  }

  // Obtener el token del servicio de autenticación
  const token = authService.getToken?.() ?? localStorage.getItem('t4traveling-token');

  // Si hay token, clonar la request y añadir el header
  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(authReq);
  }

  return next(req);
};

