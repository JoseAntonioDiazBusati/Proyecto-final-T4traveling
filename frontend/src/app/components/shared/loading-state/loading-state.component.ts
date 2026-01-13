import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de estado de carga
 *
 * Muestra un indicador de carga con mensaje opcional.
 * Se puede usar tanto inline como overlay de pantalla completa.
 */
@Component({
  selector: 'app-loading-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="loading-state"
      [class.loading-state--overlay]="overlay"
      [class.loading-state--inline]="!overlay"
      role="status"
      aria-live="polite"
    >
      <div class="loading-state__content">
        <div class="loading-state__spinner" aria-hidden="true">
          <svg
            class="loading-state__spinner-svg"
            viewBox="0 0 50 50"
          >
            <circle
              class="loading-state__spinner-track"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="4"
            />
            <circle
              class="loading-state__spinner-progress"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        </div>
        @if (message) {
          <p class="loading-state__message">{{ message }}</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .loading-state {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .loading-state--overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9999;
      backdrop-filter: blur(4px);
    }

    .loading-state--inline {
      padding: 2rem;
      min-height: 200px;
    }

    .loading-state__content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .loading-state__spinner {
      width: 48px;
      height: 48px;
    }

    .loading-state__spinner-svg {
      width: 100%;
      height: 100%;
      animation: spin 1s linear infinite;
    }

    .loading-state__spinner-track {
      stroke: #e2e8f0;
    }

    .loading-state__spinner-progress {
      stroke: var(--color-primary, #3b82f6);
      stroke-dasharray: 80, 200;
      stroke-dashoffset: 0;
      animation: dash 1.5s ease-in-out infinite;
    }

    .loading-state__message {
      font-size: 0.875rem;
      color: #64748b;
      text-align: center;
      margin: 0;
    }

    @keyframes spin {
      100% {
        transform: rotate(360deg);
      }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    :host-context(.dark) .loading-state--overlay {
      background: rgba(15, 23, 42, 0.9);
    }

    :host-context(.dark) .loading-state__spinner-track {
      stroke: #334155;
    }

    :host-context(.dark) .loading-state__message {
      color: #94a3b8;
    }
  `]
})
export class LoadingStateComponent {
  @Input() message?: string;
  @Input() overlay = false;
}

