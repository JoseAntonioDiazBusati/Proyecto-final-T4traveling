import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TransportsComponent } from './transports.component';
import { of, throwError } from 'rxjs';
import { TransportService } from '../../services/transport.service';

describe('TransportsComponent', () => {
  let component: TransportsComponent;
  let fixture: ComponentFixture<TransportsComponent>;
  let mockTransportService: any;

  const mockTransports = [
    {
      id: '1',
      name: 'Avión Premium',
      type: 'avion' as const,
      company: 'Air France',
      price: 300,
      icon: '✈️',
      capacity: 200,
      description: 'Vuelo premium con todas las comodidades',
      continent: 'Europa'
    },
    {
      id: '2',
      name: 'Autobús Turístico',
      type: 'autobus' as const,
      company: 'Eurolines',
      price: 50,
      icon: '🚌',
      capacity: 50,
      description: 'Viaje cómodo y económico',
      continent: 'Europa'
    },
    {
      id: '3',
      name: 'Coche de Alquiler',
      type: 'automovil' as const,
      company: 'Hertz',
      price: 80,
      icon: '🚗',
      capacity: 5,
      description: 'Libertad para explorar',
      continent: 'Europa'
    }
  ];

  beforeEach(async () => {
    mockTransportService = {
      getTransports: vi.fn(() => of(mockTransports))
    };

    await TestBed.configureTestingModule({
      imports: [TransportsComponent],
      providers: [
        { provide: TransportService, useValue: mockTransportService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TransportsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should load transports on init', () => {
      component.ngOnInit();
      expect(mockTransportService.getTransports).toHaveBeenCalled();
    });

    it('should set all transports', () => {
      component.ngOnInit();
      expect(component.allTransports().length).toBe(3);
    });

    it('should show all transports initially', () => {
      component.ngOnInit();
      expect(component.filteredTransports().length).toBe(3);
    });

    it('should have transport types configured', () => {
      expect(component.transportTypes.length).toBe(3);
      expect(component.transportTypes.map(t => t.type)).toEqual(['automovil', 'autobus', 'avion']);
    });
  });

  describe('Filtering', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should filter by automovil', () => {
      component.searchTransport('automovil');
      const filtered = component.filteredTransports();
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('automovil');
    });

    it('should filter by autobus', () => {
      component.searchTransport('autobus');
      const filtered = component.filteredTransports();
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('autobus');
    });

    it('should filter by avion', () => {
      component.searchTransport('avion');
      const filtered = component.filteredTransports();
      expect(filtered.length).toBe(1);
      expect(filtered[0].type).toBe('avion');
    });

    it('should update selected transport type', () => {
      component.searchTransport('avion');
      expect(component.selectedTransportType()).toBe('avion');
    });

    it('should reset page to 1 when filtering', () => {
      component['currentPageSignal'].set(3);
      component.searchTransport('avion');
      expect(component['currentPageSignal']()).toBe(1);
    });
  });

  describe('Clear Filters', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should clear selected type', () => {
      component.searchTransport('avion');
      component.clearFilters();
      expect(component.selectedTransportType()).toBe('');
    });

    it('should show all transports', () => {
      component.searchTransport('avion');
      component.clearFilters();
      expect(component.filteredTransports().length).toBe(3);
    });

    it('should reset page to 1', () => {
      component['currentPageSignal'].set(3);
      component.clearFilters();
      expect(component['currentPageSignal']()).toBe(1);
    });
  });

  describe('Results Title', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should show "Todos los transportes" when no filter', () => {
      expect(component.getResultsTitle()).toBe('Todos los transportes');
    });

    it('should show specific type when filtered', () => {
      component.searchTransport('automovil');
      expect(component.getResultsTitle()).toBe('Automóvils disponibles');
    });

    it('should show autobus title', () => {
      component.searchTransport('autobus');
      expect(component.getResultsTitle()).toBe('Autobúss disponibles');
    });

    it('should show avion title', () => {
      component.searchTransport('avion');
      expect(component.getResultsTitle()).toBe('Avións disponibles');
    });
  });

  describe('Pagination', () => {
    beforeEach(() => {
      component.ngOnInit();
      fixture.detectChanges();
    });

    it('should calculate total pages correctly', () => {
      // 3 items with 6 per page = 1 page
      expect(component.totalPages()).toBe(1);
    });

    it('should paginate results when many items', () => {
      // Agregar más transportes para probar paginación
      const manyTransports = Array.from({ length: 15 }, (_, i) => ({
        id: `${i + 1}`,
        name: `Transport ${i + 1}`,
        type: 'avion' as const,
        company: 'Test',
        price: 100,
        icon: '✈️',
        capacity: 100,
        description: 'Test'
      }));

      mockTransportService.getTransports = vi.fn(() => of(manyTransports));
      component.loadTransports();

      expect(component.totalPages()).toBe(3); // 15 items / 6 per page
      expect(component.paginatedTransports().length).toBe(6);
    });

    it('should go to next page', () => {
      component['currentPageSignal'].set(1);
      component.nextPage();
      expect(component['currentPageSignal']()).toBe(2);
    });

    it('should go to previous page', () => {
      component['currentPageSignal'].set(2);
      component.prevPage();
      expect(component['currentPageSignal']()).toBe(1);
    });

    it('should not go below page 1', () => {
      component['currentPageSignal'].set(1);
      component.prevPage();
      expect(component['currentPageSignal']()).toBe(1);
    });

    it('should not exceed total pages', () => {
      const totalPages = component.totalPages();
      component.goToPage(totalPages + 5);
      expect(component['currentPageSignal']()).toBeLessThanOrEqual(totalPages);
    });
  });

  describe('TrackBy Function', () => {
    it('should return transport id', () => {
      const trackId = component.trackByTransportId(0, mockTransports[0]);
      expect(trackId).toBe('1');
    });

    it('should return different ids for different transports', () => {
      const id1 = component.trackByTransportId(0, mockTransports[0]);
      const id2 = component.trackByTransportId(1, mockTransports[1]);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Error Handling', () => {
    it('should handle error when loading transports', () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockTransportService.getTransports = vi.fn(() => throwError(() => new Error('Load error')));

      component.loadTransports();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('Computed Signals', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should have allTransports computed signal', () => {
      expect(component.allTransports()).toEqual(mockTransports);
    });

    it('should have filteredTransports computed signal', () => {
      expect(component.filteredTransports()).toEqual(mockTransports);
    });

    it('should have hasResults computed signal', () => {
      expect(component.hasResults()).toBe(true);
    });

    it('should show no results when filtered with no matches', () => {
      component['allTransportsSignal'].set([]);
      expect(component.hasResults()).toBe(false);
    });
  });

  describe('Transport Types Configuration', () => {
    it('should have correct icons', () => {
      const types = component.transportTypes;
      expect(types[0].icon).toBe('🚗');
      expect(types[1].icon).toBe('🚌');
      expect(types[2].icon).toBe('✈️');
    });

    it('should have correct names', () => {
      const types = component.transportTypes;
      expect(types[0].name).toBe('Automóvil');
      expect(types[1].name).toBe('Autobús');
      expect(types[2].name).toBe('Avión');
    });

    it('should have descriptions', () => {
      const types = component.transportTypes;
      expect(types[0].description).toBeTruthy();
      expect(types[1].description).toBeTruthy();
      expect(types[2].description).toBeTruthy();
    });
  });
});
