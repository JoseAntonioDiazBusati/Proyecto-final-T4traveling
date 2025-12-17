import { Component, inject } from '@angular/core';
}
  }
    }
        return 'Tema automático';
      default:
        return 'Tema automático';
      case 'auto':
        return 'Tema oscuro';
      case 'dark':
        return 'Tema claro';
      case 'light':
    switch (theme) {
    const theme = this.currentTheme();
  getThemeLabel(): string {
   */
   * Obtiene el label del tema actual
  /**

  }
    }
        return 'auto';
      default:
        return 'auto';
      case 'auto':
        return 'moon';
      case 'dark':
        return 'sun';
      case 'light':
    switch (theme) {
    const theme = this.currentTheme();
  getThemeIcon(): string {
   */
   * Obtiene el icono apropiado según el tema
  /**

  }
    this.themeService.setTheme(theme);
  setTheme(theme: Theme): void {
   */
   * Establece un tema específico
  /**

  }
    this.themeService.toggleTheme();
  toggleTheme(): void {
   */
   * Alterna entre temas
  /**

  appliedTheme = this.themeService.appliedTheme;
  currentTheme = this.themeService.currentTheme;
  // Exponer el signal del tema actual

  private themeService = inject(ThemeService);
export class ThemeSwitcherComponent {
})
  styleUrl: './theme-switcher.component.scss'
  templateUrl: './theme-switcher.component.html',
  imports: [CommonModule],
  standalone: true,
  selector: 'app-theme-switcher',
@Component({

import { ThemeService, Theme } from '../../../services/theme.service';
import { CommonModule } from '@angular/common';

