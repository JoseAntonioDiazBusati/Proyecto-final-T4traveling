import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { DestinationService, Destination } from './destination.service';
import { LoadingService } from './loading.service';
import { NotificationService } from './notification.service';

describe('DestinationService', () => {
  let service: DestinationService;
  let loadingService: LoadingService;
  let notificationService: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        DestinationService,
        LoadingService,
        NotificationService
      ]
    });
    service = TestBed.inject(DestinationService);
    loadingService = TestBed.inject(LoadingService);
    notificationService = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getDestinations', () => {
    it('should return array of destinations', (done) => {
      service.getDestinations().subscribe({
        next: (destinations) => {
          expect(Array.isArray(destinations)).toBe(true);
          expect(destinations.length).toBeGreaterThan(0);
          done();
        }
      });
    });

    it('should return destinations with correct structure', (done) => {
      service.getDestinations().subscribe({
        next: (destinations) => {
          const destination = destinations[0];
          expect(destination).toHaveProperty('id');
          expect(destination).toHaveProperty('name');
          expect(destination).toHaveProperty('country');
          expect(destination).toHaveProperty('description');
          expect(destination).toHaveProperty('price');
          expect(destination).toHaveProperty('image');
          expect(destination).toHaveProperty('rating');
          expect(destination).toHaveProperty('category');
          done();
        }
      });
    });

    it('should return destinations with valid data types', (done) => {
      service.getDestinations().subscribe({
        next: (destinations) => {
          const destination = destinations[0];
          expect(typeof destination.id).toBe('string');
          expect(typeof destination.name).toBe('string');
          expect(typeof destination.country).toBe('string');
          expect(typeof destination.price).toBe('number');
          expect(typeof destination.rating).toBe('number');
          done();
        }
      });
    });
  });

  describe('getDestinationById', () => {
    it('should return destination when id exists', (done) => {
      service.getDestinationById('1').subscribe({
        next: (destination) => {
          expect(destination).toBeDefined();
          expect(destination?.id).toBe('1');
          done();
        }
      });
    });

    it('should return undefined when id does not exist', (done) => {
      service.getDestinationById('non-existent').subscribe({
        next: (destination) => {
          expect(destination).toBeUndefined();
          done();
        }
      });
    });
  });

  describe('searchDestinations', () => {
    it('should filter destinations by name', (done) => {
      service.searchDestinations('parís').subscribe({
        next: (destinations) => {
          expect(destinations.length).toBeGreaterThan(0);
          expect(destinations[0].name.toLowerCase()).toContain('parís');
          done();
        }
      });
    });

    it('should filter destinations by country', (done) => {
      service.searchDestinations('francia').subscribe({
        next: (destinations) => {
          expect(destinations.length).toBeGreaterThan(0);
          destinations.forEach(d => {
            expect(d.country.toLowerCase()).toContain('francia');
          });
          done();
        }
      });
    });

    it('should return empty array when no match', (done) => {
      service.searchDestinations('xyz123nonexistent').subscribe({
        next: (destinations) => {
          expect(destinations).toEqual([]);
          done();
        }
      });
    });

    it('should be case insensitive', (done) => {
      service.searchDestinations('PARÍS').subscribe({
        next: (destinations) => {
          expect(destinations.length).toBeGreaterThan(0);
          done();
        }
      });
    });
  });

  describe('getDestinationsByCategory', () => {
    it('should filter destinations by category', (done) => {
      service.getDestinationsByCategory('Europa').subscribe({
        next: (destinations) => {
          expect(destinations.length).toBeGreaterThan(0);
          destinations.forEach(d => {
            expect(d.category).toBe('Europa');
          });
          done();
        }
      });
    });

    it('should return empty array for non-existent category', (done) => {
      service.getDestinationsByCategory('NonExistent').subscribe({
        next: (destinations) => {
          expect(destinations).toEqual([]);
          done();
        }
      });
    });
  });

  describe('getPopularDestinations', () => {
    it('should return destinations with high ratings', (done) => {
      service.getPopularDestinations().subscribe({
        next: (destinations) => {
          destinations.forEach(d => {
            expect(d.rating).toBeGreaterThanOrEqual(4.5);
          });
          done();
        }
      });
    });

    it('should return destinations sorted by rating', (done) => {
      service.getPopularDestinations().subscribe({
        next: (destinations) => {
          for (let i = 0; i < destinations.length - 1; i++) {
            expect(destinations[i].rating).toBeGreaterThanOrEqual(destinations[i + 1].rating);
          }
          done();
        }
      });
    });
  });
});
