import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de estado vacío
 *
 * Muestra un mensaje cuando no hay datos para mostrar.
 * Permite personalizar el icono, título, mensaje y acción.
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state">
      <div class="empty-state__icon" aria-hidden="true">
        @switch (icon) {
          @case ('search') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          }
          @case ('folder') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          }
          @case ('inbox') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
              <path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
            </svg>
          }
          @case ('calendar') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
          @case ('users') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
          @case ('map') {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
              <line x1="8" y1="2" x2="8" y2="18" />
              <line x1="16" y1="6" x2="16" y2="22" />
            </svg>
          }
          @default {
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <line x1="9" y1="9" x2="15" y2="15" />
              <line x1="15" y1="9" x2="9" y2="15" />
            </svg>
          }
        }
      </div>

      <h3 class="empty-state__title">{{ title }}</h3>

      @if (message) {
        <p class="empty-state__message">{{ message }}</p>
      }

      @if (actionLabel) {
        <button
          type="button"
          class="empty-state__action-btn"
          (click)="onAction()"
        >
          {{ actionLabel }}
        </button>
      }
    </div>
  `,
  styles: [`
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 3rem 2rem;
      text-align: center;
      min-height: 250px;
    }

    .empty-state__icon {
      width: 80px;
      height: 80px;
      color: #cbd5e1;
      margin-bottom: 1.5rem;
    }

    .empty-state__icon svg {
      width: 100%;
      height: 100%;
    }

    .empty-state__title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1e293b;
      margin: 0 0 0.5rem;
    }

    .empty-state__message {
      font-size: 0.875rem;
      color: #64748b;
      margin: 0 0 1.5rem;
      max-width: 400px;
      line-height: 1.5;
    }

    .empty-state__action-btn {
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

    .empty-state__action-btn:hover {
      background: var(--color-primary-dark, #2563eb);
      transform: translateY(-1px);
    }

    .empty-state__action-btn:active {
      transform: translateY(0);
    }

    :host-context(.dark) .empty-state__icon {
      color: #475569;
    }

    :host-context(.dark) .empty-state__title {
      color: #f1f5f9;
    }

    :host-context(.dark) .empty-state__message {
      color: #94a3b8;
    }
  `]
})
export class EmptyStateComponent {
  @Input() title = 'No hay datos';
  @Input() message?: string;
  @Input() icon: 'search' | 'folder' | 'inbox' | 'calendar' | 'users' | 'map' | 'default' = 'default';
  @Input() actionLabel?: string;

  @Output() action = new EventEmitter<void>();

  onAction(): void {
    this.action.emit();
  }
}

