# Documentación Técnica - Fase 1: Manipulación del DOM y Eventos

## Índice
1. [Arquitectura de Eventos](#arquitectura-de-eventos)
2. [Componentes Interactivos](#componentes-interactivos)
3. [Manipulación del DOM](#manipulación-del-dom)
4. [Sistema de Temas](#sistema-de-temas)
5. [Compatibilidad de Navegadores](#compatibilidad-de-navegadores)
6. [Diagrama de Flujo](#diagrama-de-flujo)

---

## Arquitectura de Eventos

### Principios de Diseño
La arquitectura de eventos sigue el patrón de **Event-Driven Architecture** con los siguientes principios:

1. **Unidirectional Data Flow**: Los eventos fluyen desde los componentes hijos hacia los padres mediante `@Output()` EventEmitters
2. **Separation of Concerns**: La lógica de eventos está separada de la presentación
3. **Accessibility First**: Todos los componentes implementan eventos de teclado para navegación accesible
4. **Performance**: Uso de debouncing y throttling cuando es necesario

### Tipos de Eventos Implementados

#### 1. Eventos de Mouse
- `click`: Interacciones principales (botones, enlaces)
- `mouseenter` / `mouseleave`: Hover states y tooltips
- `mousedown` / `mouseup`: Drag & drop (preparado para futuras implementaciones)

#### 2. Eventos de Teclado
- `keydown.enter` / `keydown.space`: Activación de elementos interactivos
- `keydown.escape`: Cierre de modales y menús
- `keydown.tab`: Navegación por teclado y trap de foco
- `keydown.arrowUp/Down/Left/Right`: Navegación en tabs y acordeones

#### 3. Eventos de Foco
- `focus` / `blur`: Gestión de estados activos y tooltips
- `focusin` / `focusout`: Detección de foco en elementos hijos

#### 4. Eventos del Navegador
- `window:resize`: Responsive behavior
- `document:click`: Cierre de elementos al hacer click fuera
- `window:scroll`: Sticky headers y lazy loading (futuro)

### Gestión de Eventos

```typescript
// Ejemplo de gestión de eventos con prevención de comportamiento por defecto
@HostListener('document:keydown.escape')
onEscapeKey(): void {
  if (this.isOpen) {
    event.preventDefault();
    this.close();
  }
}

// Ejemplo de detección de click fuera
@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  const clickedInside = this.elementRef.nativeElement.contains(target);
  
  if (!clickedInside && this.isOpen) {
    this.close();
  }
}
```

---

## Componentes Interactivos

### 1. Theme Switcher

**Ubicación**: `src/app/components/shared/theme-switcher/`

**Características**:
- ✅ Detecta preferencia del sistema con `prefers-color-scheme`
- ✅ Persiste selección en `localStorage`
- ✅ Tres modos: light, dark, auto
- ✅ Transiciones suaves entre temas
- ✅ Actualización reactiva con Angular Signals

**Manipulación del DOM**:
```typescript
// Actualiza el atributo data-theme en el elemento raíz
document.documentElement.setAttribute('data-theme', theme);
document.documentElement.classList.add(`theme-${theme}`);
```

**Eventos**:
- Click para cambiar tema
- Listener de `matchMedia` para cambios en preferencia del sistema

**API**:
```typescript
class ThemeService {
  currentTheme: Signal<Theme>;
  appliedTheme: Signal<'light' | 'dark'>;
  
  toggleTheme(): void;
  setTheme(theme: Theme): void;
  getTheme(): Theme;
  getAppliedTheme(): 'light' | 'dark';
}
```

---

### 2. Modal Component

**Ubicación**: `src/app/components/shared/modal/`

**Características**:
- ✅ Cierre con tecla ESC
- ✅ Cierre al hacer click en el backdrop
- ✅ Gestión de foco (Focus Trap)
- ✅ Prevención de scroll del body
- ✅ Restauración de foco al cerrar
- ✅ Navegación por teclado (Tab trap)

**Manipulación del DOM**:
```typescript
// Prevenir scroll del body cuando el modal está abierto
document.body.style.overflow = 'hidden';

// Enfocar primer elemento focusable
const focusableElements = modalContent.querySelectorAll(
  'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
);
(focusableElements[0] as HTMLElement).focus();
```

**Eventos**:
- `keydown.escape`: Cierra el modal
- `keydown.tab`: Mantiene el foco dentro del modal
- `click` en backdrop: Cierra el modal (configurable)
- `@Output() closeModal`: Emite evento al cerrar
- `@Output() opened`: Emite evento al abrir
- `@Output() closed`: Emite evento después de cerrar

**Props**:
```typescript
@Input() isOpen: boolean = false;
@Input() title: string = '';
@Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
@Input() closeOnBackdrop: boolean = true;
@Input() closeOnEscape: boolean = true;
@Input() showCloseButton: boolean = true;
```

---

### 3. Accordion Component

**Ubicación**: `src/app/components/shared/accordion/`

**Características**:
- ✅ Expandir/colapsar con animación
- ✅ Modo single o multiple
- ✅ Navegación por teclado (Arrow keys, Home, End)
- ✅ Estados deshabilitados
- ✅ Animaciones suaves con CSS transitions

**Manipulación del DOM**:
```typescript
// Control de altura con max-height para animación
.accordion__content {
  max-height: 0;
  transition: max-height 0.3s ease;
  
  &--open {
    max-height: 1000px;
  }
}
```

**Eventos de Teclado**:
- `Enter` / `Space`: Expande/colapsa item
- `ArrowDown`: Navega al siguiente item
- `ArrowUp`: Navega al item anterior
- `Home`: Navega al primer item
- `End`: Navega al último item

**API**:
```typescript
interface AccordionItem {
  id: string;
  title: string;
  content: string;
  isOpen?: boolean;
  disabled?: boolean;
}

@Input() items: AccordionItem[];
@Input() allowMultiple: boolean = false;
@Input() expandFirst: boolean = false;
@Output() itemToggled: EventEmitter<{item, isOpen}>;
```

---

### 4. Tabs Component

**Ubicación**: `src/app/components/shared/tabs/`

**Características**:
- ✅ Orientación horizontal y vertical
- ✅ Navegación por teclado
- ✅ Soporte para iconos y badges
- ✅ Estados deshabilitados
- ✅ Animaciones de transición

**Manipulación del DOM**:
```typescript
// Enfoque programático de tabs
private focusTab(index: number): void {
  const button = document.getElementById(`tab-${this.tabs[index].id}`);
  button?.focus();
}
```

**Eventos de Teclado**:
- Horizontal:
  - `ArrowLeft`: Tab anterior
  - `ArrowRight`: Tab siguiente
- Vertical:
  - `ArrowUp`: Tab anterior
  - `ArrowDown`: Tab siguiente
- `Home`: Primera tab
- `End`: Última tab
- `Enter` / `Space`: Activa tab

**API**:
```typescript
interface TabItem {
  id: string;
  label: string;
  content?: string;
  icon?: string;
  disabled?: boolean;
  badge?: string | number;
}

@Input() tabs: TabItem[];
@Input() activeTabId?: string;
@Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
@Output() tabChanged: EventEmitter<TabItem>;
```

---

### 5. Tooltip Directive

**Ubicación**: `src/app/directives/tooltip.directive.ts`

**Características**:
- ✅ Muestra al hover y focus
- ✅ Posiciones: top, bottom, left, right
- ✅ Delay configurable
- ✅ Auto-posicionamiento para evitar salir de viewport
- ✅ Accessible (role="tooltip")

**Manipulación del DOM**:
```typescript
// Crea elemento tooltip dinámicamente
this.tooltipElement = this.renderer.createElement('div');
this.renderer.addClass(this.tooltipElement, 'tooltip');
this.renderer.appendChild(document.body, this.tooltipElement);

// Posicionamiento dinámico
const hostPos = this.elementRef.nativeElement.getBoundingClientRect();
this.renderer.setStyle(this.tooltipElement, 'top', `${top}px`);
this.renderer.setStyle(this.tooltipElement, 'left', `${left}px`);
```

**Eventos**:
- `mouseenter`: Muestra tooltip (con delay)
- `mouseleave`: Oculta tooltip
- `focus`: Muestra tooltip
- `blur`: Oculta tooltip

**Uso**:
```html
<button 
  appTooltip="Texto del tooltip"
  [tooltipPosition]="'top'"
  [tooltipDelay]="300">
  Hover me
</button>
```

---

### 6. Menú Hamburguesa Móvil

**Ubicación**: `src/app/components/layout/header/`

**Características**:
- ✅ Toggle con animación
- ✅ Cierre al hacer click fuera
- ✅ Cierre con tecla ESC
- ✅ Prevención de scroll cuando está abierto
- ✅ Cierre automático en pantallas grandes
- ✅ Cierre al navegar a otra ruta

**Manipulación del DOM**:
```typescript
// Prevenir scroll del body
if (this.isMenuOpen) {
  document.body.style.overflow = 'hidden';
} else {
  document.body.style.overflow = '';
}
```

**Eventos**:
- `click` en botón: Toggle menú
- `document:click`: Detecta click fuera
- `keydown.escape`: Cierra menú
- `window:resize`: Cierra en pantallas grandes
- `click` en enlaces: Cierra menú y navega

---

## Sistema de Temas

### Variables CSS Personalizadas

El sistema de temas utiliza CSS Custom Properties para permitir cambios dinámicos:

```scss
:root {
  --bg-primary: #4f46e5;
  --bg-body: #0a0a0a;
  --text-primary: #ffffff;
  --border-color: #333333;
  // ... más variables
}

[data-theme='light'] {
  --bg-body: #ffffff;
  --text-primary: #0a0a0a;
  --border-color: #e5e5e5;
  // ... más variables
}
```

### Detección de Preferencias del Sistema

```typescript
// Detectar preferencia del sistema
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

// Listener para cambios
mediaQuery.addEventListener('change', (e) => {
  if (this.currentTheme() === 'auto') {
    this.appliedTheme.set(e.matches ? 'dark' : 'light');
  }
});
```

### Persistencia

```typescript
// Guardar en localStorage
localStorage.setItem('t4traveling-theme', theme);

// Recuperar al iniciar
const savedTheme = localStorage.getItem('t4traveling-theme');
```

---

## Compatibilidad de Navegadores

### Eventos Utilizados

| Evento | Chrome | Firefox | Safari | Edge | Notas |
|--------|--------|---------|--------|------|-------|
| `click` | ✅ | ✅ | ✅ | ✅ | Universal |
| `keydown` | ✅ | ✅ | ✅ | ✅ | Universal |
| `mouseenter/leave` | ✅ | ✅ | ✅ | ✅ | Universal |
| `focus/blur` | ✅ | ✅ | ✅ | ✅ | Universal |
| `@HostListener` | ✅ | ✅ | ✅ | ✅ | Angular feature |

### APIs Web Utilizadas

| API | Chrome | Firefox | Safari | Edge | Polyfill |
|-----|--------|---------|--------|------|----------|
| `localStorage` | ✅ 4+ | ✅ 3.5+ | ✅ 4+ | ✅ 8+ | No requerido |
| `matchMedia` | ✅ 9+ | ✅ 6+ | ✅ 5.1+ | ✅ 10+ | No requerido |
| `getBoundingClientRect` | ✅ 4+ | ✅ 3+ | ✅ 4+ | ✅ 9+ | No requerido |
| `querySelector/All` | ✅ 4+ | ✅ 3.5+ | ✅ 3.1+ | ✅ 8+ | No requerido |
| `Signals (Angular)` | ✅ | ✅ | ✅ | ✅ | Angular 16+ |
| `data-*` attributes | ✅ 7+ | ✅ 6+ | ✅ 5.1+ | ✅ 10+ | No requerido |

### Características CSS

| Feature | Chrome | Firefox | Safari | Edge | Fallback |
|---------|--------|---------|--------|------|----------|
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ | Variables Sass |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ | Flexbox |
| CSS Transitions | ✅ 26+ | ✅ 16+ | ✅ 9+ | ✅ 12+ | No crítico |
| Backdrop Filter | ✅ 76+ | ✅ 103+ | ✅ 9+ | ✅ 79+ | Degradado graceful |
| `prefers-color-scheme` | ✅ 76+ | ✅ 67+ | ✅ 12.1+ | ✅ 79+ | Default theme |

### Navegadores Objetivo

- **Chrome**: 90+
- **Firefox**: 88+
- **Safari**: 14+
- **Edge**: 90+
- **Mobile Safari**: 14+
- **Chrome Android**: 90+

### Notas de Compatibilidad

1. **localStorage**: Si no está disponible, el tema no persiste pero funciona en sesión
2. **matchMedia**: Si no está disponible, usa tema por defecto (dark)
3. **CSS Variables**: Tienen fallback con variables Sass
4. **Backdrop Filter**: Si no está disponible, usa background sólido

---

## Diagrama de Flujo

### Flujo de Eventos Principal

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION                          │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    EVENT CAPTURE                             │
│  • Mouse Events (click, hover)                              │
│  • Keyboard Events (keydown, keyup)                         │
│  • Focus Events (focus, blur)                               │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                EVENT HANDLER (@HostListener)                 │
│  • Prevención de comportamiento por defecto                 │
│  • Validación de estado                                     │
│  • Propagación controlada                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  DOM MANIPULATION                            │
│  • Actualizar atributos                                     │
│  • Modificar clases                                         │
│  • Cambiar estilos inline                                   │
│  • Crear/eliminar elementos                                 │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  STATE UPDATE                                │
│  • Signals (reactive)                                       │
│  • Component state                                          │
│  • Service state (ThemeService, etc.)                       │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  SIDE EFFECTS                                │
│  • localStorage update                                      │
│  • Event emission (@Output)                                 │
│  • Analytics tracking (future)                              │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                  UI UPDATE                                   │
│  • Template re-render                                       │
│  • CSS transitions                                          │
│  • Accessibility updates (ARIA)                             │
└─────────────────────────────────────────────────────────────┘
```

### Flujo Específico: Theme Switcher

```
User clicks theme button
        │
        ▼
ThemeSwitcherComponent.toggleTheme()
        │
        ▼
ThemeService.toggleTheme()
        │
        ├─── currentTheme signal updates
        │
        ▼
Angular effect() triggered
        │
        ▼
ThemeService.applyTheme()
        │
        ├─── Check if theme is 'auto'
        │    └─── Yes: getSystemPreference()
        │    └─── No: use selected theme
        │
        ▼
updateDOMTheme()
        │
        ├─── document.documentElement.setAttribute('data-theme', theme)
        ├─── document.documentElement.classList.add(`theme-${theme}`)
        │
        ▼
storeTheme()
        │
        └─── localStorage.setItem('t4traveling-theme', theme)
        │
        ▼
CSS variables update automatically
        │
        └─── All components re-render with new theme
```

### Flujo Específico: Modal

```
User clicks "Open Modal" button
        │
        ▼
Component sets isModalOpen = true
        │
        ▼
ModalComponent.ngOnChanges() detects change
        │
        ▼
handleModalOpen()
        │
        ├─── Save currently focused element
        ├─── Set document.body.style.overflow = 'hidden'
        ├─── Emit 'opened' event
        │
        ▼
Focus first focusable element in modal
        │
        ▼
        ┌─────────────────────────────────┐
        │   User interacts with modal     │
        └─────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
    User presses ESC      User clicks backdrop
        │                       │
        └───────────┬───────────┘
                    │
                    ▼
        ModalComponent.close()
                    │
                    ▼
        Emit closeModal event
                    │
                    ▼
        Component sets isModalOpen = false
                    │
                    ▼
        handleModalClose()
                    │
                    ├─── document.body.style.overflow = ''
                    ├─── Restore focus to previous element
                    ├─── Emit 'closed' event
                    │
                    ▼
                Modal hidden
```

---

## Mejores Prácticas Implementadas

### 1. Accesibilidad
- ✅ Roles ARIA apropiados (`role="dialog"`, `role="tablist"`, etc.)
- ✅ Atributos ARIA (`aria-expanded`, `aria-controls`, `aria-selected`)
- ✅ Gestión de foco (Focus Trap en modales)
- ✅ Navegación por teclado completa
- ✅ Etiquetas descriptivas (`aria-label`)

### 2. Performance
- ✅ Event delegation donde es posible
- ✅ Uso de Signals para reactividad eficiente
- ✅ CSS transitions en lugar de JavaScript animations
- ✅ Lazy loading de componentes con rutas

### 3. Mantenibilidad
- ✅ Componentes standalone (Angular 15+)
- ✅ Separación de concerns
- ✅ Interfaces TypeScript para type safety
- ✅ Documentación inline con JSDoc
- ✅ Naming conventions consistentes

### 4. UX
- ✅ Feedback visual inmediato
- ✅ Animaciones suaves (300ms promedio)
- ✅ Estados de hover, focus, active
- ✅ Mensajes de ayuda contextual
- ✅ Comportamientos intuitivos

---

## Testing

### Eventos a Testear

```typescript
// Ejemplo de test de eventos
describe('ModalComponent', () => {
  it('should close on ESC key', () => {
    component.isOpen = true;
    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    document.dispatchEvent(event);
    expect(component.isOpen).toBe(false);
  });

  it('should trap focus within modal', () => {
    // Test de focus trap
  });
});
```

---

## Roadmap Futuro

### Fase 2 (Próxima)
- [ ] Drag & Drop
- [ ] Infinite Scroll
- [ ] Virtual Scrolling
- [ ] Gesture support (touch events)

### Mejoras Continuas
- [ ] Unit tests completos
- [ ] E2E tests con Playwright
- [ ] Performance monitoring
- [ ] Analytics de interacciones

---

## Referencias

- [MDN Web Docs - Events](https://developer.mozilla.org/en-US/docs/Web/Events)
- [Angular Event Binding](https://angular.io/guide/event-binding)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**Última actualización**: 2025-12-17
**Versión**: 1.0.0
**Autor**: T4 Traveling Dev Team

