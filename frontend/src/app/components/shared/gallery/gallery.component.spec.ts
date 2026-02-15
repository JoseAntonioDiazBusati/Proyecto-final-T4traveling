import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, beforeAll } from 'vitest';
import { GalleryComponent, GalleryItem } from './gallery.component';
import { TestBedImpl } from '@angular/core/testing';
import { BrowserDynamicTestingModule, platformBrowserDynamicTesting } from '@angular/platform-browser-dynamic/testing';

describe('GalleryComponent', () => {
  let component: GalleryComponent;
  let fixture: ComponentFixture<GalleryComponent>;

  const mockItems: GalleryItem[] = [
    {
      src: '/images/test1.jpg',
      alt: 'Test image 1',
      caption: 'Caption 1'
    },
    {
      src: '/images/test2.jpg',
      alt: 'Test image 2',
      caption: 'Caption 2'
    },
    {
      src: '/images/test3.jpg',
      alt: 'Test image 3',
      caption: 'Caption 3'
    }
  ];

  beforeAll(() => {
    TestBed.initTestEnvironment(
      BrowserDynamicTestingModule,
      platformBrowserDynamicTesting()
    );
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleryComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(GalleryComponent);
    component = fixture.componentInstance;
    component.items = mockItems;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all gallery items', () => {
    const compiled = fixture.nativeElement;
    const images = compiled.querySelectorAll('.gallery__image');
    expect(images.length).toBe(mockItems.length);
  });

  it('should open image when clicked', () => {
    component.openImage(0);
    expect(component.selectedIndex).toBe(0);
    expect(component.selectedItem).toEqual(mockItems[0]);
  });

  it('should close image', () => {
    component.openImage(0);
    component.closeImage();
    expect(component.selectedIndex).toBeNull();
    expect(component.selectedItem).toBeNull();
  });

  it('should navigate to next image', () => {
    component.openImage(0);
    component.nextImage();
    expect(component.selectedIndex).toBe(1);
  });

  it('should navigate to previous image', () => {
    component.openImage(1);
    component.previousImage();
    expect(component.selectedIndex).toBe(0);
  });

  it('should not go beyond last image', () => {
    component.openImage(2);
    component.nextImage();
    expect(component.selectedIndex).toBe(2);
  });

  it('should not go before first image', () => {
    component.openImage(0);
    component.previousImage();
    expect(component.selectedIndex).toBe(0);
  });

  it('should handle keyboard navigation - ArrowRight', () => {
    component.openImage(0);
    const event = new KeyboardEvent('keydown', { key: 'ArrowRight' });
    vi.spyOn(event, 'preventDefault');
    component.onKeyDown(event);
    expect(component.selectedIndex).toBe(1);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle keyboard navigation - ArrowLeft', () => {
    component.openImage(1);
    const event = new KeyboardEvent('keydown', { key: 'ArrowLeft' });
    vi.spyOn(event, 'preventDefault');
    component.onKeyDown(event);
    expect(component.selectedIndex).toBe(0);
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should handle keyboard navigation - Escape', () => {
    component.openImage(1);
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    vi.spyOn(event, 'preventDefault');
    component.onKeyDown(event);
    expect(component.selectedIndex).toBeNull();
    expect(event.preventDefault).toHaveBeenCalled();
  });

  it('should have accessible attributes', () => {
    const compiled = fixture.nativeElement;
    const items = compiled.querySelectorAll('.gallery__item');

    items.forEach((item: Element) => {
      expect(item.getAttribute('role')).toBe('button');
      expect(item.getAttribute('tabindex')).toBe('0');
      expect(item.getAttribute('aria-label')).toContain('Ver imagen ampliada');
    });
  });

  it('should display counter in modal', () => {
    component.openImage(1);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    const counter = compiled.querySelector('.gallery__counter');
    expect(counter?.textContent).toContain('2 / 3');
  });
});
