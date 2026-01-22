import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ReservationsComponent } from './reservations.component';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { DestinationService } from '../../services/destination.service';
import { TransportService } from '../../services/transport.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

describe('ReservationsComponent', () => {
  let component: ReservationsComponent;
  let fixture: ComponentFixture<ReservationsComponent>;
  let mockAuthService: any;
  let mockReservationService: any;
  let mockDestinationService: any;
  let mockTransportService: any;
  let mockNotificationService: any;
  let mockLoadingService: any;
  let mockRouter: any;
  let mockActivatedRoute: any;

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

  const mockReservations = [
    {
      id: '1',
      userId: '1',
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
      status: 'pending' as const,
      createdAt: new Date().toISOString()
    }
  ];

  beforeEach(async () => {
    mockAuthService = {
      isAuthenticated: vi.fn(() => true),
      currentUser: vi.fn(() => mockUser)
    };

    mockReservationService = {
      getUserReservations: vi.fn(() => of(mockReservations)),
      createReservation: vi.fn(() => of(mockReservations[0])),
      deleteReservation: vi.fn(() => of(true))
    };

    mockDestinationService = {
      getDestinations: vi.fn(() => of(mockDestinations))
    };

    mockTransportService = {
      getTransports: vi.fn(() => of(mockTransports))
    };

    mockNotificationService = {
      success: vi.fn(),
      error: vi.fn(),
      warning: vi.fn()
    };

    mockLoadingService = {
      show: vi.fn(),
      hide: vi.fn()
    };

    mockRouter = {
      navigate: vi.fn()
    };

    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [ReservationsComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: ReservationService, useValue: mockReservationService },
        { provide: DestinationService, useValue: mockDestinationService },
        { provide: TransportService, useValue: mockTransportService },
        { provide: NotificationService, useValue: mockNotificationService },
        { provide: LoadingService, useValue: mockLoadingService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReservationsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should redirect to login if not authenticated', () => {
      mockAuthService.isAuthenticated = vi.fn(() => false);
      component.ngOnInit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
        queryParams: { returnUrl: '/reservas' }
      });
    });

    it('should load data on init when authenticated', () => {
      component.ngOnInit();
      expect(mockDestinationService.getDestinations).toHaveBeenCalled();
      expect(mockTransportService.getTransports).toHaveBeenCalled();
      expect(mockReservationService.getUserReservations).toHaveBeenCalledWith('1');
    });

    it('should initialize form with user data', () => {
      component.ngOnInit();
      expect(component.reservationForm.get('customerName')?.value).toBe('Test User');
      expect(component.reservationForm.get('customerEmail')?.value).toBe('test@example.com');
    });
  });

  describe('Navigation', () => {
    it('should show menu view', () => {
      component.showMenu();
      expect(component.currentView()).toBe('menu');
    });

    it('should show create reservation view', () => {
      component.ngOnInit();
      component.showCreateReservation();
      expect(component.currentView()).toBe('create');
    });

    it('should show reservations list view', () => {
      component.showReservationsList();
      expect(component.currentView()).toBe('list');
    });
  });

  describe('Form Validation', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have invalid form initially', () => {
      expect(component.reservationForm.valid).toBe(false);
    });

    it('should validate required fields', () => {
      const form = component.reservationForm;
      expect(form.get('destination')?.hasError('required')).toBe(true);
      expect(form.get('transport')?.hasError('required')).toBe(true);
      expect(form.get('departureDate')?.hasError('required')).toBe(true);
    });

    it('should validate email format', () => {
      const emailControl = component.reservationForm.get('customerEmail');
      emailControl?.setValue('invalid-email');
      expect(emailControl?.hasError('email')).toBe(true);
    });

    it('should validate phone pattern', () => {
      const phoneControl = component.reservationForm.get('customerPhone');
      phoneControl?.setValue('123');
      expect(phoneControl?.hasError('pattern')).toBe(true);

      phoneControl?.setValue('123456789');
      expect(phoneControl?.hasError('pattern')).toBe(false);
    });

    it('should validate date range', () => {
      const form = component.reservationForm;
      form.patchValue({
        departureDate: '2026-02-10',
        returnDate: '2026-02-05'
      });
      expect(form.hasError('invalidDateRange')).toBe(true);
    });
  });

  describe('Create Reservation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should not submit invalid form', () => {
      component.onSubmitReservation();
      expect(mockReservationService.createReservation).not.toHaveBeenCalled();
      expect(mockNotificationService.error).toHaveBeenCalled();
    });

    it('should create reservation with valid data', () => {
      component.reservationForm.patchValue({
        destination: '1',
        transport: '1',
        passengers: 2,
        departureDate: '2026-02-01',
        returnDate: '2026-02-10',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '123456789'
      });

      component.onSubmitReservation();
      expect(mockReservationService.createReservation).toHaveBeenCalled();
    });

    it('should calculate total price correctly', () => {
      const destination = mockDestinations[0];
      const transport = mockTransports[0];
      const total = component['calculateTotalPrice'](destination, transport, 2);
      expect(total).toBe(3000); // (1200 + 300) * 2
    });

    it('should show success notification on create', () => {
      component.reservationForm.patchValue({
        destination: '1',
        transport: '1',
        passengers: 2,
        departureDate: '2026-02-01',
        returnDate: '2026-02-10',
        customerName: 'Test User',
        customerEmail: 'test@example.com',
        customerPhone: '123456789'
      });

      component.onSubmitReservation();
      expect(mockNotificationService.success).toHaveBeenCalled();
    });
  });

  describe('Delete Reservation', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should delete reservation', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      component.deleteReservation('1');
      expect(mockReservationService.deleteReservation).toHaveBeenCalledWith('1');
    });

    it('should not delete if cancelled', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      component.deleteReservation('1');
      expect(mockReservationService.deleteReservation).not.toHaveBeenCalled();
    });

    it('should reload reservations after delete', () => {
      vi.spyOn(window, 'confirm').mockReturnValue(true);
      component.deleteReservation('1');
      expect(mockReservationService.getUserReservations).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should go to next page', () => {
      const initialPage = component['currentPageSignal']();
      component.nextPage();
      expect(component['currentPageSignal']()).toBe(initialPage + 1);
    });

    it('should go to previous page', () => {
      component['currentPageSignal'].set(2);
      component.prevPage();
      expect(component['currentPageSignal']()).toBe(1);
    });

    it('should not go below page 1', () => {
      component['currentPageSignal'].set(1);
      component.prevPage();
      expect(component['currentPageSignal']()).toBe(1);
    });
  });

  describe('TrackBy Functions', () => {
    it('should return reservation id', () => {
      const trackId = component.trackByReservationId(0, mockReservations[0]);
      expect(trackId).toBe('1');
    });

    it('should return destination id', () => {
      const trackId = component.trackByDestinationId(0, mockDestinations[0]);
      expect(trackId).toBe('1');
    });

    it('should return transport id', () => {
      const trackId = component.trackByTransportId(0, mockTransports[0]);
      expect(trackId).toBe('1');
    });
  });

  describe('Utility Functions', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should get destination name', () => {
      const name = component.getDestinationName('1');
      expect(name).toBe('París');
    });

    it('should get status label', () => {
      expect(component.getStatusLabel('pending')).toBe('Pendiente');
      expect(component.getStatusLabel('confirmed')).toBe('Confirmada');
      expect(component.getStatusLabel('cancelled')).toBe('Cancelada');
    });

    it('should get status class', () => {
      expect(component.getStatusClass('pending')).toBe('status-pending');
    });

    it('should show error for invalid field', () => {
      const control = component.reservationForm.get('customerEmail');
      control?.markAsTouched();
      control?.setValue('invalid');
      expect(component.shouldShowError('customerEmail')).toBe(true);
    });

    it('should get error message', () => {
      const control = component.reservationForm.get('customerEmail');
      control?.setValue('');
      control?.markAsTouched();
      expect(component.getErrorMessage('customerEmail')).toBe('Este campo es requerido');
    });
  });
});
