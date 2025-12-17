import { Injectable, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

/**
 * Interfaz para un estado de carga
 */
export interface LoadingState {
  key: string;
  isLoading: boolean;
  message?: string;
  timestamp: number;
}

/**
 * Servicio para gestionar estados de carga
 * Soporta loading global y loading específico por clave
 */
@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  // Signal para estado de carga global
  private globalLoadingSignal = signal<boolean>(false);
  public isGlobalLoading = this.globalLoadingSignal.asReadonly();

  // Signal para estados de carga específicos
  private loadingStatesSignal = signal<Map<string, LoadingState>>(new Map());

  // Computed para obtener todos los estados de carga activos
  public activeLoadingStates = computed(() => {
    return Array.from(this.loadingStatesSignal().values()).filter(state => state.isLoading);
  });

  // Computed para saber si hay algún loading activo
  public hasActiveLoading = computed(() => {
    return this.activeLoadingStates().length > 0 || this.globalLoadingSignal();
  });

  // Subject para notificaciones de cambios de estado
  private loadingStateSubject = new Subject<LoadingState>();
  public loadingState$ = this.loadingStateSubject.asObservable();

  // Contador de operaciones de loading global
  private globalLoadingCount = signal<number>(0);

  constructor() {}

  // ==========================================
  // LOADING GLOBAL
  // ==========================================

  /**
   * Muestra el loading global
   */
  showGlobal(): void {
    this.globalLoadingCount.update(count => count + 1);
    this.globalLoadingSignal.set(true);

    this.emitState({
      key: 'global',
      isLoading: true,
      timestamp: Date.now()
    });
  }

  /**
   * Oculta el loading global
   */
  hideGlobal(): void {
    this.globalLoadingCount.update(count => Math.max(0, count - 1));

    // Solo ocultar si no hay más operaciones pendientes
    if (this.globalLoadingCount() === 0) {
      this.globalLoadingSignal.set(false);

      this.emitState({
        key: 'global',
        isLoading: false,
        timestamp: Date.now()
      });
    }
  }

  /**
   * Fuerza el ocultamiento del loading global
   */
  forceHideGlobal(): void {
    this.globalLoadingCount.set(0);
    this.globalLoadingSignal.set(false);

    this.emitState({
      key: 'global',
      isLoading: false,
      timestamp: Date.now()
    });
  }

  // ==========================================
  // LOADING ESPECÍFICO
  // ==========================================

  /**
   * Muestra loading para una clave específica
   */
  show(key: string, message?: string): void {
    const state: LoadingState = {
      key,
      isLoading: true,
      message,
      timestamp: Date.now()
    };

    this.loadingStatesSignal.update(states => {
      const newStates = new Map(states);
      newStates.set(key, state);
      return newStates;
    });

    this.emitState(state);
  }

  /**
   * Oculta loading para una clave específica
   */
  hide(key: string): void {
    const state: LoadingState = {
      key,
      isLoading: false,
      timestamp: Date.now()
    };

    this.loadingStatesSignal.update(states => {
      const newStates = new Map(states);
      newStates.delete(key);
      return newStates;
    });

    this.emitState(state);
  }

  /**
   * Verifica si una clave específica está cargando
   */
  isLoading(key: string): boolean {
    const state = this.loadingStatesSignal().get(key);
    return state?.isLoading ?? false;
  }

  /**
   * Obtiene el estado de carga de una clave específica
   */
  getState(key: string): LoadingState | undefined {
    return this.loadingStatesSignal().get(key);
  }

  /**
   * Obtiene todos los estados de carga
   */
  getAllStates(): LoadingState[] {
    return Array.from(this.loadingStatesSignal().values());
  }

  /**
   * Limpia todos los estados de carga
   */
  clearAll(): void {
    this.loadingStatesSignal.set(new Map());
    this.forceHideGlobal();
  }

  // ==========================================
  // UTILIDADES PARA RXJS
  // ==========================================

  /**
   * Wrapper para operaciones asíncronas con loading global
   */
  wrapGlobal<T>(observable: Observable<T>): Observable<T> {
    this.showGlobal();
    return observable.pipe(
      finalize(() => this.hideGlobal())
    );
  }

  /**
   * Wrapper para operaciones asíncronas con loading específico
   */
  wrap<T>(key: string, observable: Observable<T>, message?: string): Observable<T> {
    this.show(key, message);
    return observable.pipe(
      finalize(() => this.hide(key))
    );
  }

  /**
   * Ejecuta una función con loading global
   */
  async withGlobalLoading<T>(fn: () => Promise<T>): Promise<T> {
    this.showGlobal();
    try {
      return await fn();
    } finally {
      this.hideGlobal();
    }
  }

  /**
   * Ejecuta una función con loading específico
   */
  async withLoading<T>(key: string, fn: () => Promise<T>, message?: string): Promise<T> {
    this.show(key, message);
    try {
      return await fn();
    } finally {
      this.hide(key);
    }
  }

  // ==========================================
  // PRIVADOS
  // ==========================================

  /**
   * Emite un cambio de estado
   */
  private emitState(state: LoadingState): void {
    this.loadingStateSubject.next(state);
  }
}

