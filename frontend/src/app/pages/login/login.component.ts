import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1>Iniciar sesion</h1>
        <form (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" [(ngModel)]="email" name="email" required [disabled]="isLoading" />
          </div>
          <div class="form-group">
            <label for="password">Contrasena</label>
            <input type="password" id="password" [(ngModel)]="password" name="password" required [disabled]="isLoading" />
          </div>
          <div *ngIf="errorMessage" class="error">{{ errorMessage }}</div>
          <button type="submit" [disabled]="isLoading || !email || !password">
            {{ isLoading ? 'Cargando...' : 'Entrar' }}
          </button>
        </form>
        <p class="hint">Demo: usa cualquier email y contrasena (min 4 chars). Incluye "admin" para rol admin.</p>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height: 80vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
    .login-card { width: 100%; max-width: 400px; background: var(--bg-surface); border-radius: 1rem; padding: 2rem; border: 1px solid var(--border-color); }
    .login-card h1 { color: var(--text-primary); margin-bottom: 1.5rem; text-align: center; }
    .login-form { display: flex; flex-direction: column; gap: 1rem; }
    .form-group { display: flex; flex-direction: column; gap: 0.5rem; }
    .form-group label { color: var(--text-primary); font-size: 0.875rem; }
    .form-group input { padding: 0.75rem; border: 1px solid var(--border-color); border-radius: 0.5rem; background: var(--bg-body); color: var(--text-primary); }
    .error { color: #ef4444; font-size: 0.875rem; padding: 0.5rem; background: rgba(239,68,68,0.1); border-radius: 0.25rem; }
    button { padding: 0.875rem; background: var(--color-primary); color: white; border: none; border-radius: 0.5rem; cursor: pointer; font-weight: 500; }
    button:disabled { opacity: 0.6; cursor: not-allowed; }
    .hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 1rem; text-align: center; }
  `]
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  email = '';
  password = '';
  isLoading = false;
  errorMessage = '';

  async onSubmit(): Promise<void> {
    if (!this.email || !this.password) return;
    this.isLoading = true;
    this.errorMessage = '';
    try {
      const result = await this.authService.login(this.email, this.password);
      if (result.success) {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      } else {
        this.errorMessage = result.message;
      }
    } catch {
      this.errorMessage = 'Error al iniciar sesion';
    } finally {
      this.isLoading = false;
    }
  }
}

