import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../services/auth.service';
import { ReservationService } from '../../services/reservation.service';
import { DestinationService, Destination } from '../../services/destination.service';
import { TransportService, Transport } from '../../services/transport.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';
import { Reservation, CreateReservationDto } from '../../models/reservation.models';

type ViewMode = 'menu' | 'create' | 'list';

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReservationsComponent implements OnInit {
  private authService = inject(AuthService);
  private reservationService = inject(ReservationService);
  private destinationService = inject(DestinationService);
  private transportService = inject(TransportService);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Signals para estado reactivo
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  private currentViewSignal = signal<ViewMode>('menu');
  currentView = computed(() => this.currentViewSignal());

  private destinationsSignal = signal<Destination[]>([]);
  private transportsSignal = signal<Transport[]>([]);
  private userReservationsSignal = signal<Reservation[]>([]);
  private currentPageSignal = signal<number>(1);
  private itemsPerPageSignal = signal<number>(5);

  // Computed signals
  destinations = computed(() => this.destinationsSignal());
  transports = computed(() => this.transportsSignal());
  userReservations = computed(() => this.userReservationsSignal());

  paginatedReservations = computed(() => {
    const reservations = this.userReservationsSignal();
    const page = this.currentPageSignal();
    const perPage = this.itemsPerPageSignal();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return reservations.slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.userReservationsSignal().length / this.itemsPerPageSignal())
  );

  hasReservations = computed(() => this.userReservationsSignal().length > 0);

  // Datos
  reservationForm!: FormGroup;
  filteredTransports: Transport[] = [];

  // Configuración de fechas
  minDate: string;
  maxDate: string;

  constructor() {
    const today = new Date();
    this.minDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];
    const maxDateObj = new Date();
    maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
    this.maxDate = maxDateObj.toISOString().split('T')[0];

    // Configurar query params con takeUntilDestroyed
    this.route.queryParams.pipe(
      takeUntilDestroyed()
    ).subscribe(params => {
      if (params['view'] === 'create') {
        this.currentViewSignal.set('create');
      }

      if (params['destinationId']) {
        setTimeout(() => {
          this.reservationForm.patchValue({
            destination: params['destinationId']
          });
          this.filterTransportsByDestination();
        }, 500);
      }
    });
  }

  ngOnInit(): void {
    if (!this.isAuthenticated()) {
      this.notificationService.warning('Debes iniciar sesión para acceder a las reservas');
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: '/reservas' }
      });
      return;
    }

    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    const user = this.currentUser();

    this.reservationForm = this.fb.group({
      destination: ['', Validators.required],
      transport: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      departureDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      customerName: [user?.name || '', [Validators.required, Validators.minLength(3)]],
      customerEmail: [user?.email || '', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      specialRequests: ['']
    }, {
      validators: this.dateRangeValidator
    });

    // Filtrar transportes cuando cambia el destino con takeUntilDestroyed
    this.reservationForm.get('destination')?.valueChanges.pipe(
      takeUntilDestroyed()
    ).subscribe(() => {
      this.filterTransportsByDestination();
      this.reservationForm.patchValue({ transport: '' });
    });
  }

  private dateRangeValidator(group: FormGroup): { [key: string]: boolean } | null {
    const departure = group.get('departureDate')?.value;
    const returnDate = group.get('returnDate')?.value;

    if (departure && returnDate && new Date(returnDate) <= new Date(departure)) {
      return { invalidDateRange: true };
    }
    return null;
  }

  private loadData(): void {
    this.loadingService.show('reservations-data', 'Cargando datos...');

    // Cargar destinos con takeUntilDestroyed
    this.destinationService.getDestinations().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (destinations) => {
        this.destinationsSignal.set(destinations);
      },
      error: (error) => {
        console.error('Error al cargar destinos:', error);
        this.notificationService.error('Error al cargar destinos');
      }
    });

    // Cargar transportes con takeUntilDestroyed
    this.transportService.getTransports().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (transports) => {
        this.transportsSignal.set(transports);
        this.loadingService.hide('reservations-data');
      },
      error: (error) => {
        console.error('Error al cargar transportes:', error);
        this.notificationService.error('Error al cargar transportes');
        this.loadingService.hide('reservations-data');
      }
    });

    // Cargar reservas del usuario
    this.loadUserReservations();
  }

  private loadUserReservations(): void {
    const user = this.currentUser();
    if (!user) return;

    this.reservationService.getUserReservations(user.id).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (reservations) => {
        this.userReservationsSignal.set(reservations);
        this.currentPageSignal.set(1); // Reset a primera página
      },
      error: (error) => {
        console.error('Error al cargar reservas:', error);
        this.notificationService.error('Error al cargar tus reservas');
      }
    });
  }

  private filterTransportsByDestination(): void {
    const destinationId = this.reservationForm.get('destination')?.value;
    if (!destinationId) {
      this.filteredTransports = [];
      return;
    }

    this.filteredTransports = this.transportsSignal();
  }

  // ============================================
  // NAVEGACIÓN ENTRE VISTAS
  // ============================================

  showMenu(): void {
    this.currentViewSignal.set('menu');
  }

  showCreateReservation(): void {
    this.currentViewSignal.set('create');
    this.reservationForm.reset({
      passengers: 1,
      customerName: this.currentUser()?.name || '',
      customerEmail: this.currentUser()?.email || ''
    });
  }

  showReservationsList(): void {
    this.currentViewSignal.set('list');
    this.loadUserReservations();
  }

  // ============================================
  // CREAR RESERVA
  // ============================================

  onSubmitReservation(): void {
    if (this.reservationForm.invalid) {
      this.markFormGroupTouched(this.reservationForm);
      this.notificationService.error('Por favor, completa todos los campos correctamente');
      return;
    }

    const user = this.currentUser();
    if (!user) {
      this.notificationService.error('Sesión expirada');
      this.router.navigate(['/login']);
      return;
    }

    const formValue = this.reservationForm.value;
    const destination = this.destinationsSignal().find(d => d.id === formValue.destination);
    const transport = this.transportsSignal().find(t => t.id === formValue.transport);

    if (!destination || !transport) {
      this.notificationService.error('Destino o transporte no válido');
      return;
    }

    const dto: CreateReservationDto = {
      destinationId: destination.id,
      destinationName: destination.name,
      transportType: transport.type,
      passengers: formValue.passengers,
      departureDate: formValue.departureDate,
      returnDate: formValue.returnDate,
      totalPrice: this.calculateTotalPrice(destination, transport, formValue.passengers),
      customerName: formValue.customerName,
      customerEmail: formValue.customerEmail,
      customerPhone: formValue.customerPhone,
      specialRequests: formValue.specialRequests
    };

    this.loadingService.show('create-reservation', 'Creando reserva...');

    this.reservationService.createReservation(user.id, dto).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (reservation) => {
        this.loadingService.hide('create-reservation');
        this.notificationService.success('¡Reserva creada exitosamente!', {
          title: 'Éxito',
          duration: 5000
        });
        this.showReservationsList();
      },
      error: (error) => {
        this.loadingService.hide('create-reservation');
        console.error('Error al crear reserva:', error);
        this.notificationService.error('Error al crear la reserva. Inténtalo de nuevo.');
      }
    });
  }

  private calculateTotalPrice(destination: Destination, transport: Transport, passengers: number): number {
    const basePrice = destination.price;
    const transportPrice = transport.price || 0;
    return (basePrice + transportPrice) * passengers;
  }

  // ============================================
  // GESTIÓN DE RESERVAS
  // ============================================

  deleteReservation(reservationId: string): void {
    if (!confirm('¿Estás seguro de que deseas eliminar esta reserva?')) {
      return;
    }

    this.loadingService.show('delete-reservation', 'Eliminando reserva...');

    this.reservationService.deleteReservation(reservationId).pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (success: boolean) => {
        this.loadingService.hide('delete-reservation');
        if (success) {
          this.notificationService.success('Reserva eliminada correctamente');
          this.loadUserReservations();
        } else {
          this.notificationService.error('No se pudo eliminar la reserva');
        }
      },
      error: (error: any) => {
        this.loadingService.hide('delete-reservation');
        console.error('Error al eliminar reserva:', error);
        this.notificationService.error('Error al eliminar la reserva');
      }
    });
  }

  // ============================================
  // PAGINACIÓN
  // ============================================

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPageSignal() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPageSignal() - 1);
  }

  // ============================================
  // TRACK BY FUNCTIONS
  // ============================================

  trackByReservationId(index: number, reservation: Reservation): string {
    return reservation.id;
  }

  trackByDestinationId(index: number, destination: Destination): string {
    return destination.id;
  }

  trackByTransportId(index: number, transport: Transport): string {
    return transport.id;
  }

  // ============================================
  // UTILIDADES
  // ============================================

  getDestinationName(destinationId: string): string {
    const destination = this.destinationsSignal().find(d => d.id === destinationId);
    return destination?.name || 'Desconocido';
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendiente',
      'confirmed': 'Confirmada',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  }

  getStatusClass(status: string): string {
    return `status-${status}`;
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.reservationForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getErrorMessage(fieldName: string): string {
    const control = this.reservationForm.get(fieldName);
    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es requerido';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['min']) return `Mínimo ${control.errors['min'].min}`;
    if (control.errors['max']) return `Máximo ${control.errors['max'].max}`;
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['pattern']) return 'Formato inválido (9 dígitos)';

    return 'Campo inválido';
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

