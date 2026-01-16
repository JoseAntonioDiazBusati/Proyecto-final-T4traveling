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
  templateUrl: './loading-state.component.html',
  styleUrls: ['./loading-state.component.scss']
})
export class LoadingStateComponent {
  @Input() message?: string;
  @Input() overlay = false;
}

