import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, delay, map, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

/**
 * Validadores personalizados síncronos
 */
export class CustomValidators {

  /**
   * Validador de contraseña fuerte
   * Requiere: mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial
   */
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
      const isValidLength = value.length >= 8;

      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar && isValidLength;

      return !passwordValid ? {
        strongPassword: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasSpecialChar,
          isValidLength
        }
      } : null;
    };
  }

  /**
   * Validador de confirmación de contraseña
   * Debe usarse a nivel de FormGroup
   */
  static passwordMatch(passwordField: string, confirmPasswordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get(passwordField);
      const confirmPassword = control.get(confirmPasswordField);

      if (!password || !confirmPassword) {
        return null;
      }

      if (confirmPassword.errors && !confirmPassword.errors['passwordMatch']) {
        return null;
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.setErrors({ passwordMatch: true });
        return { passwordMatch: true };
      } else {
        confirmPassword.setErrors(null);
        return null;
      }
    };
  }

  /**
   * Validador de NIF/NIE español
   */
  static nif(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const nifRegex = /^[0-9]{8}[A-Z]$/;
      const nieRegex = /^[XYZ][0-9]{7}[A-Z]$/;

      if (!nifRegex.test(value) && !nieRegex.test(value)) {
        return { nif: { message: 'Formato de NIF/NIE inválido' } };
      }

      // Validar letra del NIF
      const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      let number = value.substr(0, 8);

      // Para NIE, reemplazar la primera letra
      if (/^[XYZ]/.test(value)) {
        number = value.replace('X', '0').replace('Y', '1').replace('Z', '2').substr(0, 8);
      }

      const letter = value.substr(8, 1);
      const calculatedLetter = letters[parseInt(number) % 23];

      if (letter !== calculatedLetter) {
        return { nif: { message: 'La letra del NIF/NIE no es correcta' } };
      }

      return null;
    };
  }

  /**
   * Validador de teléfono español
   */
  static spanishPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Formatos válidos: +34 XXX XXX XXX, 34XXXXXXXXX, XXXXXXXXX
      const phoneRegex = /^(\+34|0034|34)?[6-9][0-9]{8}$/;
      const cleanValue = value.replace(/\s/g, '');

      if (!phoneRegex.test(cleanValue)) {
        return { spanishPhone: { message: 'Teléfono español inválido' } };
      }

      return null;
    };
  }

  /**
   * Validador de código postal español
   */
  static spanishPostalCode(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      const postalCodeRegex = /^(?:0[1-9]|[1-4][0-9]|5[0-2])[0-9]{3}$/;

      if (!postalCodeRegex.test(value)) {
        return { spanishPostalCode: { message: 'Código postal español inválido (01000-52999)' } };
      }

      return null;
    };
  }

  /**
   * Validador de edad mínima
   */
  static minAge(minAge: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const birthDate = new Date(control.value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }

      if (age < minAge) {
        return { minAge: { requiredAge: minAge, actualAge: age } };
      }

      return null;
    };
  }

  /**
   * Validador de URL
   */
  static url(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      try {
        new URL(control.value);
        return null;
      } catch {
        return { url: { message: 'URL inválida' } };
      }
    };
  }

  /**
   * Validador de rango de fechas (fecha debe estar entre min y max)
   */
  static dateRange(min: Date, max: Date): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }

      const date = new Date(control.value);

      if (date < min || date > max) {
        return {
          dateRange: {
            min: min.toISOString(),
            max: max.toISOString(),
            actual: date.toISOString()
          }
        };
      }

      return null;
    };
  }
}

/**
 * Validadores asíncronos
 */
export class AsyncCustomValidators {

  /**
   * Validador asíncrono de email único
   * Simula una consulta a la API para verificar si el email ya existe
   * Incluye debounce para evitar múltiples llamadas
   */
  static uniqueEmail(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simular llamada a API con delay y debounce
      return of(control.value).pipe(
        debounceTime(500), // Esperar 500ms después del último cambio
        distinctUntilChanged(), // Solo si el valor cambió
        switchMap(email =>
          of(email).pipe(
            delay(1000), // Simular latencia de red
            map(email => {
              // Lista de emails "registrados" para la simulación
              const registeredEmails = [
                'usuario@example.com',
                'admin@t4traveling.com',
                'test@test.com',
                'demo@demo.com'
              ];

              const emailExists = registeredEmails.includes(email.toLowerCase());

              return emailExists ? { uniqueEmail: { message: 'Este email ya está registrado' } } : null;
            })
          )
        )
      );
    };
  }

  /**
   * Validador asíncrono de nombre de usuario disponible
   * Simula una consulta a la API para verificar si el username está disponible
   * Incluye debounce para evitar múltiples llamadas
   */
  static usernameAvailable(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      // Simular llamada a API con delay y debounce
      return of(control.value).pipe(
        debounceTime(500), // Esperar 500ms después del último cambio
        distinctUntilChanged(), // Solo si el valor cambió
        switchMap(username =>
          of(username).pipe(
            delay(800), // Simular latencia de red
            map(username => {
              // Lista de usernames "ocupados" para la simulación
              const takenUsernames = [
                'admin',
                'root',
                'user',
                'test',
                'demo',
                'superadmin',
                't4traveling'
              ];

              const isTaken = takenUsernames.includes(username.toLowerCase());

              return isTaken ? {
                usernameAvailable: {
                  message: `El nombre de usuario "${username}" no está disponible`
                }
              } : null;
            })
          )
        )
      );
    };
  }

  /**
   * Validador asíncrono de documento de identidad único
   * Simula verificación en base de datos
   * Incluye debounce para evitar múltiples llamadas
   */
  static uniqueDocument(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }

      return of(control.value).pipe(
        debounceTime(500), // Esperar 500ms después del último cambio
        distinctUntilChanged(), // Solo si el valor cambió
        switchMap(document =>
          of(document).pipe(
            delay(1200), // Simular latencia de red
            map(document => {
              // Documentos "registrados" para la simulación
              const registeredDocuments = [
                '12345678A',
                '87654321B',
                'X1234567L'
              ];

              const exists = registeredDocuments.includes(document.toUpperCase());

              return exists ? {
                uniqueDocument: {
                  message: 'Este documento ya está registrado en el sistema'
                }
              } : null;
            })
          )
        )
      );
    };
  }
}

