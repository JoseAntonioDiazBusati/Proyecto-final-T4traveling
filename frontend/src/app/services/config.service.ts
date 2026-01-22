import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

/**
 * ConfigService - Servicio para manejar configuraciones dinámicas
 *
 * Características:
 * - Detecta automáticamente el dominio actual
 * - Funciona en desarrollo (localhost) y producción (Render, Netlify, etc.)
 * - Proporciona URLs base para la aplicación y API
 */
@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private _baseUrl: string;
  private _apiUrl: string;

  constructor() {
    // Detectar URL base automáticamente
    if (environment.production) {
      // En producción, usar window.location.origin (detecta automáticamente)
      this._baseUrl = window.location.origin;
      // API puede estar en el mismo dominio o en un subdominio
      this._apiUrl = environment.apiUrl.startsWith('http')
        ? environment.apiUrl
        : `${window.location.origin}${environment.apiUrl}`;
    } else {
      // En desarrollo, usar configuración fija
      this._baseUrl = environment.appUrl;
      this._apiUrl = environment.apiUrl;
    }
  }

  /**
   * Obtiene la URL base de la aplicación
   * Ejemplos:
   * - Desarrollo: http://localhost:4200
   * - Producción: https://tu-app.onrender.com
   */
  get baseUrl(): string {
    return this._baseUrl;
  }

  /**
   * Obtiene la URL de la API
   * Ejemplos:
   * - Desarrollo: http://localhost:8080/api
   * - Producción: https://tu-app.onrender.com/api
   */
  get apiUrl(): string {
    return this._apiUrl;
  }

  /**
   * Obtiene la URL completa de una ruta
   * @param path Ruta relativa (ej: '/destinos', '/login')
   * @returns URL completa
   */
  getFullUrl(path: string): string {
    // Asegurar que el path comience con /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this._baseUrl}${normalizedPath}`;
  }

  /**
   * Verifica si está en modo producción
   */
  get isProduction(): boolean {
    return environment.production;
  }

  /**
   * Verifica si está en modo desarrollo
   */
  get isDevelopment(): boolean {
    return !environment.production;
  }

  /**
   * Obtiene el dominio actual sin protocolo
   * Ejemplos:
   * - localhost:4200
   * - tu-app.onrender.com
   */
  get domain(): string {
    return window.location.host;
  }

  /**
   * Verifica si la app está corriendo en localhost
   */
  get isLocalhost(): boolean {
    return window.location.hostname === 'localhost' ||
           window.location.hostname === '127.0.0.1';
  }
}

