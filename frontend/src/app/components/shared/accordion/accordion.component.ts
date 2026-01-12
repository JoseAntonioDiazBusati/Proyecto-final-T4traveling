import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  QueryList,
  ViewChildren
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz que define la estructura de un item del acordeón
 */
export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
  disabled?: boolean;
}

/**
 * AccordionComponent - Componente de acordeón accesible
 *
 * Características implementadas:
 * - Navegación completa por teclado (Arrow keys, Home, End, Enter, Space)
 * - ARIA roles y atributos para accesibilidad
 * - Animaciones CSS suaves
 * - Modo single o multiple
 * - Uso de Renderer2 para manipulación DOM segura
 * - Creación/eliminación dinámica de elementos con Renderer2
 */
@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent implements AfterViewInit, OnDestroy {
  @Input() items: AccordionItem[] = [];
  @Input() allowMultiple = false;
  @Input() expandFirst = false;

  @Output() itemToggled = new EventEmitter<{ item: AccordionItem; isOpen: boolean }>();

  @ViewChild('accordionContainer', { read: ElementRef }) accordionContainer?: ElementRef<HTMLElement>;
  @ViewChildren('accordionButton') accordionButtons!: QueryList<ElementRef<HTMLButtonElement>>;

  // Elementos creados dinámicamente con Renderer2 para indicadores visuales
  private dynamicIndicators: HTMLElement[] = [];
  private resizeListener?: () => void;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Expandir el primer item si se especifica
    if (this.expandFirst && this.items.length > 0 && !this.items[0].disabled) {
      this.items[0].isOpen = true;
    }
  }

  /**
   * Después de que la vista esté inicializada, configuramos
   * elementos adicionales y listeners usando Renderer2
   */
  ngAfterViewInit(): void {
    // Usar Renderer2 para añadir clase al contenedor principal
    this.renderer.addClass(this.elementRef.nativeElement, 'accordion-initialized');

    // Crear indicador visual dinámico usando Renderer2 (createElement, appendChild)
    this.createActiveIndicator();

    // Configurar listener de resize usando Renderer2.listen
    this.resizeListener = this.renderer.listen('window', 'resize', () => {
      this.updateActiveIndicator();
    });
  }

  /**
   * Limpieza de elementos dinámicos y listeners al destruir el componente
   * Importante para evitar memory leaks
   */
  ngOnDestroy(): void {
    // Eliminar elementos dinámicos creados con Renderer2
    this.dynamicIndicators.forEach(indicator => {
      if (indicator.parentNode) {
        this.renderer.removeChild(indicator.parentNode, indicator);
      }
    });
    this.dynamicIndicators = [];

    // Eliminar listener de resize
    if (this.resizeListener) {
      this.resizeListener();
    }
  }

  /**
   * Crea un indicador visual dinámico usando Renderer2
   * Demuestra: renderer.createElement, renderer.appendChild, renderer.setStyle
   */
  private createActiveIndicator(): void {
    const indicator = this.renderer.createElement('div');

    // Usar Renderer2 para establecer atributos y estilos
    this.renderer.addClass(indicator, 'accordion__active-indicator');
    this.renderer.setAttribute(indicator, 'aria-hidden', 'true');
    this.renderer.setStyle(indicator, 'position', 'absolute');
    this.renderer.setStyle(indicator, 'left', '0');
    this.renderer.setStyle(indicator, 'width', '3px');
    this.renderer.setStyle(indicator, 'background-color', 'var(--color-primary, #4f46e5)');
    this.renderer.setStyle(indicator, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(indicator, 'opacity', '0');
    this.renderer.setStyle(indicator, 'border-radius', '0 2px 2px 0');

    // Añadir al DOM usando Renderer2
    this.renderer.appendChild(this.elementRef.nativeElement, indicator);
    this.dynamicIndicators.push(indicator);

    // Actualizar posición inicial
    setTimeout(() => this.updateActiveIndicator(), 100);
  }

  /**
   * Actualiza la posición del indicador activo
   */
  private updateActiveIndicator(): void {
    const indicator = this.dynamicIndicators[0];
    if (!indicator) return;

    const openItem = this.items.findIndex(item => item.isOpen);

    if (openItem === -1) {
      this.renderer.setStyle(indicator, 'opacity', '0');
      return;
    }

    const buttons = this.elementRef.nativeElement.querySelectorAll('.accordion__header');
    const activeButton = buttons[openItem] as HTMLElement;

    if (activeButton) {
      const rect = activeButton.getBoundingClientRect();
      const containerRect = this.elementRef.nativeElement.getBoundingClientRect();

      this.renderer.setStyle(indicator, 'top', `${activeButton.offsetTop}px`);
      this.renderer.setStyle(indicator, 'height', `${rect.height}px`);
      this.renderer.setStyle(indicator, 'opacity', '1');
    }
  }

  /**
   * Alterna el estado de un item del acordeón
   * Usa preventDefault() para evitar comportamiento por defecto
   * Usa Renderer2 para manipulación de estilos
   */
  toggleItem(item: AccordionItem, event: Event): void {
    // preventDefault evita el comportamiento por defecto del botón
    event.preventDefault();
    // stopPropagation evita que el evento burbujee hacia arriba
    event.stopPropagation();

    if (item.disabled) return;

    const wasOpen = item.isOpen;

    // Si no permite múltiples abiertos, cerrar todos los demás
    if (!this.allowMultiple) {
      this.items.forEach(i => {
        if (i.id !== item.id) {
          i.isOpen = false;
        }
      });
    }

    // Alternar el item actual
    item.isOpen = !wasOpen;

    // Actualizar indicador visual dinámico
    this.updateActiveIndicator();

    this.itemToggled.emit({ item, isOpen: item.isOpen });
  }

  /**
   * Maneja eventos de teclado para accesibilidad
   */
  onKeyDown(event: KeyboardEvent, item: AccordionItem, index: number): void {
    if (item.disabled) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        this.toggleItem(item, event);
        break;

      case 'ArrowDown':
        event.preventDefault();
        this.focusNextItem(index);
        break;

      case 'ArrowUp':
        event.preventDefault();
        this.focusPreviousItem(index);
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstItem();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastItem();
        break;
    }
  }

  /**
   * Enfoca el siguiente item no deshabilitado
   */
  private focusNextItem(currentIndex: number): void {
    const nextIndex = this.findNextEnabledIndex(currentIndex);
    if (nextIndex !== -1) {
      this.focusItemButton(nextIndex);
    }
  }

  /**
   * Enfoca el item anterior no deshabilitado
   */
  private focusPreviousItem(currentIndex: number): void {
    const previousIndex = this.findPreviousEnabledIndex(currentIndex);
    if (previousIndex !== -1) {
      this.focusItemButton(previousIndex);
    }
  }

  /**
   * Enfoca el primer item no deshabilitado
   */
  private focusFirstItem(): void {
    const firstIndex = this.findNextEnabledIndex(-1);
    if (firstIndex !== -1) {
      this.focusItemButton(firstIndex);
    }
  }

  /**
   * Enfoca el último item no deshabilitado
   */
  private focusLastItem(): void {
    const lastIndex = this.findPreviousEnabledIndex(this.items.length);
    if (lastIndex !== -1) {
      this.focusItemButton(lastIndex);
    }
  }

  /**
   * Encuentra el siguiente índice habilitado
   */
  private findNextEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex + 1; i < this.items.length; i++) {
      if (!this.items[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Encuentra el índice anterior habilitado
   */
  private findPreviousEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.items[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  /**
   * Enfoca el botón de un item específico
   */
  private focusItemButton(index: number): void {
    const button = document.getElementById(`accordion-button-${this.items[index].id}`);
    button?.focus();
  }

  /**
   * Genera un ID único para el contenido
   */
  getContentId(item: AccordionItem): string {
    return `accordion-content-${item.id}`;
  }

  /**
   * Genera un ID único para el botón
   */
  getButtonId(item: AccordionItem): string {
    return `accordion-button-${item.id}`;
  }
}

