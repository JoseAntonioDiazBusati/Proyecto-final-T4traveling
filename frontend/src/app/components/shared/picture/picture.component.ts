import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interface para definir fuentes de imagen en diferentes formatos
 */
export interface PictureSource {
  srcset: string;
  type?: string; // image/avif, image/webp, image/jpeg
  media?: string; // Media query para art direction
  sizes?: string;
}

/**
 * Componente Picture para art direction y formatos modernos
 * Permite servir diferentes imágenes según el viewport y formato soportado
 */
@Component({
  selector: 'app-picture',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './picture.component.html',
  styleUrl: './picture.component.scss'
})
export class PictureComponent {
  @Input() sources: PictureSource[] = []; // Fuentes alternativas
  @Input() src!: string; // Imagen fallback (obligatoria)
  @Input() alt!: string; // Texto alternativo (obligatorio)
  @Input() loading: 'lazy' | 'eager' = 'lazy';
  @Input() width?: string | number;
  @Input() height?: string | number;
  @Input() objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down' = 'cover';
  @Input() class?: string;
}
