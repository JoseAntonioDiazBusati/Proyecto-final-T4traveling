import { Component, Input, Output, EventEmitter, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

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

  ngAfterViewInit(): void {
    if (this.isOpen) {
      this.handleModalOpen();
    }
  }

  ngOnDestroy(): void {
    // Restaurar el foco al cerrar el componente
    this.restoreFocus();
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
   */
  private handleModalOpen(): void {
    // Guardar el elemento activo antes de abrir el modal
    this.previousActiveElement = document.activeElement as HTMLElement;

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';

    // Enfocar el primer elemento focusable después de un pequeño delay
    setTimeout(() => {
      this.focusFirstElement();
    }, 100);

    this.opened.emit();
  }

  /**
   * Maneja el cierre del modal
   */
  private handleModalClose(): void {
    // Restaurar scroll del body
    document.body.style.overflow = '';

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
  onEscapeKey(event: KeyboardEvent): void {
    if (this.isOpen && this.closeOnEscape) {
      event.preventDefault();
      this.close();
    }
  }

  /**
   * Maneja la navegación con Tab para mantener el foco dentro del modal
   */
  @HostListener('document:keydown.tab', ['$event'])
  onTabKey(event: KeyboardEvent): void {
    if (!this.isOpen || !this.modalContent) return;

    const focusableElements = this.modalContent.nativeElement.querySelectorAll(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
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

