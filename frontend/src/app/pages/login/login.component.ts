import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  // Estado del componente
  isRegisterMode = false;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Datos de login
  loginEmail = '';
  loginPassword = '';

  // Datos de registro
  registerName = '';
  registerEmail = '';
  registerPassword = '';

  /**
   * Cambia al modo de registro
   */
  switchToRegister(): void {
    this.isRegisterMode = true;
    this.clearMessages();
    this.clearLoginForm();
  }

  /**
   * Cambia al modo de login
   */
  switchToLogin(): void {
    this.isRegisterMode = false;
    this.clearMessages();
    this.clearRegisterForm();
  }

  /**
   * Procesa el formulario de login
   */
  async onLoginSubmit(): Promise<void> {
    if (!this.loginEmail || !this.loginPassword) return;

    this.isLoading = true;
    this.clearMessages();

    try {
      const result = await this.authService.login(this.loginEmail, this.loginPassword);

      if (result.success) {
        this.successMessage = result.message;

        // Redirigir después de un breve delay
        setTimeout(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }, 500);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Error al iniciar sesión. Inténtalo de nuevo.';
      console.error('Error en login:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Procesa el formulario de registro
   */
  async onRegisterSubmit(): Promise<void> {
    if (!this.registerName || !this.registerEmail || !this.registerPassword) return;

    this.isLoading = true;
    this.clearMessages();

    try {
      const result = await this.authService.register(
        this.registerName,
        this.registerEmail,
        this.registerPassword
      );

      if (result.success) {
        this.successMessage = result.message;

        // Redirigir después de un breve delay
        setTimeout(() => {
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigate([returnUrl]);
        }, 500);
      } else {
        this.errorMessage = result.message;
      }
    } catch (error) {
      this.errorMessage = 'Error al crear la cuenta. Inténtalo de nuevo.';
      console.error('Error en registro:', error);
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Limpia los mensajes de error y éxito
   */
  private clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Limpia el formulario de login
   */
  private clearLoginForm(): void {
    this.loginEmail = '';
    this.loginPassword = '';
  }

  /**
   * Limpia el formulario de registro
   */
  private clearRegisterForm(): void {
    this.registerName = '';
    this.registerEmail = '';
    this.registerPassword = '';
  }
}

