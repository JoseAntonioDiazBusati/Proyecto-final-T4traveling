import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * ModalComponent - Modal accesible con focus trap
 *
 * Características implementadas:
 * - Cierre con ESC (@HostListener document:keydown.escape)
 * - Cierre al click en backdrop
 * - Focus trap (Tab navigation dentro del modal)
 * - Gestión de foco (guarda y restaura)
 * - Bloqueo de scroll del body
 * - Uso de Renderer2 para manipulación DOM segura
 * - ARIA roles completos (role="dialog", aria-modal, aria-labelledby)
 */
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() closeOnBackdrop = true;
  @Input() closeOnEscape = true;
  @Input() showCloseButton = true;

  @Output() closeModal = new EventEmitter<void>();
  @Output() opened = new EventEmitter<void>();
  @Output() closed = new EventEmitter<void>();

  @ViewChild('modalContent', { read: ElementRef }) modalContent?: ElementRef<HTMLElement>;
  @ViewChild('firstFocusable', { read: ElementRef }) firstFocusable?: ElementRef<HTMLElement>;

  private previousActiveElement: HTMLElement | null = null;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.handleModalOpen();
    }
  }

  ngOnDestroy(): void {
    // Restaurar el foco y scroll al cerrar el componente
    this.restoreFocus();
    this.renderer.setStyle(document.body, 'overflow', '');
  }

  /**
   * Maneja cambios en el estado de apertura del modal
   */
  ngOnChanges(): void {
    if (this.isOpen) {
      this.handleModalOpen();
    } else {
      this.handleModalClose();
    }
  }

  /**
   * Maneja la apertura del modal
   * Usa Renderer2 para manipular estilos del body
   */
  private handleModalOpen(): void {
    // Guardar el elemento activo antes de abrir el modal
    this.previousActiveElement = document.activeElement as HTMLElement;

    // Prevenir scroll del body usando Renderer2
    this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.addClass(document.body, 'modal-open');

    // Enfocar el primer elemento focusable después de un pequeño delay
    setTimeout(() => {
      this.focusFirstElement();
    }, 100);

    this.opened.emit();
  }

  /**
   * Maneja el cierre del modal
   * Usa Renderer2 para restaurar estilos del body
   */
  private handleModalClose(): void {
    // Restaurar scroll del body usando Renderer2
    this.renderer.setStyle(document.body, 'overflow', '');
    this.renderer.removeClass(document.body, 'modal-open');

    // Restaurar foco
    this.restoreFocus();

    this.closed.emit();
  }

  /**
   * Enfoca el primer elemento focusable del modal
   */
  private focusFirstElement(): void {
    if (this.firstFocusable?.nativeElement) {
      this.firstFocusable.nativeElement.focus();
    } else if (this.modalContent?.nativeElement) {
      const focusableElements = this.modalContent.nativeElement.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        (focusableElements[0] as HTMLElement).focus();
      }
    }
  }

  /**
   * Restaura el foco al elemento anterior
   */
  private restoreFocus(): void {
    if (this.previousActiveElement && typeof this.previousActiveElement.focus === 'function') {
      this.previousActiveElement.focus();
    }
  }

  /**
   * Cierra el modal
   */
  close(): void {
    this.closeModal.emit();
  }

  /**
   * Maneja el click en el backdrop
   */
  onBackdropClick(event: MouseEvent): void {
    if (this.closeOnBackdrop && event.target === event.currentTarget) {
      this.close();
    }
  }

  /**
   * Maneja eventos de teclado (ESC para cerrar)
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isOpen && this.closeOnEscape) {
      event.preventDefault();
      this.close();
    }
  }

  /**
   * Maneja la navegación con Tab para mantener el foco dentro del modal
   */
  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: Event): void {
    if (!this.isOpen || !this.modalContent) return;

    const keyboardEvent = event as KeyboardEvent;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (keyboardEvent.shiftKey) {
      // Tab + Shift (hacia atrás)
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      // Tab (hacia adelante)
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  }

  /**
   * Previene la propagación de clicks dentro del modal
   */
  onModalContentClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}

