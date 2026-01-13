import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de estado de error
 *
 * Muestra un mensaje de error con opción de reintentar.
 * Útil para mostrar cuando una petición HTTP falla.
 */
@Component({
  selector: 'app-error-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="error-state" role="alert">
      <div class="error-state__icon" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <h3 class="error-state__title">{{ title }}</h3>

      @if (message) {
        <p class="error-state__message">{{ message }}</p>
      }

      @if (showRetry) {
        <button
          type="button"
          class="error-state__retry-btn"
          (click)="onRetry()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <polyline points="23,4 23,10 17,10" />
            <polyline points="1,20 1,14 7,14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
          </svg>
          {{ retryLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .error-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      text-align: center;
      min-height: 200px;
    }

    .error-state__icon {
      width: 64px;
      height: 64px;
      color: #ef4444;
      margin-bottom: 1rem;
    }

    .error-state__icon svg {
      width: 100%;
      height: 100%;
    }

    .error-state__title {
      font-size: 1.125rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    .error-state__message {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 400px;
    }

    .error-state__retry-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.625rem 1.25rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #fff;
      background: var(--color-primary, #3b82f6);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .error-state__retry-btn:hover {
      background: var(--color-primary-dark, #2563eb);
      transform: translateY(-1px);
    }

    .error-state__retry-btn:active {
      transform: translateY(0);
    }

    .error-state__retry-btn svg {
      width: 16px;
      height: 16px;
    }

    :host-context(.dark) .error-state__title {
      color: #f1f5f9;
    }

    :host-context(.dark) .error-state__message {
      color: #94a3b8;
    }
  `]
})
export class ErrorStateComponent {
  @Input() title = 'Ha ocurrido un error';
  @Input() message?: string;
  @Input() showRetry = true;
  @Input() retryLabel = 'Reintentar';

  @Output() retry = new EventEmitter<void>();

  onRetry(): void {
    this.retry.emit();
  }
}

