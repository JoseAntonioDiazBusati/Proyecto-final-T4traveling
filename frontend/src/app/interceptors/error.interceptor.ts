import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';
import { AuthService } from '../services/auth.service';

/**
 * Interceptor de manejo de errores HTTP
 *
 * Captura y procesa errores HTTP de manera centralizada.
 * Proporciona feedback al usuario y maneja redirecciones según el tipo de error.
 *
 * Características:
 * - Manejo de errores 401 (No autorizado) -> Logout y redirección a login
 * - Manejo de errores 403 (Prohibido) -> Redirección a página de no autorizado
 * - Manejo de errores 404 (No encontrado) -> Notificación al usuario
 * - Manejo de errores 500+ (Servidor) -> Notificación de error del servidor
 * - Manejo de errores de red -> Notificación de conexión
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      // Error de red (sin conexión o servidor no disponible)
      if (error.status === 0) {
        errorMessage = 'No se puede conectar con el servidor. Verifique su conexión a internet.';
        notificationService.error(errorMessage, { title: 'Error de conexión' });
        return throwError(() => ({ ...error, userMessage: errorMessage }));
      }

      // Manejar diferentes códigos de error HTTP
      switch (error.status) {
        case 400: // Bad Request
          errorMessage = extractErrorMessage(error) || 'Los datos enviados no son válidos';
          notificationService.warning(errorMessage, { title: 'Datos inválidos' });
          break;

        case 401: // Unauthorized
          errorMessage = 'Su sesión ha expirado. Por favor, inicie sesión nuevamente.';
          notificationService.warning(errorMessage, { title: 'Sesión expirada' });
          authService.logout();
          break;

        case 403: // Forbidden
          errorMessage = 'No tiene permisos para realizar esta acción.';
          notificationService.error(errorMessage, { title: 'Acceso denegado' });
          router.navigate(['/unauthorized']);
          break;

        case 404: // Not Found
          errorMessage = extractErrorMessage(error) || 'El recurso solicitado no fue encontrado';
          notificationService.warning(errorMessage, { title: 'No encontrado' });
          break;

        case 409: // Conflict
          errorMessage = extractErrorMessage(error) || 'Existe un conflicto con la operación solicitada';
          notificationService.warning(errorMessage, { title: 'Conflicto' });
          break;

        case 422: // Unprocessable Entity
          errorMessage = extractErrorMessage(error) || 'Los datos no pudieron ser procesados';
          notificationService.warning(errorMessage, { title: 'Error de validación' });
          break;

        case 500: // Internal Server Error
        case 502: // Bad Gateway
        case 503: // Service Unavailable
        case 504: // Gateway Timeout
          errorMessage = 'Ha ocurrido un error en el servidor. Por favor, intente más tarde.';
          notificationService.error(errorMessage, {
            title: 'Error del servidor',
            duration: 8000
          });
          break;

        default:
          errorMessage = extractErrorMessage(error) || `Error: ${error.status}`;
          notificationService.error(errorMessage);
          break;
      }

      // Re-lanzar el error para que pueda ser manejado por el componente si es necesario
      return throwError(() => ({
        ...error,
        userMessage: errorMessage,
        handled: true
      }));
    })
  );
};

/**
 * Extrae el mensaje de error de la respuesta
 */
function extractErrorMessage(error: HttpErrorResponse): string | null {
  if (error.error) {
    // Si es un objeto con propiedad 'error' (formato del backend)
    if (typeof error.error === 'object' && error.error.error) {
      return error.error.error;
    }
    // Si es un objeto con propiedad 'message'
    if (typeof error.error === 'object' && error.error.message) {
      return error.error.message;
    }
    // Si es un string
    if (typeof error.error === 'string') {
      return error.error;
    }
  }
  return error.message || null;
}

