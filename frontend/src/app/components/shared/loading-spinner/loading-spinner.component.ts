import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-spinner.component.html',
  styleUrl: './loading-spinner.component.scss'
})
export class LoadingSpinnerComponent {
  private loadingService = inject(LoadingService);

  isGlobalLoading = this.loadingService.isGlobalLoading;
  activeLoadingStates = this.loadingService.activeLoadingStates;

  /**
   * Obtiene el mensaje de carga actual
   */
  get loadingMessage(): string {
    const states = this.activeLoadingStates();
    if (states.length > 0 && states[0].message) {
      return states[0].message;
    }
    return 'Cargando...';
  }
}

