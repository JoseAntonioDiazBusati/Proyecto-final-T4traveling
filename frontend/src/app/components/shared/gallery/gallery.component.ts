import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface para definir items de la galería
 */
export interface GalleryItem {
  src: string;
  alt: string;
  caption: string;
}

/**
 * Componente de galería de imágenes accesible
 * Implementa lazy loading y navegación por teclado
 */
@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
  @Input() items: GalleryItem[] = [];
  @Input() columns: number = 3;

  selectedIndex: number | null = null;

  /**
   * Abre el modal de imagen ampliada
   */
  openImage(index: number): void {
    this.selectedIndex = index;
    document.body.style.overflow = 'hidden';
  }

  /**
   * Cierra el modal de imagen ampliada
   */
  closeImage(): void {
    this.selectedIndex = null;
    document.body.style.overflow = '';
  }

  /**
   * Navega a la imagen anterior
   */
  previousImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedIndex !== null && this.selectedIndex > 0) {
      this.selectedIndex--;
    }
  }

  /**
   * Navega a la imagen siguiente
   */
  nextImage(event?: Event): void {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedIndex !== null && this.selectedIndex < this.items.length - 1) {
      this.selectedIndex++;
    }
  }

  /**
   * Maneja la navegación por teclado
   */
  onKeyDown(event: KeyboardEvent): void {
    if (this.selectedIndex === null) return;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        this.previousImage();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextImage();
        break;
      case 'Escape':
        event.preventDefault();
        this.closeImage();
        break;
    }
  }

  /**
   * Obtiene el item seleccionado actualmente
   */
  get selectedItem(): GalleryItem | null {
    return this.selectedIndex !== null ? this.items[this.selectedIndex] : null;
  }

  /**
   * TrackBy function para optimizar ngFor
   */
  trackByIndex(index: number): number {
    return index;
  }
}
