import { Injectable, signal, computed, effect } from '@angular/core';

/**
 * Interfaz para el estado del usuario
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
}

/**
 * Interfaz para el estado de la aplicación
 */
export interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  selectedDestination: any | null;
  cart: any[];
  searchQuery: string;
  filters: Record<string, any>;
}

/**
 * Servicio de estado global
 * Gestiona datos compartidos entre múltiples componentes
 * Utiliza Angular Signals para reactividad eficiente
 */
@Injectable({
  providedIn: 'root'
})
export class StateService {
  // Estado privado con signals
  private userSignal = signal<User | null>(null);
  private selectedDestinationSignal = signal<any | null>(null);
  private cartSignal = signal<any[]>([]);
  private searchQuerySignal = signal<string>('');
  private filtersSignal = signal<Record<string, any>>({});

  // Signals públicos de solo lectura (computed)
  public user = computed(() => this.userSignal());
  public isAuthenticated = computed(() => this.userSignal() !== null);
  public selectedDestination = computed(() => this.selectedDestinationSignal());
  public cart = computed(() => this.cartSignal());
  public cartItemCount = computed(() => this.cartSignal().length);
  public cartTotal = computed(() => {
    return this.cartSignal().reduce((total, item) => total + (item.price || 0), 0);
  });
  public searchQuery = computed(() => this.searchQuerySignal());
  public filters = computed(() => this.filtersSignal());
  public hasActiveFilters = computed(() => Object.keys(this.filtersSignal()).length > 0);

  // Estado completo de la app
  public appState = computed<AppState>(() => ({
    user: this.user(),
    isAuthenticated: this.isAuthenticated(),
    selectedDestination: this.selectedDestination(),
    cart: this.cart(),
    searchQuery: this.searchQuery(),
    filters: this.filters()
  }));

  constructor() {
    // Cargar estado desde localStorage al inicializar
    this.loadStateFromStorage();

    // Efecto para guardar el estado cuando cambie
    effect(() => {
      this.saveStateToStorage();
    });
  }

  // ==========================================
  // MÉTODOS DE USUARIO
  // ==========================================

  /**
   * Establece el usuario actual
   */
  setUser(user: User | null): void {
    this.userSignal.set(user);
  }

  /**
   * Actualiza parcialmente el usuario
   */
  updateUser(updates: Partial<User>): void {
    const currentUser = this.userSignal();
    if (currentUser) {
      this.userSignal.set({ ...currentUser, ...updates });
    }
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.userSignal.set(null);
    this.clearCart();
  }

  // ==========================================
  // MÉTODOS DE DESTINO
  // ==========================================

  /**
   * Establece el destino seleccionado
   */
  setSelectedDestination(destination: any): void {
    this.selectedDestinationSignal.set(destination);
  }

  /**
   * Limpia el destino seleccionado
   */
  clearSelectedDestination(): void {
    this.selectedDestinationSignal.set(null);
  }

  // ==========================================
  // MÉTODOS DE CARRITO
  // ==========================================

  /**
   * Añade un item al carrito
   */
  addToCart(item: any): void {
    this.cartSignal.update(cart => [...cart, { ...item, id: this.generateId() }]);
  }

  /**
   * Elimina un item del carrito
   */
  removeFromCart(itemId: string): void {
    this.cartSignal.update(cart => cart.filter(item => item.id !== itemId));
  }

  /**
   * Actualiza la cantidad de un item
   */
  updateCartItem(itemId: string, updates: Partial<any>): void {
    this.cartSignal.update(cart =>
      cart.map(item => item.id === itemId ? { ...item, ...updates } : item)
    );
  }

  /**
   * Limpia todo el carrito
   */
  clearCart(): void {
    this.cartSignal.set([]);
  }

  /**
   * Verifica si un item está en el carrito
   */
  isInCart(itemId: string): boolean {
    return this.cartSignal().some(item => item.id === itemId);
  }

  // ==========================================
  // MÉTODOS DE BÚSQUEDA
  // ==========================================

  /**
   * Establece la consulta de búsqueda
   */
  setSearchQuery(query: string): void {
    this.searchQuerySignal.set(query);
  }

  /**
   * Limpia la búsqueda
   */
  clearSearch(): void {
    this.searchQuerySignal.set('');
  }

  // ==========================================
  // MÉTODOS DE FILTROS
  // ==========================================

  /**
   * Establece un filtro
   */
  setFilter(key: string, value: any): void {
    this.filtersSignal.update(filters => ({ ...filters, [key]: value }));
  }

  /**
   * Elimina un filtro
   */
  removeFilter(key: string): void {
    this.filtersSignal.update(filters => {
      const newFilters = { ...filters };
      delete newFilters[key];
      return newFilters;
    });
  }

  /**
   * Establece múltiples filtros
   */
  setFilters(filters: Record<string, any>): void {
    this.filtersSignal.set(filters);
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this.filtersSignal.set({});
  }

  // ==========================================
  // PERSISTENCIA
  // ==========================================

  /**
   * Guarda el estado en localStorage
   */
  private saveStateToStorage(): void {
    try {
      const state = {
        user: this.userSignal(),
        cart: this.cartSignal(),
        filters: this.filtersSignal()
      };
      localStorage.setItem('t4traveling-state', JSON.stringify(state));
    } catch (error) {
      console.warn('Error al guardar estado:', error);
    }
  }

  /**
   * Carga el estado desde localStorage
   */
  private loadStateFromStorage(): void {
    try {
      const stored = localStorage.getItem('t4traveling-state');
      if (stored) {
        const state = JSON.parse(stored);
        if (state.user) this.userSignal.set(state.user);
        if (state.cart) this.cartSignal.set(state.cart);
        if (state.filters) this.filtersSignal.set(state.filters);
      }
    } catch (error) {
      console.warn('Error al cargar estado:', error);
    }
  }

  /**
   * Limpia el estado almacenado
   */
  clearStoredState(): void {
    try {
      localStorage.removeItem('t4traveling-state');
    } catch (error) {
      console.warn('Error al limpiar estado:', error);
    }
  }

  /**
   * Resetea todo el estado a valores iniciales
   */
  resetState(): void {
    this.userSignal.set(null);
    this.selectedDestinationSignal.set(null);
    this.cartSignal.set([]);
    this.searchQuerySignal.set('');
    this.filtersSignal.set({});
    this.clearStoredState();
  }

  /**
   * Genera un ID único simple
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

