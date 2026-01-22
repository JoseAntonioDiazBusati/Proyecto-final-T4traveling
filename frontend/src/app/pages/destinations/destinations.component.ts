import { Component, inject, signal, computed, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Destination } from '../../services/destination.service';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './destinations.component.html',
  styleUrls: ['./destinations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DestinationsComponent {
  private route = inject(ActivatedRoute);

  // Signals para estado reactivo
  private destinationsSignal = signal<Destination[]>(this.route.snapshot.data['destinations'] || []);
  private selectedCategorySignal = signal<string>('');
  private searchQuerySignal = signal<string>('');
  private currentPageSignal = signal<number>(1);
  private itemsPerPageSignal = signal<number>(6);

  // Computed signals para valores derivados
  destinations = computed(() => this.destinationsSignal());
  categories = computed(() => [...new Set(this.destinationsSignal().map(d => d.category))]);
  selectedCategory = computed(() => this.selectedCategorySignal());
  searchQuery = computed(() => this.searchQuerySignal());
  currentPage = computed(() => this.currentPageSignal());
  itemsPerPage = computed(() => this.itemsPerPageSignal());

  // Destinos filtrados y paginados
  filteredDestinations = computed(() => {
    let filtered = this.destinationsSignal();

    // Filtrar por categoría
    const category = this.selectedCategorySignal();
    if (category) {
      filtered = filtered.filter(d => d.category === category);
    }

    // Filtrar por búsqueda
    const query = this.searchQuerySignal().toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.country.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  });

  paginatedDestinations = computed(() => {
    const filtered = this.filteredDestinations();
    const page = this.currentPageSignal();
    const perPage = this.itemsPerPageSignal();
    const start = (page - 1) * perPage;
    const end = start + perPage;
    return filtered.slice(start, end);
  });

  totalPages = computed(() =>
    Math.ceil(this.filteredDestinations().length / this.itemsPerPageSignal())
  );

  hasResults = computed(() => this.filteredDestinations().length > 0);

  // Subject para búsqueda con debounce
  private searchSubject = new Subject<string>();

  constructor() {
    // Configurar búsqueda con debounce
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed()
    ).subscribe(query => {
      this.searchQuerySignal.set(query);
      this.currentPageSignal.set(1); // Reset a primera página al buscar
    });
  }

  filterByCategory(cat: string): void {
    this.selectedCategorySignal.set(cat);
    this.currentPageSignal.set(1); // Reset a primera página al filtrar
  }

  onSearchChange(query: string): void {
    this.searchSubject.next(query);
  }

  clearFilters(): void {
    this.selectedCategorySignal.set('');
    this.searchQuerySignal.set('');
    this.currentPageSignal.set(1);
  }

  // Paginación
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
      // Scroll suave al inicio de la lista
      document.querySelector('.destinations-grid')?.scrollIntoView({ behavior: 'smooth' });
    }
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  prevPage(): void {
    this.goToPage(this.currentPage() - 1);
  }

  // TrackBy function para optimizar ngFor
  trackByDestinationId(index: number, destination: Destination): string {
    return destination.id;
  }
}

