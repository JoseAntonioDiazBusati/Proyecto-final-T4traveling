import { Injectable, signal, computed } from '@angular/core';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Interfaz para mensajes entre componentes
 */
export interface ComponentMessage<T = any> {
  type: string;
  payload?: T;
  timestamp: number;
  source?: string;
}

/**
 * Servicio de comunicación entre componentes
 * Implementa el patrón Observable/Subject para comunicación entre componentes hermanos
 * y componentes que no tienen relación directa padre-hijo
 */
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  // Subject privado para mensajes
  private messageSubject = new Subject<ComponentMessage>();

  // Observable público para que los componentes se suscriban
  public messages$ = this.messageSubject.asObservable();

  // BehaviorSubject para el último mensaje (útil para componentes que se crean tarde)
  private lastMessageSubject = new BehaviorSubject<ComponentMessage | null>(null);
  public lastMessage$ = this.lastMessageSubject.asObservable();

  // Signal para rastrear mensajes activos
  private messagesSignal = signal<ComponentMessage[]>([]);
  public messages = computed(() => this.messagesSignal());

  // Contador de mensajes
  private messageCount = signal(0);
  public totalMessages = computed(() => this.messageCount());

  constructor() {
    // Suscribirse a mensajes para mantener el historial
    this.messages$.subscribe(message => {
      this.lastMessageSubject.next(message);
      this.messagesSignal.update(messages => [...messages.slice(-99), message]); // Últimos 100
      this.messageCount.update(count => count + 1);
    });
  }

  /**
   * Envía un mensaje a todos los componentes suscritos
   */
  sendMessage<T = any>(type: string, payload?: T, source?: string): void {
    const message: ComponentMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
      source
    };

    this.messageSubject.next(message);
  }

  /**
   * Obtiene un observable filtrado por tipo de mensaje
   */
  onMessage<T = any>(type: string): Observable<ComponentMessage<T>> {
    return this.messages$.pipe(
      filter(message => message.type === type)
    ) as Observable<ComponentMessage<T>>;
  }

  /**
   * Obtiene un observable filtrado por múltiples tipos
   */
  onMessages<T = any>(...types: string[]): Observable<ComponentMessage<T>> {
    return this.messages$.pipe(
      filter(message => types.includes(message.type))
    ) as Observable<ComponentMessage<T>>;
  }

  /**
   * Limpia el historial de mensajes
   */
  clearHistory(): void {
    this.messagesSignal.set([]);
  }

  /**
   * Obtiene el historial de mensajes
   */
  getHistory(): ComponentMessage[] {
    return this.messagesSignal();
  }

  /**
   * Obtiene mensajes filtrados por tipo del historial
   */
  getHistoryByType(type: string): ComponentMessage[] {
    return this.messagesSignal().filter(m => m.type === type);
  }
}

