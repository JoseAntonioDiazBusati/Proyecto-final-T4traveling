import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService, Theme } from '../../../services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-switcher.component.html',
  styleUrl: './theme-switcher.component.scss'
})
export class ThemeSwitcherComponent {
  private themeService = inject(ThemeService);

  // Exponer el signal del tema actual
  currentTheme = this.themeService.currentTheme;
  appliedTheme = this.themeService.appliedTheme;

  /**
   * Alterna entre temas
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this.themeService.setTheme(theme);
  }

  /**
   * Obtiene el icono apropiado según el tema
   */
  getThemeIcon(): string {
    const theme = this.currentTheme();
    switch (theme) {
      case 'light':
        return 'sun';
      case 'dark':
        return 'moon';
      case 'auto':
        return 'auto';
      default:
        return 'auto';
    }
  }

  /**
   * Obtiene el label del tema actual
   */
  getThemeLabel(): string {
    const theme = this.currentTheme();
    switch (theme) {
      case 'light':
        return 'Tema claro';
      case 'dark':
        return 'Tema oscuro';
      case 'auto':
        return 'Tema automático';
      default:
        return 'Tema automático';
    }
  }
}
