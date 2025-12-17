import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.scss'
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  private notificationService = inject(NotificationService);
  private subscription?: Subscription;

  notifications = this.notificationService.notifications;

  ngOnInit(): void {
    // Opcional: suscribirse a eventos específicos
    this.subscription = this.notificationService.notifications$.subscribe(notification => {
      // Aquí podrías agregar efectos de sonido, vibraciones, etc.
      console.log('Nueva notificación:', notification);
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  /**
   * Cierra una notificación
   */
  dismiss(id: string): void {
    this.notificationService.dismiss(id);
  }

  /**
   * Ejecuta la acción de una notificación
   */
  executeAction(notification: Notification): void {
    if (notification.action) {
      notification.action.callback();
      this.dismiss(notification.id);
    }
  }

  /**
   * Obtiene el icono según el tipo
   */
  getIcon(type: string): string {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '✕';
      case 'warning':
        return '⚠';
      case 'info':
        return 'ℹ';
      default:
        return '';
    }
  }

  /**
   * Obtiene el título por defecto según el tipo
   */
  getDefaultTitle(type: string): string {
    switch (type) {
      case 'success':
        return 'Éxito';
      case 'error':
        return 'Error';
      case 'warning':
        return 'Advertencia';
      case 'info':
        return 'Información';
      default:
        return '';
    }
  }
}

