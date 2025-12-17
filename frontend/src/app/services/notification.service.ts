import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Tipos de notificaciones
 */
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para una notificación
 */
export interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  dismissible?: boolean;
  timestamp: number;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Opciones para crear una notificación
 */
export interface NotificationOptions {
  title?: string;
  duration?: number; // 0 = no auto-dismiss
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

/**
 * Servicio centralizado de notificaciones
 * Gestiona toasts y notificaciones en toda la aplicación
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  // Subject para notificaciones
  private notificationSubject = new Subject<Notification>();
  public notifications$ = this.notificationSubject.asObservable();

  // Signal para notificaciones activas
  private notificationsSignal = signal<Notification[]>([]);
  public notifications = this.notificationsSignal.asReadonly();

  // Configuración por defecto
  private defaultDuration = 5000; // 5 segundos
  private maxNotifications = 5; // Máximo de notificaciones simultáneas

  constructor() {
    // Suscribirse a las notificaciones para gestionar el array
    this.notifications$.subscribe(notification => {
      this.addNotificationToArray(notification);

      // Auto-dismiss si tiene duración
      if (notification.duration && notification.duration > 0) {
        setTimeout(() => {
          this.dismiss(notification.id);
        }, notification.duration);
      }
    });
  }

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, options?: NotificationOptions): string {
    return this.show('success', message, options);
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, options?: NotificationOptions): string {
    return this.show('error', message, options);
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, options?: NotificationOptions): string {
    return this.show('warning', message, options);
  }

  /**
   * Muestra una notificación informativa
   */
  info(message: string, options?: NotificationOptions): string {
    return this.show('info', message, options);
  }

  /**
   * Muestra una notificación personalizada
   */
  show(
    type: NotificationType,
    message: string,
    options?: NotificationOptions
  ): string {
    const notification: Notification = {
      id: this.generateId(),
      type,
      message,
      title: options?.title,
      duration: options?.duration !== undefined ? options.duration : this.defaultDuration,
      dismissible: options?.dismissible !== undefined ? options.dismissible : true,
      timestamp: Date.now(),
      action: options?.action
    };

    this.notificationSubject.next(notification);
    return notification.id;
  }

  /**
   * Descarta una notificación por ID
   */
  dismiss(id: string): void {
    this.notificationsSignal.update(notifications =>
      notifications.filter(n => n.id !== id)
    );
  }

  /**
   * Descarta todas las notificaciones
   */
  dismissAll(): void {
    this.notificationsSignal.set([]);
  }

  /**
   * Descarta notificaciones por tipo
   */
  dismissByType(type: NotificationType): void {
    this.notificationsSignal.update(notifications =>
      notifications.filter(n => n.type !== type)
    );
  }

  /**
   * Añade una notificación al array (con límite)
   */
  private addNotificationToArray(notification: Notification): void {
    this.notificationsSignal.update(notifications => {
      const newNotifications = [notification, ...notifications];

      // Limitar el número de notificaciones
      if (newNotifications.length > this.maxNotifications) {
        return newNotifications.slice(0, this.maxNotifications);
      }

      return newNotifications;
    });
  }

  /**
   * Genera un ID único para la notificación
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Configura la duración por defecto
   */
  setDefaultDuration(duration: number): void {
    this.defaultDuration = duration;
  }

  /**
   * Configura el máximo de notificaciones simultáneas
   */
  setMaxNotifications(max: number): void {
    this.maxNotifications = max;
  }

  /**
   * Obtiene el número de notificaciones activas
   */
  getActiveCount(): number {
    return this.notificationsSignal().length;
  }

  /**
   * Obtiene el número de notificaciones por tipo
   */
  getCountByType(type: NotificationType): number {
    return this.notificationsSignal().filter(n => n.type === type).length;
  }
}

