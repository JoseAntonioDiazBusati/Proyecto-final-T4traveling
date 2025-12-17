import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly THEME_KEY = 't4traveling-theme';

  // Signal para el tema actual
  public currentTheme = signal<Theme>('auto');

  // Signal para el tema aplicado (light o dark, sin auto)
  public appliedTheme = signal<'light' | 'dark'>('dark');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeTheme();
      this.setupMediaQueryListener();

      // Effect que aplica el tema cuando cambia
      effect(() => {
        this.applyTheme(this.currentTheme());
      });
    }
  }

  /**
   * Inicializa el tema desde localStorage o preferencia del sistema
   */
  private initializeTheme(): void {
    const savedTheme = this.getStoredTheme();
    if (savedTheme) {
      this.currentTheme.set(savedTheme);
    } else {
      // Si no hay tema guardado, usar auto (preferencia del sistema)
      this.currentTheme.set('auto');
    }
  }

  /**
   * Configura el listener para cambios en la preferencia del sistema
   */
  private setupMediaQueryListener(): void {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // Listener para cambios en la preferencia del sistema
    mediaQuery.addEventListener('change', (e) => {
      if (this.currentTheme() === 'auto') {
        this.appliedTheme.set(e.matches ? 'dark' : 'light');
        this.updateDOMTheme(this.appliedTheme());
      }
    });
  }

  /**
   * Obtiene el tema guardado en localStorage
   */
  private getStoredTheme(): Theme | null {
    try {
      const stored = localStorage.getItem(this.THEME_KEY);
      if (stored && ['light', 'dark', 'auto'].includes(stored)) {
        return stored as Theme;
      }
    } catch (e) {
      console.warn('No se pudo acceder a localStorage:', e);
    }
    return null;
  }

  /**
   * Guarda el tema en localStorage
   */
  private storeTheme(theme: Theme): void {
    try {
      localStorage.setItem(this.THEME_KEY, theme);
    } catch (e) {
      console.warn('No se pudo guardar en localStorage:', e);
    }
  }

  /**
   * Detecta la preferencia del sistema
   */
  private getSystemPreference(): 'light' | 'dark' {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Aplica el tema seleccionado
   */
  private applyTheme(theme: Theme): void {
    let themeToApply: 'light' | 'dark';

    if (theme === 'auto') {
      themeToApply = this.getSystemPreference();
    } else {
      themeToApply = theme;
    }

    this.appliedTheme.set(themeToApply);
    this.updateDOMTheme(themeToApply);
    this.storeTheme(theme);
  }

  /**
   * Actualiza el atributo data-theme en el DOM
   */
  private updateDOMTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);

    // También agregar clase para compatibilidad
    document.documentElement.classList.remove('theme-light', 'theme-dark');
    document.documentElement.classList.add(`theme-${theme}`);
  }

  /**
   * Cambia al siguiente tema en el ciclo: auto -> light -> dark -> auto
   */
  public toggleTheme(): void {
    const currentTheme = this.currentTheme();
    let nextTheme: Theme;

    switch (currentTheme) {
      case 'auto':
        nextTheme = 'light';
        break;
      case 'light':
        nextTheme = 'dark';
        break;
      case 'dark':
        nextTheme = 'auto';
        break;
      default:
        nextTheme = 'auto';
    }

    this.setTheme(nextTheme);
  }

  /**
   * Establece un tema específico
   */
  public setTheme(theme: Theme): void {
    this.currentTheme.set(theme);
  }

  /**
   * Obtiene el tema actual
   */
  public getTheme(): Theme {
    return this.currentTheme();
  }

  /**
   * Obtiene el tema aplicado (light o dark real)
   */
  public getAppliedTheme(): 'light' | 'dark' {
    return this.appliedTheme();
  }
}

