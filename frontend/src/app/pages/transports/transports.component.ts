import { Component, OnInit, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TransportService, Transport } from '../../services/transport.service';

@Component({
  selector: 'app-transports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transports.component.html',
  styleUrls: ['./transports.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransportsComponent implements OnInit {
  private transportService = inject(TransportService);

  transportTypes = [
    {
      type: 'automovil' as const,
      icon: '🚗',
      name: 'Automóvil',
      plural: 'Automóviles',
      description: 'Alquila un coche y explora a tu ritmo'
    },
    {
      type: 'autobus' as const,
      icon: '🚌',
      name: 'Autobús',
      plural: 'Autobuses',
      description: 'Viaja cómodamente y de forma económica'
    },
    {
      type: 'avion' as const,
      icon: '✈️',
      name: 'Avión',
      plural: 'Aviones',
      description: 'Llega rápido a tu destino'
    }
  ];

  // Signals para estado reactivo
  private allTransportsSignal = signal<Transport[]>([]);
  private selectedTransportTypeSignal = signal<'automovil' | 'autobus' | 'avion' | ''>('');
  private currentPageSignal = signal<number>(1);
  private itemsPerPageSignal = signal<number>(6);

  // Computed signals
  allTransports = computed(() => this.allTransportsSignal());
  selectedTransportType = computed(() => this.selectedTransportTypeSignal());

  filteredTransports = computed(() => {
    const type = this.selectedTransportTypeSignal();
    const all = this.allTransportsSignal();

    if (!type) {
      return all;
    }

    return all.filter(transport => transport.type === type);
  });

  paginatedTransports = computed(() => {
    const filtered = this.filteredTransports();
    const page = this.currentPageSignal();
    const perPage = this.itemsPerPageSignal();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filtered.slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredTransports().length / this.itemsPerPageSignal())
  );

  hasResults = computed(() => this.filteredTransports().length > 0);

  ngOnInit(): void {
    this.loadTransports();
  }

  loadTransports(): void {
    this.transportService.getTransports().pipe(
      takeUntilDestroyed()
    ).subscribe({
      next: (transports) => {
        this.allTransportsSignal.set(transports);
      },
      error: (error) => {
        console.error('Error al cargar transportes:', error);
      }
    });
  }

  searchTransport(type: 'automovil' | 'autobus' | 'avion'): void {
    this.selectedTransportTypeSignal.set(type);
    this.currentPageSignal.set(1); // Reset a primera página
  }

  getResultsTitle(): string {
    const type = this.selectedTransportTypeSignal();
    if (type) {
      const typePlural = this.transportTypes.find(t => t.type === type)?.plural || '';
      return `${typePlural} disponibles`;
    }
    return 'Todos los transportes';
  }

  clearFilters(): void {
    this.selectedTransportTypeSignal.set('');
    this.currentPageSignal.set(1);
  }

  // Paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
      document.querySelector('.transports-grid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPageSignal() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPageSignal() - 1);
  }

  // TrackBy function
  trackByTransportId(index: number, transport: Transport): string {
    return transport.id;
  }
}
