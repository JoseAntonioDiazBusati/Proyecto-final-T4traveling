import { Injectable, signal } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';

/**
 * Interfaz para el estado de un formulario
 */
export interface FormState {
  formId: string;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
  isTouched: boolean;
  errors: { [key: string]: any };
}

/**
 * Servicio para gestión centralizada de formularios
 * Maneja el estado y validación de formularios en la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class FormService {

  // Signal para estados de formularios
  private formsState = signal<Map<string, FormState>>(new Map());

  constructor() {}

  /**
   * Registra un formulario en el servicio
   */
  registerForm(formId: string, form: FormGroup): void {
    const state: FormState = {
      formId,
      isSubmitting: false,
      isValid: form.valid,
      isDirty: form.dirty,
      isTouched: form.touched,
      errors: this.getFormErrors(form)
    };

    this.formsState.update(forms => {
      const newForms = new Map(forms);
      newForms.set(formId, state);
      return newForms;
    });

    // Suscribirse a cambios del formulario
    form.statusChanges.subscribe(() => {
      this.updateFormState(formId, form);
    });

    form.valueChanges.subscribe(() => {
      this.updateFormState(formId, form);
    });
  }

  /**
   * Actualiza el estado de un formulario
   */
  private updateFormState(formId: string, form: FormGroup): void {
    const currentState = this.formsState().get(formId);
    if (!currentState) return;

    const newState: FormState = {
      ...currentState,
      isValid: form.valid,
      isDirty: form.dirty,
      isTouched: form.touched,
      errors: this.getFormErrors(form)
    };

    this.formsState.update(forms => {
      const newForms = new Map(forms);
      newForms.set(formId, newState);
      return newForms;
    });
  }

  /**
   * Marca el formulario como en proceso de envío
   */
  setSubmitting(formId: string, isSubmitting: boolean): void {
    const state = this.formsState().get(formId);
    if (!state) return;

    this.formsState.update(forms => {
      const newForms = new Map(forms);
      newForms.set(formId, { ...state, isSubmitting });
      return newForms;
    });
  }

  /**
   * Obtiene el estado de un formulario
   */
  getFormState(formId: string): FormState | undefined {
    return this.formsState().get(formId);
  }

  /**
   * Marca todos los campos como touched para mostrar errores
   */
  markFormGroupTouched(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);
      control?.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /**
   * Obtiene todos los errores del formulario de forma recursiva
   */
  getFormErrors(form: FormGroup): { [key: string]: any } {
    const errors: { [key: string]: any } = {};

    Object.keys(form.controls).forEach(key => {
      const control = form.get(key);

      if (control instanceof FormGroup) {
        const nestedErrors = this.getFormErrors(control);
        if (Object.keys(nestedErrors).length > 0) {
          errors[key] = nestedErrors;
        }
      } else if (control?.errors) {
        errors[key] = control.errors;
      }
    });

    return errors;
  }

  /**
   * Obtiene el mensaje de error para un control
   */
  getErrorMessage(control: AbstractControl | null, fieldName: string = 'Este campo'): string {
    if (!control || !control.errors) {
      return '';
    }

    const errors = control.errors;

    if (errors['required']) {
      return `${fieldName} es obligatorio`;
    }
    if (errors['email']) {
      return 'Email inválido';
    }
    if (errors['minlength']) {
      return `${fieldName} debe tener al menos ${errors['minlength'].requiredLength} caracteres`;
    }
    if (errors['maxlength']) {
      return `${fieldName} no puede tener más de ${errors['maxlength'].requiredLength} caracteres`;
    }
    if (errors['min']) {
      return `El valor mínimo es ${errors['min'].min}`;
    }
    if (errors['max']) {
      return `El valor máximo es ${errors['max'].max}`;
    }
    if (errors['pattern']) {
      return `${fieldName} tiene un formato inválido`;
    }
    if (errors['strongPassword']) {
      const requirements: string[] = [];
      if (!errors['strongPassword'].isValidLength) requirements.push('mínimo 8 caracteres');
      if (!errors['strongPassword'].hasUpperCase) requirements.push('una mayúscula');
      if (!errors['strongPassword'].hasLowerCase) requirements.push('una minúscula');
      if (!errors['strongPassword'].hasNumeric) requirements.push('un número');
      if (!errors['strongPassword'].hasSpecialChar) requirements.push('un carácter especial');
      return `La contraseña debe contener: ${requirements.join(', ')}`;
    }
    if (errors['passwordMatch']) {
      return 'Las contraseñas no coinciden';
    }
    if (errors['nif']) {
      return errors['nif'].message || 'NIF/NIE inválido';
    }
    if (errors['spanishPhone']) {
      return errors['spanishPhone'].message || 'Teléfono inválido';
    }
    if (errors['spanishPostalCode']) {
      return errors['spanishPostalCode'].message || 'Código postal inválido';
    }
    if (errors['minAge']) {
      return `Debes tener al menos ${errors['minAge'].requiredAge} años`;
    }
    if (errors['url']) {
      return errors['url'].message || 'URL inválida';
    }
    if (errors['dateRange']) {
      return 'La fecha debe estar dentro del rango permitido';
    }
    if (errors['uniqueEmail']) {
      return errors['uniqueEmail'].message || 'Este email ya está registrado';
    }
    if (errors['usernameAvailable']) {
      return errors['usernameAvailable'].message || 'Este nombre de usuario no está disponible';
    }
    if (errors['uniqueDocument']) {
      return errors['uniqueDocument'].message || 'Este documento ya está registrado';
    }

    return 'Campo inválido';
  }

  /**
   * Limpia los datos de un formulario
   */
  resetForm(formId: string, form: FormGroup): void {
    form.reset();
    this.updateFormState(formId, form);
  }

  /**
   * Desregistra un formulario
   */
  unregisterForm(formId: string): void {
    this.formsState.update(forms => {
      const newForms = new Map(forms);
      newForms.delete(formId);
      return newForms;
    });
  }
}

