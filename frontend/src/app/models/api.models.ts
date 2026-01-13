/**
 * Interfaces de modelos para la API de T4Traveling
 *
 * Estas interfaces corresponden a las entidades del backend Spring Boot
 * y se utilizan para el tipado de las respuestas HTTP.
 */

// ==========================================
// ENTIDADES PRINCIPALES
// ==========================================

/**
 * Interfaz para Destino
 * Corresponde a la entidad Destino del backend
 */
export interface Destino {
  id: number;
  nombre: string;
}

/**
 * Interfaz para crear/actualizar un destino
 */
export interface DestinoRequest {
  nombre: string;
}

/**
 * Interfaz para Usuario
 * Corresponde a la entidad Usuario del backend
 */
export interface Usuario {
  id: number;
  nombre: string;
  ubicacion: string;
  email: string;
  password?: string;
}

/**
 * Interfaz para crear un usuario
 */
export interface UsuarioCreateRequest {
  nombre: string;
  ubicacion: string;
  email: string;
  password: string;
}

/**
 * Interfaz para actualizar un usuario (sin password)
 */
export interface UsuarioUpdateRequest {
  nombre: string;
  ubicacion: string;
  email: string;
}

/**
 * Tipos de transporte disponibles
 */
export type TipoTransporte = 'AVION' | 'AUTOBUS' | 'COCHE';

/**
 * Interfaz para Transporte
 * Corresponde a la entidad Transporte del backend
 */
export interface Transporte {
  id: number;
  tipo: TipoTransporte;
}

/**
 * Interfaz para crear/actualizar un transporte
 */
export interface TransporteRequest {
  tipo: TipoTransporte;
}

/**
 * Interfaz para Reserva
 * Corresponde a la entidad Reserva del backend
 */
export interface Reserva {
  id: number;
  usuario: Usuario;
  destino: Destino;
  transporte: Transporte;
  fecha: string; // ISO date string (YYYY-MM-DD)
}

/**
 * Interfaz para crear una reserva
 */
export interface ReservaCreateRequest {
  usuario: { id: number };
  destino: { id: number };
  transporte: { id: number };
  fecha: string;
}

/**
 * Interfaz para actualizar una reserva
 */
export interface ReservaUpdateRequest {
  usuario?: { id: number };
  destino?: { id: number };
  transporte?: { id: number };
  fecha?: string;
}

// ==========================================
// RESPUESTAS DE API
// ==========================================

/**
 * Respuesta de error del servidor
 */
export interface ApiError {
  error: string;
  message?: string;
  timestamp?: string;
  status?: number;
  path?: string;
}

/**
 * Respuesta genérica de la API
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

/**
 * Respuesta paginada
 */
export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number; // página actual
  first: boolean;
  last: boolean;
  empty: boolean;
}

/**
 * Parámetros de paginación
 */
export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
  direction?: 'asc' | 'desc';
}

/**
 * Parámetros de filtrado para destinos
 */
export interface DestinoFilterParams extends PaginationParams {
  nombre?: string;
}

/**
 * Parámetros de filtrado para reservas
 */
export interface ReservaFilterParams extends PaginationParams {
  usuarioId?: number;
  destinoId?: number;
  fechaInicio?: string;
  fechaFin?: string;
}

/**
 * Parámetros de filtrado para usuarios
 */
export interface UsuarioFilterParams extends PaginationParams {
  nombre?: string;
  ubicacion?: string;
  email?: string;
}

// ==========================================
// RESPUESTAS ESPECÍFICAS DE NEGOCIO
// ==========================================

/**
 * Respuesta de verificación de reservas
 */
export interface TieneReservasResponse {
  tieneReservas: boolean;
}

/**
 * Respuesta de conteo de reservas
 */
export interface ContarReservasResponse {
  cantidadReservas?: number;
  cantidadReservasFuturas?: number;
}

/**
 * Respuesta de verificación de capacidad de reserva
 */
export interface PuedeReservarResponse {
  puedeReservar: boolean;
  reservasActivas: number;
  limiteReservas: number;
}

// ==========================================
// AUTENTICACIÓN
// ==========================================

/**
 * Credenciales de login
 */
export interface LoginRequest {
  email: string;
  password: string;
}

/**
 * Respuesta de login
 */
export interface LoginResponse {
  token: string;
  user: Usuario;
  expiresIn?: number;
}

/**
 * Respuesta de refresh token
 */
export interface RefreshTokenResponse {
  token: string;
  expiresIn: number;
}

