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
  password?: string; // Solo para almacenamiento local
}

/**
 * AuthService - Servicio de autenticación con registro
 *
 * Características:
 * - Sistema de registro de usuarios
 * - Usuario admin predefinido
 * - Almacenamiento en localStorage
 * - Gestión de estado con Signals
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
  private readonly USERS_DB_KEY = 't4traveling-users-db';

  // Usuario admin predefinido
  private readonly ADMIN_USER: User = {
    id: 'admin-001',
    email: 'admin@t4traveling.com',
    name: 'Administrador',
    role: 'admin',
    password: 'admin'
  };

  constructor(private router: Router) {
    this.initializeUsersDB();
    this.checkStoredAuth();
  }

  /**
   * Inicializa la base de datos de usuarios con el admin
   */
  private initializeUsersDB(): void {
    const users = this.getUsersDB();
    if (!users.find(u => u.email === this.ADMIN_USER.email)) {
      users.push(this.ADMIN_USER);
      this.saveUsersDB(users);
    }
  }

  /**
   * Obtiene la lista de usuarios registrados
   */
  private getUsersDB(): User[] {
    try {
      const stored = localStorage.getItem(this.USERS_DB_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  /**
   * Guarda la lista de usuarios
   */
  private saveUsersDB(users: User[]): void {
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users));
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
   * Registra un nuevo usuario
   */
  async register(name: string, email: string, password: string): Promise<{ success: boolean; message: string }> {
    await this.delay(500);

    // Validaciones
    if (!name || name.length < 3) {
      return { success: false, message: 'El nombre debe tener al menos 3 caracteres' };
    }

    if (!email || !email.includes('@')) {
      return { success: false, message: 'Email inválido' };
    }

    if (!password || password.length < 4) {
      return { success: false, message: 'La contraseña debe tener al menos 4 caracteres' };
    }

    // Verificar si el usuario ya existe
    const users = this.getUsersDB();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'Este email ya está registrado' };
    }

    // Crear nuevo usuario
    const newUser: User = {
      id: this.generateId(),
      email,
      name,
      role: 'user',
      password
    };

    users.push(newUser);
    this.saveUsersDB(users);

    // Auto-login después del registro
    const userWithoutPassword = { ...newUser };
    delete userWithoutPassword.password;

    this.isAuthenticatedSignal.set(true);
    this.currentUserSignal.set(userWithoutPassword);
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Cuenta creada exitosamente' };
  }

  /**
   * Inicia sesión con email y contraseña
   */
  async login(email: string, password: string): Promise<{ success: boolean; message: string }> {
    await this.delay(800);

    // Validaciones básicas
    if (!email || !password) {
      return { success: false, message: 'Email y contraseña son requeridos' };
    }

    // Buscar usuario en la base de datos
    const users = this.getUsersDB();
    const user = users.find(u =>
      u.email.toLowerCase() === email.toLowerCase() &&
      u.password === password
    );

    if (!user) {
      return { success: false, message: 'Email o contraseña incorrectos' };
    }

    // Login exitoso
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    this.isAuthenticatedSignal.set(true);
    this.currentUserSignal.set(userWithoutPassword);
    localStorage.setItem(this.STORAGE_KEY, 'true');
    localStorage.setItem(this.USER_KEY, JSON.stringify(userWithoutPassword));

    return { success: true, message: 'Login exitoso' };
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
    if (role === 'user') return true;
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

  // ...existing code...

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private generateId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

