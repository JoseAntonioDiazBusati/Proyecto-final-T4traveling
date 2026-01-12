import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="not-found">
      <div class="icon">🗺️</div>
      <h1>404</h1>
      <h2>Pagina no encontrada</h2>
      <p>Parece que te has perdido. La pagina que buscas no existe.</p>
      <div class="actions">
        <a routerLink="/" class="btn btn--primary">Volver al inicio</a>
        <a routerLink="/destinos" class="btn btn--outline">Ver destinos</a>
      </div>
    </div>
  `,
  styles: [`
    .not-found { min-height: 80vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 2rem; text-align: center; }
    .icon { font-size: 5rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
    h1 { font-size: 6rem; color: var(--color-primary); line-height: 1; margin-bottom: 0.5rem; }
    h2 { font-size: 1.5rem; color: var(--text-primary); margin-bottom: 1rem; }
    p { color: var(--text-secondary); margin-bottom: 2rem; max-width: 400px; }
    .actions { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; }
    .btn { padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; }
    .btn--primary { background: var(--color-primary); color: white; }
    .btn--outline { border: 2px solid var(--border-color); color: var(--text-primary); }
  `]
})
export class NotFoundComponent {}

