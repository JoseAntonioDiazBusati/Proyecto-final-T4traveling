import { Injectable, signal } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Reservation, CreateReservationDto } from '../models/reservation.models';

/**
 * ReservationService - Gestiona las reservas de los usuarios
 *
 * Características:
 * - CRUD de reservas
 * - Almacenamiento en localStorage
 * - Filtrado por usuario
 */
@Injectable({
  providedIn: 'root'
})
export class ReservationService {
  private readonly STORAGE_KEY = 't4traveling-reservations';
  private reservationsSignal = signal<Reservation[]>([]);

  public reservations = this.reservationsSignal.asReadonly();

  constructor() {
    this.loadReservations();
  }

  /**
   * Carga las reservas desde localStorage
   */
  private loadReservations(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const reservations = JSON.parse(stored);
        this.reservationsSignal.set(reservations);
      }
    } catch (e) {
      console.warn('Error al cargar reservas:', e);
    }
  }

  /**
   * Guarda las reservas en localStorage
   */
  private saveReservations(reservations: Reservation[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(reservations));
      this.reservationsSignal.set(reservations);
    } catch (e) {
      console.error('Error al guardar reservas:', e);
    }
  }

  /**
   * Obtiene todas las reservas de un usuario
   */
  getUserReservations(userId: string): Observable<Reservation[]> {
    const userReservations = this.reservationsSignal().filter(r => r.userId === userId);
    return of(userReservations).pipe(delay(300));
  }

  /**
   * Obtiene una reserva por ID
   */
  getReservationById(id: string): Observable<Reservation | undefined> {
    const reservation = this.reservationsSignal().find(r => r.id === id);
    return of(reservation).pipe(delay(200));
  }

  /**
   * Crea una nueva reserva
   */
  createReservation(userId: string, dto: CreateReservationDto): Observable<Reservation> {
    const newReservation: Reservation = {
      id: this.generateId(),
      userId,
      ...dto,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const currentReservations = this.reservationsSignal();
    const updatedReservations = [...currentReservations, newReservation];
    this.saveReservations(updatedReservations);

    return of(newReservation).pipe(delay(500));
  }

  /**
   * Actualiza una reserva existente
   */
  updateReservation(id: string, updates: Partial<Reservation>): Observable<Reservation | null> {
    const currentReservations = this.reservationsSignal();
    const index = currentReservations.findIndex(r => r.id === id);

    if (index === -1) {
      return of(null).pipe(delay(200));
    }

    const updatedReservation = { ...currentReservations[index], ...updates };
    const updatedReservations = [...currentReservations];
    updatedReservations[index] = updatedReservation;

    this.saveReservations(updatedReservations);
    return of(updatedReservation).pipe(delay(300));
  }

  /**
   * Cancela una reserva
   */
  cancelReservation(id: string): Observable<boolean> {
    return this.updateReservation(id, { status: 'cancelled' }).pipe(
      delay(300),
      map(result => result !== null)
    );
  }

  /**
   * Elimina una reserva permanentemente
   */
  deleteReservation(id: string): Observable<boolean> {
    const currentReservations = this.reservationsSignal();
    const updatedReservations = currentReservations.filter(r => r.id !== id);

    if (currentReservations.length === updatedReservations.length) {
      return of(false).pipe(delay(200));
    }

    this.saveReservations(updatedReservations);
    return of(true).pipe(delay(300));
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `res_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Limpia todas las reservas (para desarrollo)
   */
  clearAllReservations(): void {
    this.saveReservations([]);
  }
}

