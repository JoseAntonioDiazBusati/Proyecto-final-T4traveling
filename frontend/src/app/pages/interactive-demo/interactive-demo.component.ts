import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/shared/modal/modal.component';
import { AccordionComponent, AccordionItem } from '../../components/shared/accordion/accordion.component';
import { TabsComponent, TabItem } from '../../components/shared/tabs/tabs.component';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { ThemeSwitcherComponent } from '../../components/shared/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-interactive-demo',
  standalone: true,
  imports: [
    CommonModule,
    ModalComponent,
    AccordionComponent,
    TabsComponent,
    TooltipDirective,
    ThemeSwitcherComponent
  ],
  templateUrl: './interactive-demo.component.html',
  styleUrl: './interactive-demo.component.scss'
})
export class InteractiveDemoComponent {
  // Estado del modal
  isModalOpen = false;

  // Datos del acordeón
  accordionItems: AccordionItem[] = [
    {
      id: 'faq-1',
      title: '¿Cómo puedo hacer una reserva?',
      content: 'Para hacer una reserva, simplemente navega a la sección de Destinos, selecciona tu destino favorito y haz clic en "Reservar ahora". Serás guiado a través del proceso de reserva paso a paso.'
    },
    {
      id: 'faq-2',
      title: '¿Cuáles son las opciones de pago?',
      content: 'Aceptamos todas las tarjetas de crédito principales (Visa, Mastercard, American Express), PayPal y transferencias bancarias. Todos los pagos son procesados de forma segura.'
    },
    {
      id: 'faq-3',
      title: '¿Puedo cancelar mi reserva?',
      content: 'Sí, puedes cancelar tu reserva hasta 48 horas antes de la fecha de viaje sin ningún cargo. Para cancelaciones posteriores, se aplicará una tarifa del 20%.'
    },
    {
      id: 'faq-4',
      title: '¿Ofrecen descuentos para grupos?',
      content: 'Sí, ofrecemos descuentos especiales para grupos de más de 10 personas. Contacta con nuestro equipo de ventas para obtener más información.',
      disabled: false
    }
  ];

  // Datos de las tabs
  tabItems: TabItem[] = [
    {
      id: 'destinos',
      label: 'Destinos Populares',
      icon: '🌍',
      content: 'Descubre los destinos más populares: París, Roma, Tokio, Nueva York y Barcelona. Cada destino ofrece experiencias únicas y memorables.'
    },
    {
      id: 'transportes',
      label: 'Transportes',
      icon: '✈️',
      content: 'Ofrecemos múltiples opciones de transporte: vuelos directos, trenes de alta velocidad, autobuses de lujo y alquiler de coches. Elige la opción que mejor se adapte a tus necesidades.'
    },
    {
      id: 'alojamientos',
      label: 'Alojamientos',
      icon: '🏨',
      badge: 'Nuevo',
      content: 'Encuentra el alojamiento perfecto: hoteles 5 estrellas, apartamentos vacacionales, hostales económicos y casas rurales. Todos verificados y con las mejores valoraciones.'
    },
    {
      id: 'actividades',
      label: 'Actividades',
      icon: '🎯',
      content: 'Reserva experiencias únicas: tours guiados, clases de cocina local, deportes de aventura, visitas a museos y mucho más. Personaliza tu viaje a tu gusto.'
    }
  ];

  /**
   * Abre el modal
   */
  openModal(): void {
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
  }

  /**
   * Maneja el cambio de tab
   */
  onTabChanged(tab: TabItem): void {
    console.log('Tab cambiada:', tab);
  }

  /**
   * Muestra una alerta
   */
  alert(message: string): void {
    window.alert(message);
  }

  /**
   * Cambia el estilo de un elemento en mouseenter
   */
  onMouseEnter(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'var(--color-primary)';
  }

  /**
   * Restaura el estilo de un elemento en mouseleave
   */
  onMouseLeave(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.backgroundColor = 'var(--bg-surface)';
  }

  /**
   * Cambia el borde en enter
   */
  onEnter(event: Event): void {
    event.preventDefault();
    const target = event.target as HTMLElement;
    target.style.borderColor = 'var(--color-success)';
  }

  /**
   * Restaura el borde en blur
   */
  onBlur(event: Event): void {
    const target = event.target as HTMLElement;
    target.style.borderColor = 'var(--border-color)';
  }

  /**
   * Previene la navegación
   */
  preventNavigation(event: Event): void {
    event.preventDefault();
    this.alert('Navegación prevenida!');
  }

  /**
   * Maneja el toggle de items del acordeón
   */
  onAccordionItemToggled(event: { item: AccordionItem; isOpen: boolean }): void {
    console.log('Acordeón toggled:', event);
  }
}

