import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Destination } from '../../services/destination.service';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destination-detail.component.html',
  styleUrls: ['./destination-detail.component.scss']
})
export class DestinationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  destination: Destination | null = this.route.snapshot.data['destination'];

  ngOnInit() {
    console.log('=== DESTINATION DETAIL DEBUG ===');
    console.log('Destination:', this.destination);
    console.log('Image path:', this.destination?.image);
    console.log('Full URL would be:', window.location.origin + '/' + this.destination?.image);
  }

  onImageError(event: Event) {
    console.error('❌ Error loading image:', this.destination?.image);
    console.error('Event:', event);
    const img = event.target as HTMLImageElement;
    console.error('Attempted URL:', img.src);
  }

  onImageLoad(event: Event) {
    console.log('✅ Image loaded successfully:', this.destination?.image);
  }

  navigateToBooking(): void {
    if (!this.destination) return;
    // Redirigir a la página de reservas con el destino preseleccionado
    this.router.navigate(['/reservas'], {
      queryParams: {
        destinationId: this.destination.id,
        view: 'create' // Indicar que debe mostrar el formulario de crear reserva
      },
      state: { destination: this.destination }
    });
  }
}

