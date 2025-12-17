import { Component, HostListener, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeSwitcherComponent } from '../../shared/theme-switcher/theme-switcher.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeSwitcherComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  // Estado del menú móvil
  isMenuOpen = false;

  @ViewChild('mobileNav', { read: ElementRef }) mobileNav?: ElementRef<HTMLElement>;

  /**
   * Alterna el estado del menú móvil
   */
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;

    // Gestionar overflow del body
    if (this.isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  /**
   * Cierra el menú móvil
   */
  closeMenu(): void {
    this.isMenuOpen = false;
    document.body.style.overflow = '';
  }

  /**
   * Cierra el menú al hacer click fuera
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isMenuOpen) return;

    const target = event.target as HTMLElement;
    const clickedInsideNav = this.mobileNav?.nativeElement.contains(target);
    const clickedToggleButton = target.closest('.header__menu-toggle');

    if (!clickedInsideNav && !clickedToggleButton) {
      this.closeMenu();
    }
  }

  /**
   * Cierra el menú con la tecla ESC
   */
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isMenuOpen) {
      this.closeMenu();
    }
  }

  /**
   * Previene el scroll cuando el menú está abierto
   */
  @HostListener('window:resize')
  onWindowResize(): void {
    // Cerrar el menú en pantallas grandes
    if (window.innerWidth >= 768 && this.isMenuOpen) {
      this.closeMenu();
    }
  }
}

