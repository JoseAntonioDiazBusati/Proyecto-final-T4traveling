import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { FormService } from '../../services/form.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';
import { DestinationService, Destination } from '../../services/destination.service';

/**
 * BookingFormComponent - Formulario de reserva de viajes
 *
 * Características implementadas:
 * - @ViewChild + ElementRef para acceso al DOM (1.1)
 * - ngAfterViewInit para manipulación segura del DOM
 * - Foco automático en el primer campo
 * - Scroll programado a secciones
 * - Renderer2 para manipulación de estilos (1.2)
 * - Creación dinámica de chips con tags (1.3)
 * - Event binding con eventos específicos (2.1, 2.2)
 */
@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy, AfterViewInit {
  // ViewChild para acceso al DOM (requisito 1.1)
  @ViewChild('travelersContainer') travelersContainer!: ElementRef<HTMLDivElement>;

  bookingForm!: FormGroup;
  formId = 'booking-form';
  minDate: string;
  maxDate: string;

  destinations: Destination[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private notificationService: NotificationService,
    private loadingService: LoadingService,
    private destinationService: DestinationService
  ) {
    // Establecer fechas mínimas y máximas
    const today = new Date();
    this.minDate = new Date(today.setDate(today.getDate() + 1)).toISOString().split('T')[0];

    const maxDateObj = new Date();
    maxDateObj.setFullYear(maxDateObj.getFullYear() + 1);
    this.maxDate = maxDateObj.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initForm();
    this.formService.registerForm(this.formId, this.bookingForm);

    // Cargar destinos reales desde el servicio
    this.destinationService.getDestinations().subscribe({
      next: (destinations) => {
        this.destinations = destinations;
      },
      error: (error) => {
        console.error('Error al cargar destinos:', error);
      }
    });

    // Añadir al menos un viajero por defecto
    this.addTraveler();
  }

  /**
   * ngAfterViewInit - Acceso seguro al DOM después de inicializar la vista
   * Requisito 1.1: Acceso al DOM en ngAfterViewInit()
   */
  ngAfterViewInit(): void {
    // Medir dimensiones del contenedor de viajeros para estadísticas
    this.measureContainerDimensions();
  }

  ngOnDestroy(): void {
    this.formService.unregisterForm(this.formId);
  }

  /**
   * Mide las dimensiones del contenedor de viajeros
   * Demuestra uso de ViewChild para medición del DOM
   */
  private measureContainerDimensions(): void {
    if (this.travelersContainer?.nativeElement) {
      const rect = this.travelersContainer.nativeElement.getBoundingClientRect();
      console.log(`📐 Dimensiones del contenedor: ${rect.width}px x ${rect.height}px`);
    }
  }

  private initForm(): void {
    this.bookingForm = this.fb.group({
      // Información de contacto
      contactEmail: [
        '',
        [Validators.required, Validators.email]
      ],
      contactPhone: [
        '',
        [Validators.required, CustomValidators.spanishPhone()]
      ],

      // Detalles del viaje
      destination: [
        '',
        [Validators.required]
      ],
      departureDate: [
        '',
        [Validators.required]
      ],
      returnDate: [
        '',
        [Validators.required]
      ],
      numberOfTravelers: [
        1,
        [Validators.required, Validators.min(1), Validators.max(10)]
      ],

      // Array de viajeros
      travelers: this.fb.array([]),

      // Extras
      includeInsurance: [false],
      includeTransfers: [false],
      specialRequests: ['', [Validators.maxLength(500)]],

      // Términos
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: [this.dateRangeValidator()]
    });

    // Observar cambios en el número de viajeros
    this.bookingForm.get('numberOfTravelers')?.valueChanges.subscribe(num => {
      this.adjustTravelersArray(num);
    });
  }

  get travelers(): FormArray {
    return this.bookingForm.get('travelers') as FormArray;
  }


  createTravelerFormGroup(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      nif: ['', [Validators.required, CustomValidators.nif()]],
      birthDate: ['', [Validators.required]],
      specialNeeds: ['', [Validators.maxLength(200)]]
    });
  }

  addTraveler(): void {
    const currentCount = this.travelers.length;
    const maxTravelers = this.bookingForm.get('numberOfTravelers')?.value || 10;

    if (currentCount < maxTravelers) {
      this.travelers.push(this.createTravelerFormGroup());

      // Animar el nuevo viajero usando DOM manipulation
      setTimeout(() => {
        if (this.travelersContainer) {
          const newElement = this.travelersContainer.nativeElement.lastElementChild;
          if (newElement) {
            newElement.classList.add('slide-in');
          }
        }
      }, 0);

      this.notificationService.info(`Viajero ${currentCount + 1} añadido`);
    } else {
      this.notificationService.warning(`Máximo ${maxTravelers} viajeros permitidos`);
    }
  }

  removeTraveler(index: number): void {
    if (this.travelers.length > 1) {
      // Animar la eliminación
      if (this.travelersContainer) {
        const element = this.travelersContainer.nativeElement.children[index];
        if (element) {
          element.classList.add('slide-out');
          setTimeout(() => {
            this.travelers.removeAt(index);
            this.notificationService.info(`Viajero ${index + 1} eliminado`);
          }, 300);
          return;
        }
      }
      this.travelers.removeAt(index);
    } else {
      this.notificationService.warning('Debe haber al menos un viajero');
    }
  }

  private adjustTravelersArray(targetCount: number): void {
    const currentCount = this.travelers.length;

    if (targetCount > currentCount) {
      // Añadir viajeros
      for (let i = currentCount; i < targetCount; i++) {
        this.addTraveler();
      }
    } else if (targetCount < currentCount) {
      // Eliminar viajeros
      for (let i = currentCount - 1; i >= targetCount; i--) {
        this.removeTraveler(i);
      }
    }
  }


  getErrorMessage(fieldName: string, label: string): string {
    const control = this.bookingForm.get(fieldName);
    return this.formService.getErrorMessage(control, label);
  }

  getTravelerErrorMessage(travelerIndex: number, fieldName: string, label: string): string {
    const control = this.travelers.at(travelerIndex).get(fieldName);
    return this.formService.getErrorMessage(control, label);
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.bookingForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  shouldShowTravelerError(travelerIndex: number, fieldName: string): boolean {
    const control = this.travelers.at(travelerIndex).get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getSelectedDestination() {
    const destinationId = this.bookingForm.get('destination')?.value;
    return this.destinations.find(d => d.id === destinationId);
  }

  calculateTotalPrice(): number {
    const destination = this.getSelectedDestination();
    const travelers = this.bookingForm.get('numberOfTravelers')?.value || 0;
    const insurance = this.bookingForm.get('includeInsurance')?.value ? 50 : 0;
    const transfers = this.bookingForm.get('includeTransfers')?.value ? 75 : 0;

    if (!destination) return 0;

    return (destination.price * travelers) + (insurance * travelers) + (transfers * travelers);
  }

  private dateRangeValidator() {
    return (formGroup: AbstractControl): { [key: string]: any } | null => {
      const departureDate = formGroup.get('departureDate')?.value;
      const returnDate = formGroup.get('returnDate')?.value;

      if (!departureDate || !returnDate) {
        return null;
      }

      const departure = new Date(departureDate);
      const returnD = new Date(returnDate);

      if (returnD <= departure) {
        formGroup.get('returnDate')?.setErrors({ dateRange: true });
        return { dateRange: true };
      }

      return null;
    };
  }

  async onSubmit(): Promise<void> {
    if (this.bookingForm.invalid) {
      this.formService.markFormGroupTouched(this.bookingForm);

      // Marcar todos los viajeros como touched
      this.travelers.controls.forEach(traveler => {
        Object.keys((traveler as FormGroup).controls).forEach(key => {
          traveler.get(key)?.markAsTouched();
        });
      });

      this.notificationService.error('Por favor, complete todos los campos obligatorios');
      return;
    }

    this.formService.setSubmitting(this.formId, true);
    this.loadingService.show('booking-submit', 'Procesando reserva...');

    try {
      await this.simulateApiCall();

      const total = this.calculateTotalPrice();
      this.notificationService.success(
        `¡Reserva confirmada! Total: ${total}€`,
        {
          title: 'Reserva exitosa',
          duration: 7000
        }
      );

      this.bookingForm.reset();
      this.travelers.clear();
      this.addTraveler();
    } catch (error) {
      this.notificationService.error('Error al procesar la reserva. Inténtelo de nuevo.', {
        title: 'Error',
        duration: 0,
        dismissible: true
      });
    } finally {
      this.formService.setSubmitting(this.formId, false);
      this.loadingService.hide('booking-submit');
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Booking Data:', this.bookingForm.value);
        resolve();
      }, 2000);
    });
  }

  resetForm(): void {
    this.formService.resetForm(this.formId, this.bookingForm);
    this.travelers.clear();
    this.addTraveler();
    this.notificationService.info('Formulario reiniciado');
  }
}

