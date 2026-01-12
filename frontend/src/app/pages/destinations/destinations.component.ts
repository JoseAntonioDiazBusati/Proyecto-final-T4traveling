import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Destination } from '../../services/destination.service';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="destinations">
      <header class="header">
        <h1>Nuestros destinos</h1>
        <p>Descubre lugares increibles en todo el mundo</p>
      </header>
      <div class="filters">
        <button *ngFor="let cat of categories" (click)="filterByCategory(cat)"
          [class.active]="selectedCategory === cat">{{ cat }}</button>
        <button (click)="filterByCategory('')" [class.active]="!selectedCategory">Todos</button>
      </div>
      <div class="grid">
        <article *ngFor="let d of filteredDestinations" class="card">
          <div class="card__header">
            <span class="category">{{ d.category }}</span>
            <span class="rating">{{ d.rating }}</span>
          </div>
          <h2>{{ d.name }}</h2>
          <p class="country">{{ d.country }}</p>
          <p class="desc">{{ d.description }}</p>
          <div class="card__footer">
            <span class="price">{{ d.price | currency:'EUR' }}</span>
            <a [routerLink]="['/destinos', d.id]" class="btn">Ver</a>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .destinations { padding: 2rem; max-width: 1200px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 2rem; }
    .header h1 { color: var(--text-primary); margin-bottom: 0.5rem; }
    .header p { color: var(--text-secondary); }
    .filters { display: flex; gap: 0.5rem; justify-content: center; margin-bottom: 2rem; flex-wrap: wrap; }
    .filters button { padding: 0.5rem 1rem; border: 1px solid var(--border-color); border-radius: 2rem; background: var(--bg-surface); color: var(--text-secondary); cursor: pointer; }
    .filters button.active { background: var(--color-primary); border-color: var(--color-primary); color: white; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
    .card { background: var(--bg-surface); border: 1px solid var(--border-color); border-radius: 0.75rem; padding: 1.5rem; }
    .card__header { display: flex; justify-content: space-between; margin-bottom: 1rem; }
    .category { background: var(--color-primary); color: white; padding: 0.25rem 0.75rem; border-radius: 2rem; font-size: 0.75rem; }
    .rating { color: var(--text-primary); }
    .card h2 { color: var(--text-primary); font-size: 1.25rem; margin-bottom: 0.25rem; }
    .country { color: var(--color-primary); font-size: 0.875rem; margin-bottom: 0.5rem; }
    .desc { color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }
    .card__footer { display: flex; justify-content: space-between; align-items: center; }
    .price { color: var(--text-primary); font-weight: 600; }
    .btn { padding: 0.5rem 1rem; background: var(--color-primary); color: white; border-radius: 0.5rem; text-decoration: none; }
  `]
})
export class DestinationsComponent {
  private route = inject(ActivatedRoute);
  destinations: Destination[] = this.route.snapshot.data['destinations'] || [];
  filteredDestinations: Destination[] = [...this.destinations];
  categories: string[] = [...new Set(this.destinations.map(d => d.category))];
  selectedCategory = '';

  filterByCategory(cat: string): void {
    this.selectedCategory = cat;
    this.filteredDestinations = cat ? this.destinations.filter(d => d.category === cat) : [...this.destinations];
  }
}

