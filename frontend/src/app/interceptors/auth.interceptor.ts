import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';

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

  // Si es público o no hay token de autenticación, continuar sin modificar
  const token = localStorage.getItem('t4traveling-token');

  if (isPublicEndpoint || !token) {
    return next(req);
  }

  // Si hay token, clonar la request y añadir el header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};

