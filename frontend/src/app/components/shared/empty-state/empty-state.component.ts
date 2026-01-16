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
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
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

