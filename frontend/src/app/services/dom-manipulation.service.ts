import { Injectable, Renderer2, RendererFactory2, OnDestroy } from '@angular/core';

/**
 * Interfaz para elementos dinámicos creados
 */
export interface DynamicElement {
  id: string;
  element: HTMLElement;
  type: 'notification' | 'chip' | 'badge' | 'overlay' | 'custom';
  createdAt: number;
}

/**
 * DomManipulationService - Servicio para manipulación dinámica del DOM
 *
 * Este servicio demuestra el uso avanzado de Renderer2 para:
 * - Crear elementos dinámicamente (renderer.createElement)
 * - Añadir elementos al DOM (renderer.appendChild)
 * - Eliminar elementos del DOM (renderer.removeChild)
 * - Manipular estilos y clases (renderer.setStyle, renderer.addClass)
 * - Gestionar listeners de eventos (renderer.listen)
 *
 * Cumple con el requisito 1.3 de la rúbrica:
 * "Creación y eliminación dinámica de elementos del DOM"
 *
 * Características:
 * - Tracking de elementos creados para limpieza
 * - Limpieza automática de listeners en ngOnDestroy
 * - Diferentes tipos de elementos dinámicos
 */
@Injectable({
  providedIn: 'root'
})
export class DomManipulationService implements OnDestroy {
  private renderer: Renderer2;
  private dynamicElements: Map<string, DynamicElement> = new Map();
  private listeners: Array<() => void> = [];

  constructor(rendererFactory: RendererFactory2) {
    // Crear renderer desde factory (necesario en servicios)
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  /**
   * Limpieza al destruir el servicio
   * Elimina todos los elementos dinámicos y listeners
   */
  ngOnDestroy(): void {
    // Eliminar todos los elementos dinámicos
    this.dynamicElements.forEach((item) => {
      this.removeElement(item.id);
    });

    // Eliminar todos los listeners
    this.listeners.forEach(unlisten => unlisten());
    this.listeners = [];
  }

  /**
   * Crea un chip/tag dinámico
   * Demuestra: createElement, createText, appendChild, addClass, setStyle, listen
   *
   * @param text Texto del chip
   * @param onRemove Callback al eliminar
   * @param container Contenedor donde añadir el chip
   * @returns ID del elemento creado
   */
  createChip(
    text: string,
    onRemove?: (id: string) => void,
    container: HTMLElement = document.body
  ): string {
    const id = this.generateId('chip');

    // Crear contenedor del chip con Renderer2
    const chipElement = this.renderer.createElement('span');
    this.renderer.setAttribute(chipElement, 'id', id);
    this.renderer.addClass(chipElement, 'dynamic-chip');
    this.renderer.setAttribute(chipElement, 'role', 'listitem');

    // Estilos del chip usando Renderer2.setStyle
    this.renderer.setStyle(chipElement, 'display', 'inline-flex');
    this.renderer.setStyle(chipElement, 'align-items', 'center');
    this.renderer.setStyle(chipElement, 'gap', '0.5rem');
    this.renderer.setStyle(chipElement, 'padding', '0.25rem 0.75rem');
    this.renderer.setStyle(chipElement, 'background-color', 'var(--color-primary, #4f46e5)');
    this.renderer.setStyle(chipElement, 'color', 'white');
    this.renderer.setStyle(chipElement, 'border-radius', '9999px');
    this.renderer.setStyle(chipElement, 'font-size', '0.875rem');
    this.renderer.setStyle(chipElement, 'animation', 'fadeIn 0.2s ease');

    // Crear texto del chip
    const textNode = this.renderer.createText(text);
    const textSpan = this.renderer.createElement('span');
    this.renderer.appendChild(textSpan, textNode);
    this.renderer.appendChild(chipElement, textSpan);

    // Crear botón de eliminar
    const removeButton = this.renderer.createElement('button');
    this.renderer.setAttribute(removeButton, 'type', 'button');
    this.renderer.setAttribute(removeButton, 'aria-label', `Eliminar ${text}`);
    this.renderer.setStyle(removeButton, 'background', 'none');
    this.renderer.setStyle(removeButton, 'border', 'none');
    this.renderer.setStyle(removeButton, 'color', 'inherit');
    this.renderer.setStyle(removeButton, 'cursor', 'pointer');
    this.renderer.setStyle(removeButton, 'padding', '0');
    this.renderer.setStyle(removeButton, 'line-height', '1');
    this.renderer.setStyle(removeButton, 'opacity', '0.7');

    // Icono X para el botón
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('width', '14');
    svg.setAttribute('height', '14');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '2');
    svg.setAttribute('aria-hidden', 'true');

    const path = document.createElementNS(svgNS, 'path');
    path.setAttribute('d', 'M18 6L6 18M6 6l12 12');
    svg.appendChild(path);

    this.renderer.appendChild(removeButton, svg);
    this.renderer.appendChild(chipElement, removeButton);

    // Listener para eliminar usando Renderer2.listen
    const unlisten = this.renderer.listen(removeButton, 'click', (event: Event) => {
      event.preventDefault();
      event.stopPropagation();
      this.removeElement(id);
      if (onRemove) onRemove(id);
    });
    this.listeners.push(unlisten);

    // Listener para hover
    const unlistenHover = this.renderer.listen(removeButton, 'mouseenter', () => {
      this.renderer.setStyle(removeButton, 'opacity', '1');
    });
    this.listeners.push(unlistenHover);

    const unlistenLeave = this.renderer.listen(removeButton, 'mouseleave', () => {
      this.renderer.setStyle(removeButton, 'opacity', '0.7');
    });
    this.listeners.push(unlistenLeave);

    // Añadir al contenedor
    this.renderer.appendChild(container, chipElement);

    // Registrar elemento
    this.dynamicElements.set(id, {
      id,
      element: chipElement,
      type: 'chip',
      createdAt: Date.now()
    });

    return id;
  }

  /**
   * Crea un badge/contador dinámico
   *
   * @param count Número a mostrar
   * @param targetElement Elemento al que añadir el badge
   * @returns ID del elemento creado
   */
  createBadge(count: number, targetElement: HTMLElement): string {
    const id = this.generateId('badge');

    const badge = this.renderer.createElement('span');
    this.renderer.setAttribute(badge, 'id', id);
    this.renderer.addClass(badge, 'dynamic-badge');
    this.renderer.setAttribute(badge, 'aria-label', `${count} notificaciones`);

    const text = this.renderer.createText(count > 99 ? '99+' : count.toString());
    this.renderer.appendChild(badge, text);

    // Estilos del badge
    this.renderer.setStyle(badge, 'position', 'absolute');
    this.renderer.setStyle(badge, 'top', '-8px');
    this.renderer.setStyle(badge, 'right', '-8px');
    this.renderer.setStyle(badge, 'min-width', '18px');
    this.renderer.setStyle(badge, 'height', '18px');
    this.renderer.setStyle(badge, 'padding', '0 4px');
    this.renderer.setStyle(badge, 'background-color', 'var(--color-error, #ef4444)');
    this.renderer.setStyle(badge, 'color', 'white');
    this.renderer.setStyle(badge, 'font-size', '0.75rem');
    this.renderer.setStyle(badge, 'font-weight', '600');
    this.renderer.setStyle(badge, 'border-radius', '9999px');
    this.renderer.setStyle(badge, 'display', 'flex');
    this.renderer.setStyle(badge, 'align-items', 'center');
    this.renderer.setStyle(badge, 'justify-content', 'center');
    this.renderer.setStyle(badge, 'animation', 'pulse 0.3s ease');

    // Hacer el contenedor relativo si no lo es
    const computedStyle = window.getComputedStyle(targetElement);
    if (computedStyle.position === 'static') {
      this.renderer.setStyle(targetElement, 'position', 'relative');
    }

    this.renderer.appendChild(targetElement, badge);

    this.dynamicElements.set(id, {
      id,
      element: badge,
      type: 'badge',
      createdAt: Date.now()
    });

    return id;
  }

  /**
   * Crea un mensaje flotante temporal
   * Demuestra createElement, appendChild, setStyle con animaciones
   *
   * @param message Mensaje a mostrar
   * @param type Tipo de mensaje
   * @param duration Duración en ms (0 = permanente)
   * @returns ID del elemento creado
   */
  createFloatingMessage(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration: number = 3000
  ): string {
    const id = this.generateId('message');

    const messageEl = this.renderer.createElement('div');
    this.renderer.setAttribute(messageEl, 'id', id);
    this.renderer.setAttribute(messageEl, 'role', 'alert');
    this.renderer.setAttribute(messageEl, 'aria-live', 'polite');
    this.renderer.addClass(messageEl, 'dynamic-message');
    this.renderer.addClass(messageEl, `dynamic-message--${type}`);

    // Colores según tipo
    const colors: Record<string, string> = {
      success: '#10b981',
      error: '#ef4444',
      warning: '#f59e0b',
      info: '#3b82f6'
    };

    // Estilos del mensaje
    this.renderer.setStyle(messageEl, 'position', 'fixed');
    this.renderer.setStyle(messageEl, 'bottom', '20px');
    this.renderer.setStyle(messageEl, 'right', '20px');
    this.renderer.setStyle(messageEl, 'padding', '1rem 1.5rem');
    this.renderer.setStyle(messageEl, 'background-color', colors[type]);
    this.renderer.setStyle(messageEl, 'color', 'white');
    this.renderer.setStyle(messageEl, 'border-radius', '0.5rem');
    this.renderer.setStyle(messageEl, 'box-shadow', '0 4px 12px rgba(0,0,0,0.15)');
    this.renderer.setStyle(messageEl, 'z-index', '10000');
    this.renderer.setStyle(messageEl, 'max-width', '400px');
    this.renderer.setStyle(messageEl, 'transform', 'translateX(100%)');
    this.renderer.setStyle(messageEl, 'transition', 'transform 0.3s ease');

    const text = this.renderer.createText(message);
    this.renderer.appendChild(messageEl, text);

    this.renderer.appendChild(document.body, messageEl);

    // Trigger de animación de entrada
    setTimeout(() => {
      this.renderer.setStyle(messageEl, 'transform', 'translateX(0)');
    }, 10);

    this.dynamicElements.set(id, {
      id,
      element: messageEl,
      type: 'notification',
      createdAt: Date.now()
    });

    // Auto-eliminar si tiene duración
    if (duration > 0) {
      setTimeout(() => {
        this.removeElementWithAnimation(id);
      }, duration);
    }

    return id;
  }

  /**
   * Elimina un elemento dinámico del DOM
   * Demuestra: removeChild de Renderer2
   *
   * @param id ID del elemento a eliminar
   */
  removeElement(id: string): void {
    const item = this.dynamicElements.get(id);
    if (!item) return;

    if (item.element.parentNode) {
      this.renderer.removeChild(item.element.parentNode, item.element);
    }

    this.dynamicElements.delete(id);
  }

  /**
   * Elimina un elemento con animación de salida
   *
   * @param id ID del elemento a eliminar
   */
  removeElementWithAnimation(id: string): void {
    const item = this.dynamicElements.get(id);
    if (!item) return;

    // Animación de salida
    this.renderer.setStyle(item.element, 'transform', 'translateX(100%)');
    this.renderer.setStyle(item.element, 'opacity', '0');

    // Eliminar después de la animación
    setTimeout(() => {
      this.removeElement(id);
    }, 300);
  }

  /**
   * Actualiza el contenido de un elemento dinámico
   *
   * @param id ID del elemento
   * @param newContent Nuevo contenido
   */
  updateElementContent(id: string, newContent: string): void {
    const item = this.dynamicElements.get(id);
    if (!item) return;

    // Limpiar contenido anterior
    while (item.element.firstChild) {
      this.renderer.removeChild(item.element, item.element.firstChild);
    }

    // Añadir nuevo contenido
    const text = this.renderer.createText(newContent);
    this.renderer.appendChild(item.element, text);
  }

  /**
   * Obtiene todos los elementos dinámicos de un tipo
   *
   * @param type Tipo de elemento
   * @returns Array de elementos
   */
  getElementsByType(type: DynamicElement['type']): DynamicElement[] {
    return Array.from(this.dynamicElements.values()).filter(el => el.type === type);
  }

  /**
   * Elimina todos los elementos de un tipo
   *
   * @param type Tipo de elementos a eliminar
   */
  removeAllByType(type: DynamicElement['type']): void {
    this.getElementsByType(type).forEach(el => {
      this.removeElement(el.id);
    });
  }

  /**
   * Genera un ID único para elementos dinámicos
   */
  private generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

