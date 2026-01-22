import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { StateService, User } from './state.service';

describe('StateService', () => {
  let service: StateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [StateService]
    });
    service = TestBed.inject(StateService);
    // Limpiar localStorage antes de cada test
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('User Management', () => {
    it('should initially have no user', () => {
      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should set user correctly', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      service.setUser(user);

      expect(service.user()).toEqual(user);
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should update user partially', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      service.setUser(user);
      service.updateUser({ name: 'Updated Name' });

      expect(service.user()?.name).toBe('Updated Name');
      expect(service.user()?.email).toBe('test@example.com');
    });

    it('should logout user', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      service.setUser(user);
      service.logout();

      expect(service.user()).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Cart Management', () => {
    it('should initially have empty cart', () => {
      expect(service.cart()).toEqual([]);
      expect(service.cartItemCount()).toBe(0);
      expect(service.cartTotal()).toBe(0);
    });

    it('should add item to cart', () => {
      const item = { name: 'Product', price: 100 };
      service.addToCart(item);

      expect(service.cart().length).toBe(1);
      expect(service.cartItemCount()).toBe(1);
      expect(service.cart()[0]).toMatchObject(item);
      expect(service.cart()[0].id).toBeDefined();
    });

    it('should remove item from cart', () => {
      const item = { name: 'Product', price: 100 };
      service.addToCart(item);
      const cartItem = service.cart()[0];

      service.removeFromCart(cartItem.id);

      expect(service.cart().length).toBe(0);
      expect(service.cartItemCount()).toBe(0);
    });

    it('should calculate cart total correctly', () => {
      service.addToCart({ name: 'Product 1', price: 100 });
      service.addToCart({ name: 'Product 2', price: 200 });

      expect(service.cartTotal()).toBe(300);
    });

    it('should clear cart', () => {
      service.addToCart({ name: 'Product 1', price: 100 });
      service.addToCart({ name: 'Product 2', price: 200 });

      service.clearCart();

      expect(service.cart()).toEqual([]);
      expect(service.cartItemCount()).toBe(0);
      expect(service.cartTotal()).toBe(0);
    });

    it('should check if item is in cart', () => {
      const item = { name: 'Product', price: 100 };
      service.addToCart(item);
      const cartItem = service.cart()[0];

      expect(service.isInCart(cartItem.id)).toBe(true);
      expect(service.isInCart('non-existent-id')).toBe(false);
    });
  });

  describe('Search and Filters', () => {
    it('should set search query', () => {
      service.setSearchQuery('test query');
      expect(service.searchQuery()).toBe('test query');
    });

    it('should clear search query', () => {
      service.setSearchQuery('test query');
      service.clearSearch();
      expect(service.searchQuery()).toBe('');
    });

    it('should set filter', () => {
      service.setFilter('category', 'electronics');
      expect(service.filters()).toEqual({ category: 'electronics' });
      expect(service.hasActiveFilters()).toBe(true);
    });

    it('should remove filter', () => {
      service.setFilter('category', 'electronics');
      service.removeFilter('category');
      expect(service.filters()).toEqual({});
      expect(service.hasActiveFilters()).toBe(false);
    });

    it('should set multiple filters', () => {
      const filters = { category: 'electronics', price: 'high' };
      service.setFilters(filters);
      expect(service.filters()).toEqual(filters);
    });

    it('should clear all filters', () => {
      service.setFilters({ category: 'electronics', price: 'high' });
      service.clearFilters();
      expect(service.filters()).toEqual({});
    });
  });

  describe('Persistence', () => {
    it('should persist state to localStorage', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      service.setUser(user);
      service.addToCart({ name: 'Product', price: 100 });

      const stored = localStorage.getItem('t4traveling-state');
      expect(stored).toBeTruthy();

      const state = JSON.parse(stored!);
      expect(state.user).toEqual(user);
      expect(state.cart).toHaveLength(1);
    });

    it('should load state from localStorage', () => {
      const user: User = {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      };

      const state = {
        user,
        cart: [{ id: '1', name: 'Product', price: 100 }],
        filters: { category: 'electronics' }
      };

      localStorage.setItem('t4traveling-state', JSON.stringify(state));

      // Crear nueva instancia del servicio
      const newService = TestBed.inject(StateService);

      expect(newService.user()).toEqual(user);
      expect(newService.cart()).toEqual(state.cart);
      expect(newService.filters()).toEqual(state.filters);
    });

    it('should reset all state', () => {
      service.setUser({ id: '1', name: 'Test', email: 'test@example.com' });
      service.addToCart({ name: 'Product', price: 100 });
      service.setFilter('category', 'electronics');

      service.resetState();

      expect(service.user()).toBeNull();
      expect(service.cart()).toEqual([]);
      expect(service.filters()).toEqual({});
    });
  });
});
