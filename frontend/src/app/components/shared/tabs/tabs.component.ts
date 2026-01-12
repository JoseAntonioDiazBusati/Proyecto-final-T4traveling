import {
  Component,
  Input,
  Output,
  EventEmitter,
  Renderer2,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz que define la estructura de un tab
 */
export interface TabItem {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

/**
 * TabsComponent - Componente de pestañas accesible
 *
 * Características implementadas:
 * - Navegación completa por teclado (Arrow keys, Home, End)
 * - ARIA roles (tablist, tab, tabpanel)
 * - Orientación horizontal y vertical
 * - Uso de Renderer2 para manipulación DOM segura
 * - Eventos focusin/focusout para accesibilidad
 */
@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.component.html',
  styleUrl: './tabs.component.scss'
})
export class TabsComponent implements AfterViewInit, OnDestroy {
  @Input() tabs: TabItem[] = [];
  @Input() activeTabId?: string;
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Output() tabChanged = new EventEmitter<TabItem>();

  @ViewChild('tabListRef', { read: ElementRef }) tabListRef?: ElementRef<HTMLElement>;

  // Indicador visual dinámico creado con Renderer2
  private activeIndicator: HTMLElement | null = null;
  private focusedTab: TabItem | null = null;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    if (!this.activeTabId && this.tabs.length > 0) {
      const firstEnabled = this.tabs.find(tab => !tab.disabled);
      if (firstEnabled) {
        this.activeTabId = firstEnabled.id;
      }
    }
  }

  /**
   * Después de inicializar la vista, crear indicador activo dinámico
   */
  ngAfterViewInit(): void {
    // Crear indicador de tab activo usando Renderer2
    this.createActiveIndicator();

    // Actualizar posición inicial después de renderizado
    setTimeout(() => this.updateIndicatorPosition(), 50);
  }

  /**
   * Limpieza de elementos dinámicos al destruir
   */
  ngOnDestroy(): void {
    if (this.activeIndicator && this.activeIndicator.parentNode) {
      this.renderer.removeChild(this.activeIndicator.parentNode, this.activeIndicator);
      this.activeIndicator = null;
    }
  }

  /**
   * Crea el indicador visual de tab activo usando Renderer2
   * Demuestra: createElement, appendChild, setStyle, addClass
   */
  private createActiveIndicator(): void {
    this.activeIndicator = this.renderer.createElement('span');

    this.renderer.addClass(this.activeIndicator, 'tabs__indicator');
    this.renderer.setAttribute(this.activeIndicator, 'aria-hidden', 'true');
    this.renderer.setStyle(this.activeIndicator, 'position', 'absolute');
    this.renderer.setStyle(this.activeIndicator, 'background-color', 'var(--color-primary, #4f46e5)');
    this.renderer.setStyle(this.activeIndicator, 'transition', 'all 0.3s ease');
    this.renderer.setStyle(this.activeIndicator, 'pointer-events', 'none');

    if (this.orientation === 'horizontal') {
      this.renderer.setStyle(this.activeIndicator, 'bottom', '0');
      this.renderer.setStyle(this.activeIndicator, 'height', '2px');
    } else {
      this.renderer.setStyle(this.activeIndicator, 'left', '0');
      this.renderer.setStyle(this.activeIndicator, 'width', '3px');
    }

    const tabList = this.elementRef.nativeElement.querySelector('.tabs__list');
    if (tabList) {
      this.renderer.setStyle(tabList, 'position', 'relative');
      this.renderer.appendChild(tabList, this.activeIndicator);
    }
  }

  /**
   * Actualiza la posición del indicador activo
   */
  private updateIndicatorPosition(): void {
    if (!this.activeIndicator || !this.activeTabId) return;

    const activeButton = this.elementRef.nativeElement.querySelector(
      `#tab-${this.activeTabId}`
    ) as HTMLElement;

    if (!activeButton) return;

    if (this.orientation === 'horizontal') {
      this.renderer.setStyle(this.activeIndicator, 'left', `${activeButton.offsetLeft}px`);
      this.renderer.setStyle(this.activeIndicator, 'width', `${activeButton.offsetWidth}px`);
    } else {
      this.renderer.setStyle(this.activeIndicator, 'top', `${activeButton.offsetTop}px`);
      this.renderer.setStyle(this.activeIndicator, 'height', `${activeButton.offsetHeight}px`);
    }
  }

  /**
   * Manejador de evento focus en tab
   */
  onTabFocus(tab: TabItem): void {
    this.focusedTab = tab;
  }

  /**
   * Manejador de evento blur en tab
   */
  onTabBlur(tab: TabItem): void {
    if (this.focusedTab === tab) {
      this.focusedTab = null;
    }
  }

  selectTab(tab: TabItem, event?: Event): void {
    if (event) {
      // preventDefault evita comportamiento por defecto del botón
      event.preventDefault();
      // stopPropagation evita que el evento burbujee
      event.stopPropagation();
    }

    if (tab.disabled || tab.id === this.activeTabId) return;

    this.activeTabId = tab.id;
    this.tabChanged.emit(tab);

    // Actualizar indicador visual dinámico
    setTimeout(() => this.updateIndicatorPosition(), 10);
  }

  isTabActive(tab: TabItem): boolean {
    return tab.id === this.activeTabId;
  }

  onKeyDown(event: KeyboardEvent, tab: TabItem, index: number): void {
    const isHorizontal = this.orientation === 'horizontal';

    switch (event.key) {
      case 'ArrowLeft':
        if (isHorizontal) {
          event.preventDefault();
          this.focusPreviousTab(index);
        }
        break;

      case 'ArrowRight':
        if (isHorizontal) {
          event.preventDefault();
          this.focusNextTab(index);
        }
        break;

      case 'ArrowUp':
        if (!isHorizontal) {
          event.preventDefault();
          this.focusPreviousTab(index);
        }
        break;

      case 'ArrowDown':
        if (!isHorizontal) {
          event.preventDefault();
          this.focusNextTab(index);
        }
        break;

      case 'Home':
        event.preventDefault();
        this.focusFirstTab();
        break;

      case 'End':
        event.preventDefault();
        this.focusLastTab();
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        this.selectTab(tab);
        break;
    }
  }

  private focusNextTab(currentIndex: number): void {
    const nextIndex = this.findNextEnabledIndex(currentIndex);
    if (nextIndex !== -1) {
      this.focusTab(nextIndex);
      this.selectTab(this.tabs[nextIndex]);
    }
  }

  private focusPreviousTab(currentIndex: number): void {
    const previousIndex = this.findPreviousEnabledIndex(currentIndex);
    if (previousIndex !== -1) {
      this.focusTab(previousIndex);
      this.selectTab(this.tabs[previousIndex]);
    }
  }

  private focusFirstTab(): void {
    const firstIndex = this.findNextEnabledIndex(-1);
    if (firstIndex !== -1) {
      this.focusTab(firstIndex);
      this.selectTab(this.tabs[firstIndex]);
    }
  }

  private focusLastTab(): void {
    const lastIndex = this.findPreviousEnabledIndex(this.tabs.length);
    if (lastIndex !== -1) {
      this.focusTab(lastIndex);
      this.selectTab(this.tabs[lastIndex]);
    }
  }

  private findNextEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex + 1; i < this.tabs.length; i++) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    for (let i = 0; i <= currentIndex; i++) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private findPreviousEnabledIndex(currentIndex: number): number {
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    for (let i = this.tabs.length - 1; i >= currentIndex; i--) {
      if (!this.tabs[i].disabled) {
        return i;
      }
    }
    return -1;
  }

  private focusTab(index: number): void {
    const button = document.getElementById(`tab-${this.tabs[index].id}`);
    button?.focus();
  }

  getTabButtonId(tab: TabItem): string {
    return `tab-${tab.id}`;
  }

  getTabPanelId(tab: TabItem): string {
    return `tabpanel-${tab.id}`;
  }
}

