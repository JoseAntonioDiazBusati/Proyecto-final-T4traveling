import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Destination } from '../../services/destination.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="home">
      <section class="hero">
        <div class="hero__content">
          <h1>Descubre el mundo con T4 Traveling</h1>
          <p>Explora destinos unicos y vive experiencias inolvidables</p>
          <div class="hero__actions">
            <a routerLink="/destinos" class="btn btn--primary">Explorar destinos</a>
          </div>
        </div>
      </section>
      <section class="featured">
        <h2>Destinos destacados</h2>
        <div class="featured__grid">
          <article *ngFor="let d of featuredDestinations" class="card">
            <h3>{{ d.name }}</h3>
            <p>{{ d.country }}</p>
            <a [routerLink]="['/destinos', d.id]" class="btn btn--sm">Ver</a>
          </article>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .home { padding: 2rem; }
    .hero { text-align: center; padding: 4rem 2rem; background: var(--color-primary); color: white; border-radius: 1rem; margin-bottom: 2rem; }
    .hero h1 { font-size: 2.5rem; margin-bottom: 1rem; }
    .featured h2 { margin-bottom: 1.5rem; color: var(--text-primary); }
    .featured__grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; }
    .card { background: var(--bg-surface); padding: 1.5rem; border-radius: 0.5rem; border: 1px solid var(--border-color); }
    .card h3 { color: var(--text-primary); margin-bottom: 0.5rem; }
    .card p { color: var(--text-secondary); margin-bottom: 1rem; }
    .btn { display: inline-block; padding: 0.75rem 1.5rem; border-radius: 0.5rem; text-decoration: none; font-weight: 500; }
    .btn--primary { background: white; color: var(--color-primary); }
    .btn--sm { padding: 0.5rem 1rem; background: var(--color-primary); color: white; }
  `]
})
export class HomeComponent {
  private route = inject(ActivatedRoute);
  featuredDestinations: Destination[] = this.route.snapshot.data['featuredDestinations'] || [];
}

