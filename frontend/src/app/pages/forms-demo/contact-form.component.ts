import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators } from '../../validators/custom-validators';
import { FormService } from '../../services/form.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

interface ContactOption {
  type: string;
  value: string;
  preferred: boolean;
}

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.scss']
})
export class ContactFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('formContainer') formContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('subjectInput') subjectInput!: ElementRef<HTMLInputElement>;

  contactForm!: FormGroup;
  formId = 'contact-form';
  characterCount = 0;
  maxCharacters = 1000;

  contactTypes = [
    { value: 'phone', label: 'Teléfono' },
    { value: 'email', label: 'Email' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'telegram', label: 'Telegram' }
  ];

  subjects = [
    'Consulta general',
    'Información de reservas',
    'Cancelación',
    'Modificación de reserva',
    'Reclamo',
    'Sugerencia',
    'Otro'
  ];

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formService.registerForm(this.formId, this.contactForm);

    // Agregar un método de contacto por defecto
    this.addContactMethod();

    // Observar cambios en el mensaje para contar caracteres
    this.contactForm.get('message')?.valueChanges.subscribe(value => {
      this.characterCount = value ? value.length : 0;
    });
  }

  ngAfterViewInit(): void {
    // Enfocar el campo de asunto después de la inicialización
    if (this.subjectInput) {
      setTimeout(() => {
        this.subjectInput.nativeElement.focus();
      }, 100);
    }

    // Aplicar animación de entrada al contenedor usando ViewChild
    if (this.formContainer) {
      this.formContainer.nativeElement.style.opacity = '0';
      this.formContainer.nativeElement.style.transform = 'translateY(20px)';

      setTimeout(() => {
        this.formContainer.nativeElement.style.transition = 'all 0.5s ease';
        this.formContainer.nativeElement.style.opacity = '1';
        this.formContainer.nativeElement.style.transform = 'translateY(0)';
      }, 50);
    }
  }

  ngOnDestroy(): void {
    this.formService.unregisterForm(this.formId);
  }

  private initForm(): void {
    this.contactForm = this.fb.group({
      // Información personal
      fullName: [
        '',
        [Validators.required, Validators.minLength(3)]
      ],
      email: [
        '',
        [Validators.required, Validators.email]
      ],

      // Métodos de contacto (FormArray)
      contactMethods: this.fb.array([]),

      // Detalles de la consulta
      subject: [
        '',
        [Validators.required]
      ],
      orderNumber: [
        '',
        [Validators.pattern(/^[A-Z]{2}\d{8}$/)]
      ],
      priority: [
        'normal',
        [Validators.required]
      ],
      message: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]
      ],

      // Opciones adicionales
      subscribeNewsletter: [false],
      acceptPrivacy: [false, [Validators.requiredTrue]]
    });
  }

  get contactMethods(): FormArray {
    return this.contactForm.get('contactMethods') as FormArray;
  }

  get f() {
    return this.contactForm.controls;
  }

  createContactMethodFormGroup(): FormGroup {
    return this.fb.group({
      type: ['phone', [Validators.required]],
      value: ['', [Validators.required]],
      preferred: [false]
    });
  }

  addContactMethod(): void {
    if (this.contactMethods.length < 4) {
      this.contactMethods.push(this.createContactMethodFormGroup());
      this.notificationService.info('Método de contacto añadido');
    } else {
      this.notificationService.warning('Máximo 4 métodos de contacto');
    }
  }

  removeContactMethod(index: number): void {
    if (this.contactMethods.length > 1) {
      this.contactMethods.removeAt(index);
      this.notificationService.info('Método de contacto eliminado');
    } else {
      this.notificationService.warning('Debe haber al menos un método de contacto');
    }
  }

  getContactMethodFormGroup(index: number): FormGroup {
    return this.contactMethods.at(index) as FormGroup;
  }

  onContactTypeChange(index: number): void {
    const contactMethod = this.getContactMethodFormGroup(index);
    const type = contactMethod.get('type')?.value;
    const valueControl = contactMethod.get('value');

    // Limpiar el valor cuando cambia el tipo
    valueControl?.setValue('');

    // Aplicar validaciones específicas según el tipo
    if (type === 'email') {
      valueControl?.setValidators([Validators.required, Validators.email]);
    } else if (type === 'phone' || type === 'whatsapp') {
      valueControl?.setValidators([Validators.required, CustomValidators.spanishPhone()]);
    } else {
      valueControl?.setValidators([Validators.required]);
    }

    valueControl?.updateValueAndValidity();
  }

  setPreferredContact(index: number): void {
    // Desmarcar todos los demás como preferidos
    this.contactMethods.controls.forEach((control, i) => {
      if (i !== index) {
        control.get('preferred')?.setValue(false);
      }
    });

    // Marcar el seleccionado
    this.getContactMethodFormGroup(index).get('preferred')?.setValue(true);
  }

  getErrorMessage(fieldName: string, label: string): string {
    const control = this.contactForm.get(fieldName);
    return this.formService.getErrorMessage(control, label);
  }

  getContactMethodErrorMessage(methodIndex: number, fieldName: string, label: string): string {
    const control = this.contactMethods.at(methodIndex).get(fieldName);
    return this.formService.getErrorMessage(control, label);
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  shouldShowContactMethodError(methodIndex: number, fieldName: string): boolean {
    const control = this.contactMethods.at(methodIndex).get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getCharacterCountClass(): string {
    const percentage = (this.characterCount / this.maxCharacters) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'normal';
  }

  async onSubmit(): Promise<void> {
    if (this.contactForm.invalid) {
      this.formService.markFormGroupTouched(this.contactForm);

      // Marcar todos los métodos de contacto como touched
      this.contactMethods.controls.forEach(method => {
        Object.keys((method as FormGroup).controls).forEach(key => {
          method.get(key)?.markAsTouched();
        });
      });

      this.notificationService.error('Por favor, complete todos los campos obligatorios');

      // Hacer scroll al primer error usando DOM manipulation
      setTimeout(() => {
        const firstError = document.querySelector('.form-control.invalid');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);

      return;
    }

    this.formService.setSubmitting(this.formId, true);
    this.loadingService.show('Enviando consulta...');

    try {
      await this.simulateApiCall();

      this.notificationService.success(
        'Su consulta ha sido enviada correctamente. Le responderemos pronto.',
        {
          title: 'Consulta enviada',
          duration: 7000
        }
      );

      this.contactForm.reset();
      this.contactMethods.clear();
      this.addContactMethod();
      this.characterCount = 0;
    } catch (error) {
      this.notificationService.error('Error al enviar la consulta. Inténtelo de nuevo.', {
        title: 'Error',
        duration: 0,
        dismissible: true
      });
    } finally {
      this.formService.setSubmitting(this.formId, false);
      this.loadingService.hide('Consulta enviada');
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Contact Form Data:', this.contactForm.value);
        resolve();
      }, 2000);
    });
  }

  resetForm(): void {
    this.formService.resetForm(this.formId, this.contactForm);
    this.contactMethods.clear();
    this.addContactMethod();
    this.characterCount = 0;
    this.notificationService.info('Formulario reiniciado');
  }
}

