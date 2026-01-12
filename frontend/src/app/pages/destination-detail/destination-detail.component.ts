import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Destination, DestinationService } from '../../services/destination.service';

@Component({
  selector: 'app-destination-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="detail" *ngIf="destination">
      <header class="hero">
        <span class="category">{{ destination.category }}</span>
        <h1>{{ destination.name }}</h1>
        <p>{{ destination.country }}</p>
      </header>
      <div class="content">
        <div class="main">
          <section>
            <h2>Descripcion</h2>
            <p>{{ destination.description }}</p>
          </section>
          <section>
            <h2>Que incluye</h2>
            <ul>
              <li>Vuelo ida y vuelta</li>
              <li>Alojamiento 4 estrellas</li>
              <li>Desayuno incluido</li>
              <li>Traslados</li>
            </ul>
          </section>
        </div>
        <aside class="sidebar">
          <div class="booking-card">
            <div class="price">
              <span>Desde</span>
              <strong>{{ destination.price | currency:'EUR' }}</strong>
            </div>
            <div class="rating">{{ destination.rating }} / 5</div>
            <button (click)="navigateToBooking()" class="btn btn--primary">Reservar</button>
          </div>
        </aside>
      </div>
      <a routerLink="/destinos" class="back">Volver a destinos</a>
    </div>
  `,
  styles: [`
    .detail { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .hero { text-align: center; padding: 3rem; background: var(--color-primary); color: white; border-radius: 1rem; margin-bottom: 2rem; }
    .hero .category { display: inline-block; padding: 0.25rem 0.75rem; background: rgba(255,255,255,0.2); border-radius: 2rem; font-size: 0.75rem; margin-bottom: 1rem; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 0.5rem; }
    .content { display: grid; grid-template-columns: 1fr 350px; gap: 2rem; }
    @media (max-width: 900px) { .content { grid-template-columns: 1fr; } }
    .main section { margin-bottom: 2rem; }
    .main h2 { color: var(--text-primary); margin-bottom: 1rem; }
    .main p, .main li { color: var(--text-secondary); line-height: 1.6; }
    .main ul { padding-left: 1.5rem; }
    .main li { margin-bottom: 0.5rem; }
    .booking-card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 1rem; padding: 1.5rem; position: sticky; top: 2rem; }
    .price { text-align: center; margin-bottom: 1rem; }
    .price span { display: block; color: var(--text-secondary); font-size: 0.875rem; }
    .price strong { font-size: 2rem; color: var(--text-primary); }
    .rating { text-align: center; padding: 0.75rem; background: var(--bg-body); border-radius: 0.5rem; margin-bottom: 1rem; color: var(--text-primary); }
    .btn { display: block; width: 100%; padding: 0.875rem; border: none; border-radius: 0.5rem; font-weight: 500; cursor: pointer; text-align: center; }
    .btn--primary { background: var(--color-primary); color: white; }
    .back { display: inline-block; margin-top: 2rem; color: var(--color-primary); text-decoration: none; }
    .back:hover { text-decoration: underline; }
  `]
})
export class DestinationDetailComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  destination: Destination | null = this.route.snapshot.data['destination'];

  navigateToBooking(): void {
    if (!this.destination) return;
    this.router.navigate(['/reservar'], {
      queryParams: { destinationId: this.destination.id },
      state: { destination: this.destination }
    });
  }
}

