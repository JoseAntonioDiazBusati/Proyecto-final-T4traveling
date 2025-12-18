import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CustomValidators, AsyncCustomValidators } from '../../validators/custom-validators';
import { FormService } from '../../services/form.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-registration-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './registration-form.component.html',
  styleUrls: ['./registration-form.component.scss']
})
export class RegistrationFormComponent implements OnInit, OnDestroy {
  @ViewChild('formTitle', { static: true }) formTitle!: ElementRef<HTMLHeadingElement>;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;

  registrationForm!: FormGroup;
  formId = 'registration-form';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private fb: FormBuilder,
    private formService: FormService,
    private notificationService: NotificationService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.formService.registerForm(this.formId, this.registrationForm);

    // Ejemplo de manipulación DOM con ViewChild
    if (this.formTitle) {
      this.formTitle.nativeElement.style.color = 'var(--color-primary)';
    }
  }

  ngOnDestroy(): void {
    this.formService.unregisterForm(this.formId);
  }

  private initForm(): void {
    this.registrationForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.minLength(3), Validators.maxLength(20)],
        [AsyncCustomValidators.usernameAvailable()]
      ],
      email: [
        '',
        [Validators.required, Validators.email],
        [AsyncCustomValidators.uniqueEmail()]
      ],
      password: [
        '',
        [Validators.required, CustomValidators.strongPassword()]
      ],
      confirmPassword: [
        '',
        [Validators.required]
      ],
      firstName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      lastName: [
        '',
        [Validators.required, Validators.minLength(2)]
      ],
      nif: [
        '',
        [Validators.required, CustomValidators.nif()],
        [AsyncCustomValidators.uniqueDocument()]
      ],
      phone: [
        '',
        [Validators.required, CustomValidators.spanishPhone()]
      ],
      birthDate: [
        '',
        [Validators.required, CustomValidators.minAge(18)]
      ],
      acceptTerms: [
        false,
        [Validators.requiredTrue]
      ]
    }, {
      validators: [CustomValidators.passwordMatch('password', 'confirmPassword')]
    });
  }

  get f() {
    return this.registrationForm.controls;
  }

  getErrorMessage(fieldName: string, label: string): string {
    const control = this.registrationForm.get(fieldName);
    return this.formService.getErrorMessage(control, label);
  }

  shouldShowError(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  isFieldValidating(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return control ? control.pending : false;
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  async onSubmit(): Promise<void> {
    if (this.registrationForm.invalid) {
      this.formService.markFormGroupTouched(this.registrationForm);
      this.notificationService.error('Por favor, corrija los errores en el formulario');
      return;
    }

    this.formService.setSubmitting(this.formId, true);
    this.loadingService.show('registration-submit', 'Registrando usuario...');

    // Animación en el botón usando ViewChild
    if (this.submitButton) {
      this.submitButton.nativeElement.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (this.submitButton) {
          this.submitButton.nativeElement.style.transform = 'scale(1)';
        }
      }, 200);
    }

    try {
      // Simular llamada a API
      await this.simulateApiCall();

      this.notificationService.success('¡Registro completado exitosamente!', {
        title: 'Éxito',
        duration: 5000
      });

      this.registrationForm.reset();
    } catch (error) {
      this.notificationService.error('Error al registrar el usuario. Inténtelo de nuevo.', {
        title: 'Error',
        duration: 0,
        dismissible: true
      });
    } finally {
      this.formService.setSubmitting(this.formId, false);
      this.loadingService.hide('registration-submit');
    }
  }

  private simulateApiCall(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form Data:', this.registrationForm.value);
        resolve();
      }, 2000);
    });
  }

  resetForm(): void {
    this.formService.resetForm(this.formId, this.registrationForm);
    this.notificationService.info('Formulario reiniciado');
  }
}

