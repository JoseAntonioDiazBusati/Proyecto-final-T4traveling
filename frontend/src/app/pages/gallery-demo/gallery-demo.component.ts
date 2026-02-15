import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GalleryComponent, GalleryItem } from '../../components/shared/gallery/gallery.component';

/**
 * Página de demostración de la galería multimedia
 * Muestra destinos turísticos de forma accesible
 */
@Component({
  selector: 'app-gallery-demo',
  standalone: true,
  imports: [CommonModule, GalleryComponent],
  templateUrl: './gallery-demo.component.html',
  styleUrls: ['./gallery-demo.component.scss']
})
export class GalleryDemoComponent {
  galleryItems: GalleryItem[] = [
    {
      src: '/images/paris.jpeg',
      alt: 'Vista de la Torre Eiffel en París, Francia, con cielo azul al atardecer',
      caption: 'París - La ciudad de la luz y el romanticismo'
    },
    {
      src: '/images/barcelona.jpeg',
      alt: 'La Sagrada Familia de Gaudí en Barcelona, España, con su arquitectura modernista única',
      caption: 'Barcelona - Arquitectura y cultura mediterránea'
    },
    {
      src: '/images/roma.jpeg',
      alt: 'El Coliseo Romano en Roma, Italia, monumento histórico de la antigua Roma',
      caption: 'Roma - Historia y patrimonio de la civilización romana'
    },
    {
      src: '/images/londres.jpeg',
      alt: 'Big Ben y el Parlamento de Londres junto al río Támesis, Reino Unido',
      caption: 'Londres - Tradición británica y modernidad'
    },
    {
      src: '/images/kioto.jpeg',
      alt: 'Templo tradicional japonés rodeado de jardines zen en Kioto, Japón',
      caption: 'Kioto - Templos ancestrales y cultura japonesa'
    },
    {
      src: '/images/amsterdam.jpeg',
      alt: 'Canales históricos de Ámsterdam con casas tradicionales holandesas y puentes',
      caption: 'Ámsterdam - Canales pintorescos y arquitectura histórica'
    }
  ];
}
