import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinationService, Destination } from '../../services/destination.service';
import { TransportService, Transport } from '../../services/transport.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

interface ReservationSummary {
  destination: Destination;
  transport: Transport;
  totalPrice: number;
  passengers: number;
  departureDate: string;
  returnDate: string;
}

@Component({
  selector: 'app-reservations',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrls: ['./reservations.component.scss']
})
export class ReservationsComponent implements OnInit {
  reservationForm!: FormGroup;
  destinations: Destination[] = [];
  transports: Transport[] = [];
  filteredTransports: Transport[] = [];

  minDate: string;
  maxDate: string;

  showSummary = false;
  reservationSummary: ReservationSummary | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private destinationService: DestinationService,
    private transportService: TransportService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {
    const today = new Date();
    this.minDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

    const maxDateObj = new Date();
    maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
    this.maxDate = maxDateObj.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.loadData();
  }

  private initForm(): void {
    this.reservationForm = this.fb.group({
      destination: ['', Validators.required],
      transport: ['', Validators.required],
      passengers: [1, [Validators.required, Validators.min(1), Validators.max(10)]],
      departureDate: ['', Validators.required],
      returnDate: ['', Validators.required],
      customerName: ['', [Validators.required, Validators.minLength(3)]],
      customerEmail: ['', [Validators.required, Validators.email]],
      customerPhone: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      specialRequests: ['']
    }, {
      validators: this.dateRangeValidator
    });

    // Filtrar transportes cuando cambia el destino
    this.reservationForm.get('destination')?.valueChanges.subscribe(() => {
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
    // Cargar destinos
    this.destinationService.getDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
      },
      error: (error) => {
        console.error('Error al cargar destinos:', error);
        this.notificationService.error('Error al cargar destinos');
      }
    });

    // Cargar transportes
    this.transportService.getTransports().subscribe({
      next: (transports) => {
        this.transports = transports;
        this.filteredTransports = transports;
      },
      error: (error) => {
        console.error('Error al cargar transportes:', error);
        this.notificationService.error('Error al cargar transportes');
      }
    });
  }

  private filterTransportsByDestination(): void {
    const destinationId = this.reservationForm.get('destination')?.value;
    const destination = this.destinations.find(d => d.id === destinationId);

    if (destination) {
      // Filtrar transportes por el continente del destino
      this.filteredTransports = this.transports.filter(t => t.continent === destination.category);
    } else {
      this.filteredTransports = this.transports;
    }
  }

  getSelectedDestination(): Destination | undefined {
    const destinationId = this.reservationForm.get('destination')?.value;
    return this.destinations.find(d => d.id === destinationId);
  }

  getSelectedTransport(): Transport | undefined {
    const transportId = this.reservationForm.get('transport')?.value;
    return this.transports.find(t => t.id === transportId);
  }

  calculateTotalPrice(): number {
    const destination = this.getSelectedDestination();
    const transport = this.getSelectedTransport();
    const passengers = this.reservationForm.get('passengers')?.value || 0;

    if (!destination || !transport) return 0;

    const destinationCost = destination.price * passengers;
    const transportCost = transport.price * passengers;

    return destinationCost + transportCost;
  }

  calculateDays(): number {
    const departure = this.reservationForm.get('departureDate')?.value;
    const returnDate = this.reservationForm.get('returnDate')?.value;

    if (!departure || !returnDate) return 0;

    const diffTime = Math.abs(new Date(returnDate).getTime() - new Date(departure).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  }

  onPreviewReservation(): void {
    if (this.reservationForm.invalid) {
      Object.keys(this.reservationForm.controls).forEach(key => {
        this.reservationForm.get(key)?.markAsTouched();
      });
      this.notificationService.warning('Por favor, complete todos los campos obligatorios');
      return;
    }

    const destination = this.getSelectedDestination();
    const transport = this.getSelectedTransport();

    if (!destination || !transport) {
      this.notificationService.error('Error al obtener los datos de la reserva');
      return;
    }

    this.reservationSummary = {
      destination,
      transport,
      totalPrice: this.calculateTotalPrice(),
      passengers: this.reservationForm.get('passengers')?.value,
      departureDate: this.reservationForm.get('departureDate')?.value,
      returnDate: this.reservationForm.get('returnDate')?.value
    };

    this.showSummary = true;

    // Scroll al resumen
    setTimeout(() => {
      document.getElementById('reservation-summary')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  onConfirmReservation(): void {
    this.loadingService.show('confirm-reservation', 'Procesando reserva...');

    // Simular llamada a API
    setTimeout(() => {
      this.loadingService.hide('confirm-reservation');
      this.notificationService.success(
        'Su reserva ha sido confirmada exitosamente. Recibirá un correo con los detalles.',
        { title: '¡Reserva Confirmada!', duration: 5000 }
      );

      // Resetear formulario
      this.reservationForm.reset();
      this.showSummary = false;
      this.reservationSummary = null;

      // Volver al inicio del formulario
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 2000);
  }

  onCancelPreview(): void {
    this.showSummary = false;
    this.reservationSummary = null;
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.reservationForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.reservationForm.get(fieldName);

    if (!control || !control.errors) return '';

    if (control.errors['required']) return 'Este campo es obligatorio';
    if (control.errors['email']) return 'Email inválido';
    if (control.errors['minlength']) return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
    if (control.errors['min']) return `Valor mínimo: ${control.errors['min'].min}`;
    if (control.errors['max']) return `Valor máximo: ${control.errors['max'].max}`;
    if (control.errors['pattern']) return 'Formato inválido (9 dígitos)';

    return 'Campo inválido';
  }

  getFormError(): string {
    if (this.reservationForm.errors?.['invalidDateRange']) {
      return 'La fecha de regreso debe ser posterior a la fecha de salida';
    }
    return '';
  }
}
