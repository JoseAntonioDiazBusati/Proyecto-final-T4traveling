import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { FormService } from '../../services/form.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

interface Traveler {
  firstName: string;
  lastName: string;
  nif: string;
  birthDate: string;
  specialNeeds?: string;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss']
})
export class BookingFormComponent implements OnInit, OnDestroy {
  @ViewChild('travelersContainer') travelersContainer!: ElementRef<HTMLDivElement>;

  bookingForm!: FormGroup;
  formId = 'booking-form';
  minDate: string;
  maxDate: string;

  destinations = [
    { id: 1, name: 'París, Francia', price: 599 },
    { id: 2, name: 'Roma, Italia', price: 699 },
    { id: 3, name: 'Barcelona, España', price: 399 },
    { id: 4, name: 'Londres, Reino Unido', price: 799 },
    { id: 5, name: 'Ámsterdam, Países Bajos', price: 549 }
  ];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
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

    // Añadir al menos un viajero por defecto
    this.addTraveler();
  }

  ngOnDestroy(): void {
    this.formService.unregisterForm(this.formId);
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

  get f() {
    return this.bookingForm.controls;
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

  getTravelerFormGroup(index: number): FormGroup {
    return this.travelers.at(index) as FormGroup;
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
    return this.destinations.find(d => d.id === parseInt(destinationId));
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
    this.loadingService.show('Procesando reserva...');

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
      this.loadingService.hide('Reserva procesada');
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

