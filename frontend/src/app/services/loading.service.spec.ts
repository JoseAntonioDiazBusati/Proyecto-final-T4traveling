import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LoadingService]
    });
    service = TestBed.inject(LoadingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Global Loading', () => {
    it('should initially not be loading globally', () => {
      expect(service.isGlobalLoading()).toBe(false);
    });

    it('should show global loading', () => {
      service.showGlobal();
      expect(service.isGlobalLoading()).toBe(true);
    });

    it('should hide global loading', () => {
      service.showGlobal();
      service.hideGlobal();
      expect(service.isGlobalLoading()).toBe(false);
    });
  });

  describe('Specific Loading States', () => {
    it('should show loading for specific key', () => {
      service.show('test-key');
      expect(service.isLoading('test-key')).toBe(true);
    });

    it('should hide loading for specific key', () => {
      service.show('test-key');
      service.hide('test-key');
      expect(service.isLoading('test-key')).toBe(false);
    });

    it('should handle multiple loading states', () => {
      service.show('key1');
      service.show('key2');

      expect(service.isLoading('key1')).toBe(true);
      expect(service.isLoading('key2')).toBe(true);
    });

    it('should hide specific key without affecting others', () => {
      service.show('key1');
      service.show('key2');
      service.hide('key1');

      expect(service.isLoading('key1')).toBe(false);
      expect(service.isLoading('key2')).toBe(true);
    });

    it('should track active loading states', () => {
      service.show('key1');
      service.show('key2');

      expect(service.activeLoadingStates().length).toBe(2);
    });

    it('should indicate has active loading', () => {
      service.show('test-key');
      expect(service.hasActiveLoading()).toBe(true);
    });

    it('should indicate no active loading when all hidden', () => {
      service.show('test-key');
      service.hide('test-key');
      expect(service.hasActiveLoading()).toBe(false);
    });
  });

  describe('Hide All', () => {
    it('should hide all loading states', () => {
      service.showGlobal();
      service.show('key1');
      service.show('key2');

      service.clearAll();

      expect(service.isGlobalLoading()).toBe(false);
      expect(service.hasActiveLoading()).toBe(false);
    });
  });

  describe('Observable Wrapper', () => {
    it('should wrap observable with loading state', async () => {
      const { of, delay } = await import('rxjs');
      const { take } = await import('rxjs/operators');

      const mockObservable = of('test data').pipe(delay(100));

      const wrapped = service.wrap('test-key', mockObservable);

      // Should be loading initially
      expect(service.isLoading('test-key')).toBe(true);

      return new Promise<void>((resolve) => {
        wrapped.pipe(take(1)).subscribe({
          next: (data) => {
            expect(data).toBe('test data');
            // Should not be loading after completion
            setTimeout(() => {
              expect(service.isLoading('test-key')).toBe(false);
              resolve();
            }, 10);
          }
        });
      });
    });
  });
});
