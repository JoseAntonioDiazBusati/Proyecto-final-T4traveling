import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { DestinationsComponent } from './destinations.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('DestinationsComponent', () => {
  let component: DestinationsComponent;
  let fixture: ComponentFixture<DestinationsComponent>;

  const mockDestinations = [
    {
      id: '1',
      name: 'París',
      country: 'Francia',
      description: 'La ciudad del amor',
      price: 1200,
      image: '/images/paris.jpeg',
      rating: 4.8,
      category: 'Europa'
    },
    {
      id: '2',
      name: 'Barcelona',
      country: 'España',
      description: 'Arte y arquitectura',
      price: 900,
      image: '/images/barcelona.jpeg',
      rating: 4.6,
      category: 'Europa'
    },
    {
      id: '3',
      name: 'Kioto',
      country: 'Japón',
      description: 'Templos antiguos',
      price: 1800,
      image: '/images/kioto.jpeg',
      rating: 4.9,
      category: 'Asia'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinationsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                destinations: mockDestinations
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DestinationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load destinations from route data', () => {
      expect(component.destinations().length).toBe(3);
    });

    it('should extract categories from destinations', () => {
      const categories = component.categories();
      expect(categories).toContain('Europa');
      expect(categories).toContain('Asia');
    });

    it('should initially show all destinations', () => {
      expect(component.filteredDestinations().length).toBe(3);
    });
  });

  describe('Category Filtering', () => {
    it('should filter destinations by category', () => {
      component.filterByCategory('Europa');
      fixture.detectChanges();

      const filtered = component.filteredDestinations();
      expect(filtered.length).toBe(2);
      expect(filtered.every(d => d.category === 'Europa')).toBe(true);
    });

    it('should show all destinations when category is cleared', () => {
      component.filterByCategory('Europa');
      component.filterByCategory('');
      fixture.detectChanges();

      expect(component.filteredDestinations().length).toBe(3);
    });

    it('should update selected category', () => {
      component.filterByCategory('Asia');
      expect(component.selectedCategory()).toBe('Asia');
    });
  });

  describe('Search Functionality', () => {
    it('should filter by destination name', () => {
      component.onSearchChange('parís');
      fixture.detectChanges();

      // Wait for debounce
      setTimeout(() => {
        const filtered = component.filteredDestinations();
        expect(filtered.length).toBe(1);
        expect(filtered[0].name).toBe('París');
      }, 350);
    });

    it('should filter by country', () => {
      component.onSearchChange('japón');
      fixture.detectChanges();

      setTimeout(() => {
        const filtered = component.filteredDestinations();
        expect(filtered.length).toBe(1);
        expect(filtered[0].country).toBe('Japón');
      }, 350);
    });

    it('should be case insensitive', () => {
      component.onSearchChange('PARÍS');
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.filteredDestinations().length).toBeGreaterThan(0);
      }, 350);
    });
  });

  describe('Pagination', () => {
    it('should calculate total pages correctly', () => {
      // With 3 items and 6 per page, should be 1 page
      expect(component.totalPages()).toBe(1);
    });

    it('should paginate results', () => {
      // Set items per page to 2
      component['itemsPerPageSignal'].set(2);
      fixture.detectChanges();

      const firstPage = component.paginatedDestinations();
      expect(firstPage.length).toBe(2);
    });

    it('should navigate to next page', () => {
      component['itemsPerPageSignal'].set(2);
      component.nextPage();
      fixture.detectChanges();

      expect(component.currentPage()).toBe(2);
    });

    it('should navigate to previous page', () => {
      component['itemsPerPageSignal'].set(2);
      component.goToPage(2);
      component.prevPage();
      fixture.detectChanges();

      expect(component.currentPage()).toBe(1);
    });

    it('should not go below page 1', () => {
      component.prevPage();
      expect(component.currentPage()).toBe(1);
    });

    it('should not exceed total pages', () => {
      const totalPages = component.totalPages();
      component.goToPage(totalPages + 5);
      expect(component.currentPage()).toBeLessThanOrEqual(totalPages);
    });
  });

  describe('Clear Filters', () => {
    it('should clear all filters', () => {
      component.filterByCategory('Europa');
      component.onSearchChange('test');
      component.clearFilters();
      fixture.detectChanges();

      expect(component.selectedCategory()).toBe('');
      expect(component.searchQuery()).toBe('');
      expect(component.currentPage()).toBe(1);
    });
  });

  describe('TrackBy Function', () => {
    it('should return destination id', () => {
      const destination = mockDestinations[0];
      const trackId = component.trackByDestinationId(0, destination);
      expect(trackId).toBe('1');
    });
  });

  describe('Results Display', () => {
    it('should show has results when destinations exist', () => {
      expect(component.hasResults()).toBe(true);
    });

    it('should show no results when filtered list is empty', () => {
      component.onSearchChange('nonexistent123xyz');
      fixture.detectChanges();

      setTimeout(() => {
        expect(component.hasResults()).toBe(false);
      }, 350);
    });
  });
});
