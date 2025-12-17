import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'app-accordion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './accordion.component.html',
  styleUrl: './accordion.component.scss'
})
export class AccordionComponent {
  @Input() items: AccordionItem[] = [];
  @Input() allowMultiple = false;
  @Input() expandFirst = false;

  @Output() itemToggled = new EventEmitter<{ item: AccordionItem; isOpen: boolean }>();

  ngOnInit(): void {
    // Expandir el primer item si se especifica
    if (this.expandFirst && this.items.length > 0 && !this.items[0].disabled) {
      this.items[0].isOpen = true;
    }
  }

  /**
   * Alterna el estado de un item del acordeón
   */
  toggleItem(item: AccordionItem, event: Event): void {
    event.preventDefault();

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

