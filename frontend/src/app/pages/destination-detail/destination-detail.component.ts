import { Component, inject } from '@angular/core';
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
export class DestinationDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  destination: Destination | null = this.route.snapshot.data['destination'];

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

