import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente de imagen responsive optimizado
 * Soporta srcset, sizes y loading lazy para mejores performance
 */
@Component({
  selector: 'app-responsive-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './responsive-image.component.html',
  styleUrl: './responsive-image.component.scss'
})
export class ResponsiveImageComponent {
  @Input() src!: string; // Imagen por defecto
  @Input() alt!: string; // Texto alternativo (obligatorio para accesibilidad)
  @Input() srcset?: string; // Conjunto de imágenes para diferentes resoluciones
  @Input() sizes?: string; // Tamaños según viewport
  @Input() loading: 'lazy' | 'eager' = 'lazy'; // Carga diferida por defecto
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() class?: string; // Clases CSS adicionales

  /**
   * Genera el conjunto de srcset automáticamente si se proporciona solo src
   * Asume que existen versiones small, medium, large de la imagen
   */
  getSrcset(): string {
    if (this.srcset) {
      return this.srcset;
    }

    // Si src termina en .jpg, .jpeg, .webp, .png, generamos srcset
    const extensionMatch = this.src.match(/\.(jpg|jpeg|webp|png|avif)$/i);
    if (extensionMatch) {
      const base = this.src.replace(/\.(jpg|jpeg|webp|png|avif)$/i, '');
      const ext = extensionMatch[1];
      return `
        ${base}-small.${ext} 400w,
        ${base}-medium.${ext} 800w,
        ${base}-large.${ext} 1200w
      `.trim();
    }

    return '';
  }

  /**
   * Genera sizes automáticamente si no se proporciona
   */
  getSizes(): string {
    if (this.sizes) {
      return this.sizes;
    }

    // Valores por defecto responsive
    return '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';
  }
}
