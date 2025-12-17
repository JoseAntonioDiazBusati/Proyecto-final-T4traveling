import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

// Servicios
import { CommunicationService } from '../../services/communication.service';
import { StateService } from '../../services/state.service';
import { NotificationService } from '../../services/notification.service';
import { LoadingService } from '../../services/loading.service';
import { DestinationService, Destination } from '../../services/destination.service';

@Component({
  selector: 'app-services-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './services-demo.component.html',
  styleUrl: './services-demo.component.scss'
})
export class ServicesDemoComponent implements OnInit, OnDestroy {
  // Inyección de servicios
  private communicationService = inject(CommunicationService);
  private stateService = inject(StateService);
  private notificationService = inject(NotificationService);
  private loadingService = inject(LoadingService);
  private destinationService = inject(DestinationService);

  // Suscripciones
  private subscriptions: Subscription[] = [];

  // Estados locales
  destinations: Destination[] = [];
  selectedDestination: Destination | null = null;
  messageLog: string[] = [];

  // Signals del StateService
  user = this.stateService.user;
  cart = this.stateService.cart;
  cartItemCount = this.stateService.cartItemCount;
  cartTotal = this.stateService.cartTotal;
  isAuthenticated = this.stateService.isAuthenticated;

  // Estados de loading específicos
  isLoadingDestinations = false;
  isCreatingBooking = false;

  // Formularios
  userName = '';
  userEmail = '';
  searchQuery = '';
  bookingData = {
    destination: '',
    date: '',
    guests: 1
  };

  ngOnInit(): void {
    // Suscribirse a mensajes de comunicación
    this.subscriptions.push(
      this.communicationService.messages$.subscribe(message => {
        this.messageLog.unshift(`[${message.type}] ${JSON.stringify(message.payload)}`);
        if (this.messageLog.length > 10) {
          this.messageLog.pop();
        }
      })
    );

    // Cargar destinos iniciales
    this.loadDestinations();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  // ==========================================
  // DEMOSTRACIÓN DE COMUNICACIÓN
  // ==========================================

  sendMessage(): void {
    this.communicationService.sendMessage(
      'user-action',
      { action: 'button-clicked', timestamp: Date.now() },
      'ServicesDemoComponent'
    );

    this.notificationService.info('Mensaje enviado a través del servicio de comunicación');
  }

  sendCustomMessage(type: string): void {
    this.communicationService.sendMessage(type, {
      data: `Mensaje personalizado de tipo ${type}`,
      from: 'demo'
    });
  }

  // ==========================================
  // DEMOSTRACIÓN DE ESTADO GLOBAL
  // ==========================================

  login(): void {
    if (!this.userName || !this.userEmail) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.stateService.setUser({
      id: 'user-1',
      name: this.userName,
      email: this.userEmail,
      avatar: 'https://i.pravatar.cc/150?u=' + this.userEmail
    });

    this.notificationService.success(`Bienvenido ${this.userName}!`, {
      title: 'Login exitoso'
    });

    this.userName = '';
    this.userEmail = '';
  }

  logout(): void {
    this.stateService.logout();
    this.notificationService.info('Sesión cerrada correctamente');
  }

  addToCart(destination: Destination): void {
    this.stateService.addToCart({
      destinationId: destination.id,
      name: destination.name,
      price: destination.price,
      quantity: 1
    });

    this.notificationService.success(`${destination.name} añadido al carrito`, {
      action: {
        label: 'Ver carrito',
        callback: () => console.log('Ver carrito')
      }
    });

    this.communicationService.sendMessage('cart-updated', {
      action: 'add',
      item: destination
    });
  }

  clearCart(): void {
    this.stateService.clearCart();
    this.notificationService.info('Carrito vaciado');
    this.communicationService.sendMessage('cart-updated', { action: 'clear' });
  }

  // ==========================================
  // DEMOSTRACIÓN DE NOTIFICACIONES
  // ==========================================

  showSuccessNotification(): void {
    this.notificationService.success('Operación completada correctamente', {
      title: '¡Éxito!',
      duration: 3000
    });
  }

  showErrorNotification(): void {
    this.notificationService.error('Ha ocurrido un error inesperado', {
      title: 'Error',
      duration: 5000
    });
  }

  showWarningNotification(): void {
    this.notificationService.warning('Esta acción requiere confirmación', {
      title: 'Advertencia',
      duration: 4000
    });
  }

  showInfoNotification(): void {
    this.notificationService.info('Nueva actualización disponible', {
      title: 'Información',
      duration: 3000
    });
  }

  showPersistentNotification(): void {
    this.notificationService.success('Esta notificación no se cierra automáticamente', {
      title: 'Notificación persistente',
      duration: 0, // 0 = no auto-dismiss
      action: {
        label: 'Aceptar',
        callback: () => console.log('Notificación aceptada')
      }
    });
  }

  // ==========================================
  // DEMOSTRACIÓN DE LOADING
  // ==========================================

  showGlobalLoading(): void {
    this.loadingService.showGlobal();

    setTimeout(() => {
      this.loadingService.hideGlobal();
      this.notificationService.success('Operación completada');
    }, 3000);
  }

  loadDestinations(): void {
    this.isLoadingDestinations = true;

    this.subscriptions.push(
      this.destinationService.getDestinations().subscribe({
        next: (destinations) => {
          this.destinations = destinations;
          this.isLoadingDestinations = false;
        },
        error: (error) => {
          console.error('Error al cargar destinos:', error);
          this.isLoadingDestinations = false;
        }
      })
    );
  }

  searchDestinations(): void {
    if (!this.searchQuery) {
      this.loadDestinations();
      return;
    }

    this.loadingService.show('search', 'Buscando destinos...');

    this.subscriptions.push(
      this.destinationService.searchDestinations(this.searchQuery).subscribe({
        next: (results) => {
          this.destinations = results;
          this.loadingService.hide('search');
          this.notificationService.info(`Se encontraron ${results.length} destinos`);
        },
        error: () => {
          this.loadingService.hide('search');
        }
      })
    );
  }

  createBooking(): void {
    if (!this.bookingData.destination || !this.bookingData.date) {
      this.notificationService.warning('Por favor completa todos los campos');
      return;
    }

    this.isCreatingBooking = true;

    this.subscriptions.push(
      this.destinationService.createBooking(this.bookingData.destination, this.bookingData)
        .subscribe({
          next: (booking) => {
            console.log('Reserva creada:', booking);
            this.isCreatingBooking = false;
            this.bookingData = { destination: '', date: '', guests: 1 };
          },
          error: (error) => {
            console.error('Error:', error);
            this.isCreatingBooking = false;
          }
        })
    );
  }

  // ==========================================
  // DEMOSTRACIÓN DE LÓGICA DE NEGOCIO
  // ==========================================

  selectDestination(destination: Destination): void {
    this.selectedDestination = destination;
    this.stateService.setSelectedDestination(destination);
    this.communicationService.sendMessage('destination-selected', destination);
    this.notificationService.info(`Destino seleccionado: ${destination.name}`);
  }

  sortDestinations(sortBy: 'name' | 'price' | 'rating'): void {
    this.destinations = this.destinationService.sortDestinations(
      this.destinations,
      sortBy,
      'asc'
    );
    this.notificationService.info(`Destinos ordenados por ${sortBy}`);
  }
}

