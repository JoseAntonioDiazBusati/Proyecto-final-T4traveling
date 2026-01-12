import { Directive, ElementRef, HostListener, Input, Renderer2, OnDestroy, OnInit } from '@angular/core';

/**
 * TooltipDirective - Directiva para mostrar tooltips accesibles
 *
 * Características implementadas:
 * - Mostrar/ocultar por mouse (mouseenter/mouseleave)
 * - Mostrar/ocultar por focus (focusin/focusout) para accesibilidad
 * - Delay configurable para aparición
 * - Posicionamiento dinámico (top, bottom, left, right)
 * - aria-describedby para lectores de pantalla
 * - Creación/eliminación dinámica con Renderer2
 * - Auto-reposicionamiento si sale del viewport
 *
 * Uso:
 * <button appTooltip="Texto del tooltip" [tooltipPosition]="'top'" [tooltipDelay]="300">
 *   Hover o focus me
 * </button>
 */
@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective implements OnInit, OnDestroy {
  @Input('appTooltip') tooltipText = '';
  @Input() tooltipPosition: 'top' | 'bottom' | 'left' | 'right' = 'top';
  @Input() tooltipDelay = 200; // Delay en ms antes de mostrar

  private tooltipElement: HTMLElement | null = null;
  private tooltipId: string = '';
  private showTimeout: any = null;
  private hideTimeout: any = null;
  private isVisible = false;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {
    // Generar ID único para aria-describedby
    this.tooltipId = `tooltip-${Math.random().toString(36).substr(2, 9)}`;
  }

  ngOnInit(): void {
    // Hacer el elemento host focusable si no lo es
    const hostEl = this.el.nativeElement;
    if (!hostEl.getAttribute('tabindex') && hostEl.tagName !== 'BUTTON' && hostEl.tagName !== 'A') {
      this.renderer.setAttribute(hostEl, 'tabindex', '0');
    }
  }

  /**
   * Mostrar tooltip en mouseenter
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    if (!this.tooltipText) return;
    this.scheduleShow();
  }

  /**
   * Ocultar tooltip en mouseleave
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.scheduleHide();
  }

  /**
   * Mostrar tooltip en focusin (para accesibilidad por teclado)
   */
  @HostListener('focusin')
  onFocusIn(): void {
    if (!this.tooltipText) return;
    this.scheduleShow();
  }

  /**
   * Ocultar tooltip en focusout
   */
  @HostListener('focusout')
  onFocusOut(): void {
    this.scheduleHide();
  }

  /**
   * Ocultar tooltip con ESC para accesibilidad
   */
  @HostListener('keydown.escape')
  onEscapeKey(): void {
    this.hideTooltip();
  }

  /**
   * Programa la aparición del tooltip con delay
   */
  private scheduleShow(): void {
    this.clearTimeouts();

    this.showTimeout = setTimeout(() => {
      this.showTooltip();
    }, this.tooltipDelay);
  }

  /**
   * Programa la ocultación del tooltip
   */
  private scheduleHide(): void {
    this.clearTimeouts();

    this.hideTimeout = setTimeout(() => {
      this.hideTooltip();
    }, 100); // Pequeño delay para evitar parpadeo
  }

  /**
   * Limpia los timeouts pendientes
   */
  private clearTimeouts(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  /**
   * Muestra el tooltip creándolo dinámicamente con Renderer2
   * Demuestra: createElement, createText, appendChild, addClass, setStyle, setAttribute
   */
  private showTooltip(): void {
    if (this.isVisible || !this.tooltipText) return;

    // Crear elemento tooltip con Renderer2
    this.tooltipElement = this.renderer.createElement('div');
    const textNode = this.renderer.createText(this.tooltipText);
    this.renderer.appendChild(this.tooltipElement, textNode);

    // Configurar atributos y estilos con Renderer2
    this.renderer.setAttribute(this.tooltipElement, 'id', this.tooltipId);
    this.renderer.setAttribute(this.tooltipElement, 'role', 'tooltip');
    this.renderer.setAttribute(this.tooltipElement, 'aria-hidden', 'false');

    this.renderer.addClass(this.tooltipElement, 'tooltip');
    this.renderer.addClass(this.tooltipElement, `tooltip--${this.tooltipPosition}`);

    // Añadir al body usando Renderer2
    this.renderer.appendChild(document.body, this.tooltipElement);

    // Posicionar el tooltip
    this.positionTooltip();

    // Añadir aria-describedby al elemento host para accesibilidad
    this.renderer.setAttribute(this.el.nativeElement, 'aria-describedby', this.tooltipId);

    // Añadir clase visible con pequeño delay para animación
    setTimeout(() => {
      if (this.tooltipElement) {
        this.renderer.addClass(this.tooltipElement, 'tooltip--visible');
      }
    }, 10);

    this.isVisible = true;
  }

  /**
   * Posiciona el tooltip relativo al elemento host
   * Incluye auto-reposicionamiento si sale del viewport
   */
  private positionTooltip(): void {
    if (!this.tooltipElement) return;

    const hostPos = this.el.nativeElement.getBoundingClientRect();
    const tooltipPos = this.tooltipElement.getBoundingClientRect();

    let top = 0;
    let left = 0;
    let actualPosition: 'top' | 'bottom' | 'left' | 'right' = this.tooltipPosition;

    // Calcular posición inicial
    const positions = this.calculatePositions(hostPos, tooltipPos);

    // Verificar si cabe en la posición deseada, si no, buscar alternativa
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight
    };

    // Auto-reposicionamiento si sale del viewport
    if (!this.fitsInViewport(positions[actualPosition], tooltipPos, viewport)) {
      const alternatives: Array<'top' | 'bottom' | 'left' | 'right'> = ['top', 'bottom', 'left', 'right'];
      for (const alt of alternatives) {
        if (alt !== actualPosition && this.fitsInViewport(positions[alt], tooltipPos, viewport)) {
          actualPosition = alt;
          break;
        }
      }
    }

    top = positions[actualPosition].top;
    left = positions[actualPosition].left;

    // Aplicar estilos de posición con Renderer2
    this.renderer.setStyle(this.tooltipElement, 'position', 'fixed');
    this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
    this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
    this.renderer.setStyle(this.tooltipElement, 'z-index', '10000');

    // Actualizar clase de posición si cambió
    if (actualPosition !== this.tooltipPosition) {
      this.renderer.removeClass(this.tooltipElement, `tooltip--${this.tooltipPosition}`);
      this.renderer.addClass(this.tooltipElement, `tooltip--${actualPosition}`);
    }
  }

  /**
   * Calcula las posiciones posibles para el tooltip
   */
  private calculatePositions(
    hostPos: DOMRect,
    tooltipPos: DOMRect
  ): Record<string, { top: number; left: number }> {
    const gap = 8; // Espacio entre el host y el tooltip

    return {
      top: {
        top: hostPos.top - tooltipPos.height - gap,
        left: hostPos.left + (hostPos.width - tooltipPos.width) / 2
      },
      bottom: {
        top: hostPos.bottom + gap,
        left: hostPos.left + (hostPos.width - tooltipPos.width) / 2
      },
      left: {
        top: hostPos.top + (hostPos.height - tooltipPos.height) / 2,
        left: hostPos.left - tooltipPos.width - gap
      },
      right: {
        top: hostPos.top + (hostPos.height - tooltipPos.height) / 2,
        left: hostPos.right + gap
      }
    };
  }

  /**
   * Verifica si el tooltip cabe en el viewport
   */
  private fitsInViewport(
    pos: { top: number; left: number },
    tooltipSize: DOMRect,
    viewport: { width: number; height: number }
  ): boolean {
    return (
      pos.top >= 0 &&
      pos.left >= 0 &&
      pos.top + tooltipSize.height <= viewport.height &&
      pos.left + tooltipSize.width <= viewport.width
    );
  }

  /**
   * Oculta y elimina el tooltip del DOM
   * Demuestra: removeChild, removeAttribute
   */
  private hideTooltip(): void {
    this.clearTimeouts();

    if (this.tooltipElement) {
      // Añadir clase para animación de salida
      this.renderer.removeClass(this.tooltipElement, 'tooltip--visible');

      // Eliminar después de la animación
      setTimeout(() => {
        if (this.tooltipElement) {
          this.renderer.removeChild(document.body, this.tooltipElement);
          this.tooltipElement = null;
        }
      }, 150);

      // Eliminar aria-describedby del elemento host
      this.renderer.removeAttribute(this.el.nativeElement, 'aria-describedby');
    }

    this.isVisible = false;
  }

  /**
   * Limpieza al destruir la directiva
   */
  ngOnDestroy(): void {
    this.clearTimeouts();
    this.hideTooltip();
  }
}

