import { Component, HostListener, ElementRef, ViewChild, Renderer2, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeSwitcherComponent } from '../../shared/theme-switcher/theme-switcher.component';
import { AuthService } from '../../../services/auth.service';

/**
 * HeaderComponent - Componente de cabecera con menú hamburguesa
 *
 * Características implementadas:
 * - Menú hamburguesa responsive con animación
 * - Cierre con ESC (@HostListener document:keydown.escape)
 * - Cierre con click fuera (@HostListener document:click)
 * - Cierre automático en resize (@HostListener window:resize)
 * - Uso de Renderer2 para manipulación DOM segura
 * - ARIA attributes para accesibilidad (aria-expanded, aria-controls)
 * - Gestión de overflow del body
 * - Dropdown de usuario con cerrar sesión
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements AfterViewInit, OnDestroy {
  // Estado del menú móvil
  isMenuOpen = false;
  isUserDropdownOpen = false;

  // Servicios inyectados
  private authService = inject(AuthService);
  private router = inject(Router);

  // Computed signals de auth
  isAuthenticated = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;

  @ViewChild('mobileNav', { read: ElementRef }) mobileNav?: ElementRef<HTMLElement>;
  @ViewChild('menuToggle', { read: ElementRef }) menuToggle?: ElementRef<HTMLButtonElement>;

  // Elemento overlay creado dinámicamente
  private overlayElement: HTMLElement | null = null;

  constructor(
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {}

  ngAfterViewInit(): void {
    // Configurar el componente usando Renderer2
    this.renderer.addClass(this.elementRef.nativeElement, 'header-initialized');
  }

  ngOnDestroy(): void {
    // Limpiar overlay y restaurar body al destruir
    this.removeOverlay();
    this.renderer.setStyle(document.body, 'overflow', '');
  }

  /**
   * Alterna el estado del menú móvil
   * Crea/elimina overlay dinámicamente con Renderer2
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Gestionar overflow del body usando Renderer2
    if (this.isMenuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      this.createOverlay();
    } else {
      this.renderer.setStyle(document.body, 'overflow', '');
      this.removeOverlay();
    }
  }

  /**
   * Cierra el menú móvil
   */
  closeMenu(): void {
    if (!this.isMenuOpen) return;

    this.isMenuOpen = false;
    this.renderer.setStyle(document.body, 'overflow', '');
    this.removeOverlay();

    // Devolver el foco al botón de toggle para accesibilidad
    if (this.menuToggle?.nativeElement) {
      this.menuToggle.nativeElement.focus();
    }
  }

  /**
   * Crea un overlay dinámico usando Renderer2
   * Demuestra: createElement, appendChild, setStyle, addClass, listen
   */
  private createOverlay(): void {
    if (this.overlayElement) return;

    this.overlayElement = this.renderer.createElement('div');

    // Configurar estilos del overlay usando Renderer2
    this.renderer.addClass(this.overlayElement, 'header__overlay');
    this.renderer.setStyle(this.overlayElement, 'position', 'fixed');
    this.renderer.setStyle(this.overlayElement, 'top', '0');
    this.renderer.setStyle(this.overlayElement, 'left', '0');
    this.renderer.setStyle(this.overlayElement, 'right', '0');
    this.renderer.setStyle(this.overlayElement, 'bottom', '0');
    this.renderer.setStyle(this.overlayElement, 'background-color', 'rgba(0, 0, 0, 0.5)');
    this.renderer.setStyle(this.overlayElement, 'z-index', '90');
    this.renderer.setStyle(this.overlayElement, 'opacity', '0');
    this.renderer.setStyle(this.overlayElement, 'transition', 'opacity 0.3s ease');
    this.renderer.setAttribute(this.overlayElement, 'aria-hidden', 'true');

    // Añadir al DOM
    this.renderer.appendChild(document.body, this.overlayElement);

    // Trigger de animación
    setTimeout(() => {
      if (this.overlayElement) {
        this.renderer.setStyle(this.overlayElement, 'opacity', '1');
      }
    }, 10);
  }

  /**
   * Elimina el overlay dinámico
   * Demuestra: removeChild de Renderer2
   */
  private removeOverlay(): void {
    if (!this.overlayElement) return;

    // Animar salida
    this.renderer.setStyle(this.overlayElement, 'opacity', '0');

    // Eliminar después de la animación
    const overlay = this.overlayElement;
    setTimeout(() => {
      if (overlay && overlay.parentNode) {
        this.renderer.removeChild(document.body, overlay);
      }
    }, 300);

    this.overlayElement = null;
  }

  /**
   * Cierra el menú al hacer click fuera
   * @HostListener para eventos globales del documento
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) return;

    const target = event.target as HTMLElement;
    const clickedInsideNav = this.mobileNav?.nativeElement.contains(target);
    const clickedToggleButton = target.closest('.header__menu-toggle');

    // Cerrar si el click fue fuera del menú y del botón toggle
    if (!clickedInsideNav && !clickedToggleButton) {
      this.closeMenu();
    }
  }

  /**
   * Cierra el menú con la tecla ESC
   * @HostListener para eventos globales de teclado
   */
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: Event): void {
    if (this.isMenuOpen) {
      // preventDefault evita otros comportamientos asociados a ESC
      event.preventDefault();
      this.closeMenu();
    }
  }

  /**
   * Cierra el menú y ajusta en resize de ventana
   * @HostListener para eventos de window
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    // Cerrar el menú en pantallas grandes (breakpoint md = 768px)
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Navegación por teclado dentro del menú
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.isMenuOpen) return;

    // Navegación con teclas de flecha dentro del menú
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      this.navigateMenuItems(event.key === 'ArrowDown' ? 1 : -1);
    }
  }

  /**
   * Navega entre items del menú con flechas
   */
  private navigateMenuItems(direction: number): void {
    const menuItems = this.mobileNav?.nativeElement.querySelectorAll('a');
    if (!menuItems || menuItems.length === 0) return;

    const currentIndex = Array.from(menuItems).findIndex(
      item => item === document.activeElement
    );

    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = menuItems.length - 1;
    if (nextIndex >= menuItems.length) nextIndex = 0;

    (menuItems[nextIndex] as HTMLElement).focus();
  }

  /**
   * Alterna el dropdown de usuario
   */
  toggleUserDropdown(): void {
    this.isUserDropdownOpen = !this.isUserDropdownOpen;
  }

  /**
   * Navega a la página de login
   */
  navigateToLogin(): void {
    this.isUserDropdownOpen = false;
    this.router.navigate(['/login']);
  }

  /**
   * Cierra sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.isUserDropdownOpen = false;
    this.router.navigate(['/']);
  }
}

