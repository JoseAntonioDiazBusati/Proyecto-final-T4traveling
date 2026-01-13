import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoadingService } from '../loading.service';

/**
 * Opciones para las peticiones HTTP
 */
export interface HttpRequestOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | string[] };
  loadingKey?: string;
  loadingMessage?: string;
  showLoading?: boolean;
  retryCount?: number;
  timeoutMs?: number;
}

/**
 * Servicio base HTTP
 *
 * Proporciona métodos genéricos para realizar peticiones HTTP
 * con manejo centralizado de errores, retry logic y estados de carga.
 *
 * Características:
 * - Métodos CRUD genéricos tipados
 * - Retry automático configurable
 * - Timeout configurable
 * - Integración con LoadingService
 * - Soporte para FormData (upload de archivos)
 * - Construcción de query params
 */
@Injectable({
  providedIn: 'root'
})
export class BaseHttpService {
  protected http = inject(HttpClient);
  protected loadingService = inject(LoadingService);

  protected apiUrl = environment.apiUrl;

  /**
   * Realiza una petición GET
   */
  get<T>(endpoint: string, options: HttpRequestOptions = {}): Observable<T> {
    const request$ = this.http.get<T>(
      this.buildUrl(endpoint),
      this.buildHttpOptions(options)
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout),
      retry({
        count: options.retryCount ?? environment.retryAttempts,
        delay: environment.retryDelay
      }),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, options);
  }

  /**
   * Realiza una petición POST
   */
  post<T>(endpoint: string, body: any, options: HttpRequestOptions = {}): Observable<T> {
    const request$ = this.http.post<T>(
      this.buildUrl(endpoint),
      body,
      this.buildHttpOptions(options)
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, options);
  }

  /**
   * Realiza una petición PUT
   */
  put<T>(endpoint: string, body: any, options: HttpRequestOptions = {}): Observable<T> {
    const request$ = this.http.put<T>(
      this.buildUrl(endpoint),
      body,
      this.buildHttpOptions(options)
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, options);
  }

  /**
   * Realiza una petición PATCH
   */
  patch<T>(endpoint: string, body: any, options: HttpRequestOptions = {}): Observable<T> {
    const request$ = this.http.patch<T>(
      this.buildUrl(endpoint),
      body,
      this.buildHttpOptions(options)
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, options);
  }

  /**
   * Realiza una petición DELETE
   */
  delete<T>(endpoint: string, options: HttpRequestOptions = {}): Observable<T> {
    const request$ = this.http.delete<T>(
      this.buildUrl(endpoint),
      this.buildHttpOptions(options)
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, options);
  }

  /**
   * Realiza una petición POST con FormData (para upload de archivos)
   */
  uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string>,
    options: HttpRequestOptions = {}
  ): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    // Añadir datos adicionales si existen
    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    // Para FormData, no establecemos Content-Type manualmente
    // El navegador lo hará automáticamente con el boundary correcto
    const request$ = this.http.post<T>(
      this.buildUrl(endpoint),
      formData
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout * 2), // Más tiempo para uploads
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, {
      ...options,
      loadingMessage: options.loadingMessage ?? 'Subiendo archivo...'
    });
  }

  /**
   * Realiza múltiples peticiones de upload
   */
  uploadFiles<T>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files',
    additionalData?: Record<string, string>,
    options: HttpRequestOptions = {}
  ): Observable<T> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file, file.name);
    });

    if (additionalData) {
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });
    }

    const request$ = this.http.post<T>(
      this.buildUrl(endpoint),
      formData
    ).pipe(
      timeout(options.timeoutMs ?? environment.apiTimeout * 3),
      catchError(this.handleError)
    );

    return this.wrapWithLoading(request$, {
      ...options,
      loadingMessage: options.loadingMessage ?? `Subiendo ${files.length} archivo(s)...`
    });
  }

  /**
   * Construye la URL completa del endpoint
   */
  protected buildUrl(endpoint: string): string {
    // Si el endpoint ya es una URL completa, usarla directamente
    if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
      return endpoint;
    }

    // Asegurar que el endpoint comienza con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.apiUrl}${normalizedEndpoint}`;
  }

  /**
   * Construye las opciones HTTP
   */
  protected buildHttpOptions(options: HttpRequestOptions): {
    headers?: HttpHeaders;
    params?: HttpParams;
  } {
    const result: { headers?: HttpHeaders; params?: HttpParams } = {};

    if (options.headers) {
      result.headers = options.headers instanceof HttpHeaders
        ? options.headers
        : new HttpHeaders(options.headers);
    }

    if (options.params) {
      result.params = options.params instanceof HttpParams
        ? options.params
        : new HttpParams({ fromObject: options.params as Record<string, string> });
    }

    return result;
  }

  /**
   * Construye HttpParams a partir de un objeto
   */
  buildParams(params: Record<string, any>): HttpParams {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = params[key];
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  /**
   * Envuelve el observable con manejo de loading
   */
  protected wrapWithLoading<T>(
    request$: Observable<T>,
    options: HttpRequestOptions
  ): Observable<T> {
    if (options.showLoading === false) {
      return request$;
    }

    const loadingKey = options.loadingKey ?? 'http-request';
    const loadingMessage = options.loadingMessage;

    return this.loadingService.wrap(loadingKey, request$, loadingMessage);
  }

  /**
   * Manejador de errores
   */
  protected handleError = (error: HttpErrorResponse): Observable<never> => {
    // El error será manejado por el interceptor de errores
    // Aquí solo lo re-lanzamos para que el componente pueda manejarlo si lo necesita
    return throwError(() => error);
  };
}

