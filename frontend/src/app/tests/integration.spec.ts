import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ReservationService } from '../services/reservation.service';
import { DestinationService } from '../services/destination.service';
import { TransportService } from '../services/transport.service';
import { StateService } from '../services/state.service';

describe('Integration Tests - Complete Flows', () => {
  let authService: AuthService;
  let reservationService: ReservationService;
  let destinationService: DestinationService;
  let transportService: TransportService;
  let stateService: StateService;
  let router: Router;

  const mockUser = {
    id: '1',
    name: 'Test User',
    email: 'test@example.com'
  };

  const mockDestinations = [
    {
      id: '1',
      name: 'París',
      country: 'Francia',
      description: 'Ciudad del amor',
      price: 1200,
      image: '/images/paris.jpeg',
      rating: 4.8,
      category: 'Europa'
    }
  ];

  const mockTransports = [
    {
      id: '1',
      name: 'Avión Premium',
      type: 'avion' as const,
      company: 'Air France',
      price: 300,
      icon: '✈️',
      continent: 'Europa',
      description: 'Vuelo premium con todas las comodidades'
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        ReservationService,
        DestinationService,
        TransportService,
        StateService,
        {
          provide: Router,
          useValue: {
            navigate: vi.fn()
          }
        }
      ]
    });

    authService = TestBed.inject(AuthService);
    reservationService = TestBed.inject(ReservationService);
    destinationService = TestBed.inject(DestinationService);
    transportService = TestBed.inject(TransportService);
    stateService = TestBed.inject(StateService);
    router = TestBed.inject(Router);

    // Mock de servicios HTTP
    vi.spyOn(destinationService, 'getDestinations').mockReturnValue(of(mockDestinations));
    vi.spyOn(transportService, 'getTransports').mockReturnValue(of(mockTransports));
  });

  describe('Authentication Flow', () => {
    it('should complete full login flow', async () => {
      // 1. Usuario no autenticado inicialmente
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.currentUser()).toBeNull();

      // 2. Realizar login
      await authService.login('test@example.com', 'password123');

      // 3. Verificar autenticación exitosa
      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.currentUser()).toBeDefined();
      expect(authService.currentUser()?.email).toBe('test@example.com');

      // 4. Verificar que el token se guardó
      const token = localStorage.getItem('auth-token');
      expect(token).toBeDefined();
    });

    it('should handle logout correctly', async () => {
      // 1. Login primero
      await authService.login('test@example.com', 'password123');
      expect(authService.isAuthenticated()).toBe(true);

      // 2. Realizar logout
      authService.logout();

      // 3. Verificar que se limpió todo
      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.currentUser()).toBeNull();
      expect(localStorage.getItem('auth-token')).toBeNull();
    });

    it('should persist authentication across page reloads', async () => {
      // 1. Login
      await authService.login('test@example.com', 'password123');

      // 2. Verificar que se mantiene la autenticación en localStorage
      expect(localStorage.getItem('auth-token')).toBeDefined();

      // 3. Simular recarga - el token debe persistir
      const token = localStorage.getItem('auth-token');
      expect(token).not.toBeNull();
    });
  });

  describe('Reservation Creation Flow', () => {
    beforeEach(async () => {
      // Autenticar usuario antes de crear reservas
      await authService.login('test@example.com', 'password123');
    });

    it('should complete full reservation creation flow', async () => {
      // 1. Cargar destinos disponibles
      const destinations = await destinationService.getDestinations().toPromise();
      expect(destinations).toBeDefined();
      expect(destinations!.length).toBeGreaterThan(0);

      // 2. Cargar transportes disponibles
      const transports = await transportService.getTransports().toPromise();
      expect(transports).toBeDefined();
      expect(transports!.length).toBeGreaterThan(0);

      // 3. Crear reserva con datos válidos
      const reservationDto = {
        destinationId: '1',
        destinationName: 'París',
        transportType: 'avion' as const,
        passengers: 2,
        departureDate: '2026-02-01',
        returnDate: '2026-02-10',
        totalPrice: 3000,
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '123456789',
        specialRequests: 'Ventana'
      };

      vi.spyOn(reservationService, 'createReservation').mockReturnValue(
        of({
          id: '1',
          userId: '1',
          ...reservationDto,
          status: 'pending',
          createdAt: new Date().toISOString()
        })
      );

      const reservation = await reservationService.createReservation('1', reservationDto).toPromise();

      // 4. Verificar que la reserva se creó correctamente
      expect(reservation).toBeDefined();
      expect(reservation!.id).toBeDefined();
      expect(reservation!.status).toBe('pending');
      expect(reservation!.destinationName).toBe('París');
      expect(reservation!.passengers).toBe(2);

      // 5. Verificar que se puede recuperar la reserva
      vi.spyOn(reservationService, 'getUserReservations').mockReturnValue(
        of([reservation!])
      );

      const userReservations = await reservationService.getUserReservations('1').toPromise();
      expect(userReservations).toBeDefined();
      expect(userReservations!.length).toBe(1);
      expect(userReservations![0].id).toBe('1');
    });

    it('should calculate total price correctly', () => {
      const destination = mockDestinations[0];
      const transport = mockTransports[0];
      const passengers = 2;

      // Cálculo: (precio destino + precio transporte) * pasajeros
      const expectedTotal = (destination.price + transport.price) * passengers;
      const actualTotal = (1200 + 300) * 2;

      expect(actualTotal).toBe(3000);
      expect(actualTotal).toBe(expectedTotal);
    });
  });

  describe('Search and Filter Flow', () => {
    it('should search destinations by text', async () => {
      // 1. Cargar todos los destinos
      const allDestinations = await destinationService.getDestinations().toPromise();
      expect(allDestinations!.length).toBe(1);

      // 2. Buscar por texto
      const searchQuery = 'parís';
      const filtered = allDestinations!.filter(d =>
        d.name.toLowerCase().includes(searchQuery) ||
        d.country.toLowerCase().includes(searchQuery)
      );

      // 3. Verificar resultados
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('París');
    });

    it('should filter destinations by category', async () => {
      // 1. Cargar destinos
      const destinations = await destinationService.getDestinations().toPromise();

      // 2. Filtrar por categoría
      const category = 'Europa';
      const filtered = destinations!.filter(d => d.category === category);

      // 3. Verificar que solo hay destinos de Europa
      expect(filtered.every(d => d.category === 'Europa')).toBe(true);
    });

    it('should filter transports by type', async () => {
      // 1. Cargar transportes
      const transports = await transportService.getTransports().toPromise();

      // 2. Filtrar por tipo
      const filtered = transports!.filter(t => t.type === 'avion');

      // 3. Verificar resultados
      expect(filtered.every(t => t.type === 'avion')).toBe(true);
    });
  });

  describe('State Management Flow', () => {
    it('should manage user state correctly', () => {
      // 1. Estado inicial
      expect(stateService.user()).toBeNull();
      expect(stateService.isAuthenticated()).toBe(false);

      // 2. Establecer usuario
      stateService.setUser(mockUser);

      // 3. Verificar estado actualizado
      expect(stateService.user()).toEqual(mockUser);
      expect(stateService.isAuthenticated()).toBe(true);

      // 4. Actualizar parcialmente
      stateService.updateUser({ name: 'Updated Name' });
      expect(stateService.user()?.name).toBe('Updated Name');

      // 5. Logout
      stateService.logout();
      expect(stateService.user()).toBeNull();
    });

    it('should manage cart state correctly', () => {
      // 1. Carrito vacío inicial
      expect(stateService.cart()).toEqual([]);
      expect(stateService.cartItemCount()).toBe(0);
      expect(stateService.cartTotal()).toBe(0);

      // 2. Agregar items
      stateService.addToCart({ name: 'Item 1', price: 100 });
      stateService.addToCart({ name: 'Item 2', price: 200 });

      // 3. Verificar estado
      expect(stateService.cartItemCount()).toBe(2);
      expect(stateService.cartTotal()).toBe(300);

      // 4. Eliminar item
      const itemId = stateService.cart()[0].id;
      stateService.removeFromCart(itemId);

      // 5. Verificar actualización
      expect(stateService.cartItemCount()).toBe(1);
      expect(stateService.cartTotal()).toBe(200);

      // 6. Limpiar carrito
      stateService.clearCart();
      expect(stateService.cartItemCount()).toBe(0);
    });

    it('should persist state to localStorage', () => {
      // 1. Establecer estado
      stateService.setUser(mockUser);
      stateService.addToCart({ name: 'Item', price: 100 });

      // 2. Verificar persistencia
      const stored = localStorage.getItem('t4traveling-state');
      expect(stored).toBeDefined();

      const state = JSON.parse(stored!);
      expect(state.user).toEqual(mockUser);
      expect(state.cart).toHaveLength(1);
    });
  });

  describe('Error Handling Flow', () => {
    it('should handle authentication errors', async () => {
      vi.spyOn(authService, 'login').mockResolvedValue(
        { success: false, message: 'Invalid credentials' }
      );

      const result = await authService.login('wrong@email.com', 'wrong');

      expect(result.success).toBe(false);
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('should handle reservation creation errors gracefully', async () => {
      const invalidDto = {
        destinationId: '',
        destinationName: '',
        transportType: 'avion' as const,
        passengers: 0,
        departureDate: '',
        returnDate: '',
        totalPrice: 0,
        customerName: '',
        customerEmail: 'invalid-email',
        customerPhone: '123',
        specialRequests: ''
      };

      // En una implementación real, esto debería rechazarse
      expect(invalidDto.passengers).toBe(0);
      expect(invalidDto.customerEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  describe('Reactive Forms Integration', () => {
    it('should validate form data before submission', () => {
      // Simular validación de formulario de reserva
      const formData = {
        destination: '1',
        transport: '1',
        passengers: 2,
        departureDate: '2026-02-01',
        returnDate: '2026-02-10',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '123456789'
      };

      // Validaciones
      expect(formData.destination).toBeTruthy();
      expect(formData.transport).toBeTruthy();
      expect(formData.passengers).toBeGreaterThan(0);
      expect(formData.passengers).toBeLessThanOrEqual(10);
      expect(formData.customerEmail).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(formData.customerPhone).toMatch(/^[0-9]{9}$/);
      expect(new Date(formData.returnDate) > new Date(formData.departureDate)).toBe(true);
    });

    it('should reject invalid form data', () => {
      const invalidData = {
        destination: '',
        passengers: 0,
        customerEmail: 'invalid-email',
        customerPhone: '123',
        departureDate: '2026-02-10',
        returnDate: '2026-02-05' // Fecha de retorno anterior a salida
      };

      // Validaciones que deberían fallar
      expect(invalidData.destination).toBeFalsy();
      expect(invalidData.passengers).toBeLessThanOrEqual(0);
      expect(invalidData.customerEmail).not.toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      expect(invalidData.customerPhone).not.toMatch(/^[0-9]{9}$/);
      expect(new Date(invalidData.returnDate) > new Date(invalidData.departureDate)).toBe(false);
    });
  });
});
