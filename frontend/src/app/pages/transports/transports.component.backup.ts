import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Transport {
  type: 'automovil' | 'autobus' | 'avion';
  icon: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="transports">
      <header class="header">
        <h1>Transportes</h1>
        <p>Encuentra el medio de transporte perfecto para tu viaje</p>
      </header>

      <div class="filters">
        <button *ngFor="let continent of continents"
                (click)="filterByContinent(continent)"
                [class.active]="selectedContinent === continent">
          {{ continent }}
        </button>
        <button (click)="filterByContinent('')"
                [class.active]="!selectedContinent">
          Todos
        </button>
      </div>

      <div class="transport-types">
        <article *ngFor="let transport of transports" class="transport-card">
          <div class="transport-card__icon">{{ transport.icon }}</div>
          <h2 class="transport-card__title">{{ transport.name }}</h2>
          <p class="transport-card__description">{{ transport.description }}</p>
          <button (click)="searchTransport(transport.type)" class="btn">
            Buscar {{ transport.name }}
          </button>
        </article>
      </div>

      <div *ngIf="selectedContinent && selectedTransport" class="results">
        <h3>Resultados para {{ selectedTransport }} en {{ selectedContinent }}</h3>
        <p class="results__message">Buscando opciones de transporte...</p>
      </div>
    </div>
  `,
  styles: [`
    .transports {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .header h1 {
      color: var(--text-primary);
      margin-bottom: 0.5rem;
      font-size: 2.5rem;
    }

    .header p {
      color: var(--text-secondary);
      font-size: 1.125rem;
    }

    .filters {
      display: flex;
      gap: 0.5rem;
      justify-content: center;
      margin-bottom: 3rem;
      flex-wrap: wrap;
    }

    .filters button {
      padding: 0.75rem 1.5rem;
      border: 2px solid var(--border-color);
      border-radius: 2rem;
      background: var(--bg-surface);
      color: var(--text-secondary);
      cursor: pointer;
      font-weight: 500;
      transition: all 0.3s ease;
    }

    .filters button:hover {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }

    .filters button.active {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: var(--text-inverse);
    }

    .transport-types {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .transport-card {
      background: var(--bg-surface);
      border: 2px solid var(--border-color);
      border-radius: 1rem;
      padding: 2rem;
      text-align: center;
      transition: all 0.3s ease;
    }

    .transport-card:hover {
      border-color: var(--color-primary);
      box-shadow: var(--shadow-md);
      transform: translateY(-4px);
    }

    .transport-card__icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .transport-card__title {
      color: var(--text-primary);
      font-size: 1.5rem;
      margin-bottom: 0.75rem;
      font-weight: 600;
    }

    .transport-card__description {
      color: var(--text-secondary);
      font-size: 1rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .btn {
      padding: 0.75rem 1.5rem;
      background: var(--color-primary);
      color: var(--text-inverse);
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      font-weight: 500;
      font-size: 1rem;
      transition: all 0.3s ease;
      width: 100%;
    }

    .btn:hover {
      background: var(--color-primary-dark);
      transform: scale(1.02);
    }

    .results {
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: 0.75rem;
      padding: 2rem;
      text-align: center;
    }

    .results h3 {
      color: var(--text-primary);
      margin-bottom: 1rem;
      font-size: 1.5rem;
    }

    .results__message {
      color: var(--text-secondary);
      font-size: 1.125rem;
    }
  `]
})
export class TransportsComponent {
  continents: string[] = [
    'Europa',
    'Asia',
    'América',
    'África',
    'Oceanía'
  ];

  transports: Transport[] = [
    {
      type: 'automovil',
      icon: '🚗',
      name: 'Automóvil',
      description: 'Alquila un coche y explora a tu ritmo'
    },
    {
      type: 'autobus',
      icon: '🚌',
      name: 'Autobús',
      description: 'Viaja cómodamente y de forma económica'
    },
    {
      type: 'avion',
      icon: '✈️',
      name: 'Avión',
      description: 'Llega rápido a tu destino'
    }
  ];

  selectedContinent = '';
  selectedTransport = '';

  filterByContinent(continent: string): void {
    this.selectedContinent = continent;
    // Si hay un transporte seleccionado, mantenerlo
    if (this.selectedTransport && continent) {
      console.log(`Filtrando ${this.selectedTransport} en ${continent}`);
    }
  }

  searchTransport(type: string): void {
    this.selectedTransport = type;

    if (this.selectedContinent) {
      console.log(`Buscando ${type} en ${this.selectedContinent}`);
    } else {
      console.log(`Por favor, selecciona un continente primero`);
      // Podrías mostrar una notificación aquí
    }
  }
}
