import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Interfaz para el usuario autenticado
 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

/**
 * AuthService - Servicio de autenticación simulada
 *
 * Características:
 * - Simula autenticación con localStorage
 * - Gestiona estado de sesión con Signals
 * - Proporciona métodos para login, logout y verificación
 * - Usado por los guards para proteger rutas
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Signal reactivo para el estado de autenticación
  private isAuthenticatedSignal = signal<boolean>(false);
  private currentUserSignal = signal<User | null>(null);

  // Exponer como readonly
  public isAuthenticated = this.isAuthenticatedSignal.asReadonly();
  public currentUser = this.currentUserSignal.asReadonly();

  private readonly STORAGE_KEY = 't4traveling-auth';
  private readonly USER_KEY = 't4traveling-user';

  constructor(private router: Router) {
    this.checkStoredAuth();
  }

  /**
   * Verifica si hay una sesión almacenada al iniciar
   */
  private checkStoredAuth(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      const storedUser = localStorage.getItem(this.USER_KEY);

      if (stored === 'true' && storedUser) {
        this.isAuthenticatedSignal.set(true);
        this.currentUserSignal.set(JSON.parse(storedUser));
      }
    } catch (e) {
      console.warn('Error al recuperar sesión:', e);
    }
  }

  /**
   * Simula el proceso de login
   * @param email Email del usuario
   * @param password Contraseña (simulada)
   * @returns Promise que resuelve con éxito o error
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    // Simular delay de red
    await this.delay(800);

    // Simulación de validación
    if (email && password.length >= 4) {
      const user: User = {
        id: this.generateId(),
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user'
      };

      this.isAuthenticatedSignal.set(true);
      this.currentUserSignal.set(user);

      // Persistir en localStorage
      localStorage.setItem(this.STORAGE_KEY, 'true');
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));

      return { success: true, message: 'Login exitoso' };
    }

    return { success: false, message: 'Credenciales inválidas' };
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.isAuthenticatedSignal.set(false);
    this.currentUserSignal.set(null);

    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);

    this.router.navigate(['/login']);
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: 'user' | 'admin'): boolean {
    const user = this.currentUserSignal();
    if (!user) return false;

    if (role === 'user') return true; // Todos los usuarios autenticados
    return user.role === role;
  }

  /**
   * Obtiene la URL de retorno después del login
   */
  getReturnUrl(): string {
    return sessionStorage.getItem('returnUrl') || '/';
  }

  /**
   * Guarda la URL para redirigir después del login
   */
  setReturnUrl(url: string): void {
    sessionStorage.setItem('returnUrl', url);
  }

  /**
   * Limpia la URL de retorno
   */
  clearReturnUrl(): void {
    sessionStorage.removeItem('returnUrl');
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

