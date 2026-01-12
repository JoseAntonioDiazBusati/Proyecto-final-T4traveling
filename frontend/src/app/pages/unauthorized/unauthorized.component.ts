import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="unauthorized">
      <div class="icon">🔒</div>
      <h1>403</h1>
      <h2>Acceso denegado</h2>
      <p>No tienes permisos para acceder a esta pagina.</p>
      <div class="actions">
        <a routerLink="/" class="btn btn--primary">Volver al inicio</a>
        <a routerLink="/login" class="btn btn--outline">Iniciar sesion</a>
      </div>
    </div>
  `,
  styles: [`
    .unauthorized { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .icon { font-size: 5rem; margin-bottom: 1rem; }
    h1 { font-size: 6rem; color: #ef4444; line-height: 1; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1rem; }
    p { color: var(--text-secondary); margin-bottom: 2rem; max-width: 400px; }
    .actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; }
    .btn--primary { background: var(--color-primary); color: white; }
    .btn--outline { border: 2px solid var(--border-color); color: var(--text-primary); }
  `]
})
export class UnauthorizedComponent {}

