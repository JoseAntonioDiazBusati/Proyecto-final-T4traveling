# DOCUMENTACIÓN DE ESTILOS - T4 TRAVELING

## Sección 1: Arquitectura CSS y Comunicación Visual

### 1.1 Principios de Comunicación Visual

#### 1. Jerarquía
**Cómo lo aplicamos:**
- Utilizamos una escala tipográfica modular (ratio 1.25) para crear diferencias claras entre niveles de importancia
- Los encabezados principales (h1) usan `$font-4xl` (3.815rem) en desktop y `$font-3xl` (3.052rem) en móvil
- Los títulos de sección (h2) usan `$font-3xl` en desktop y `$font-2xl` en móvil
- El texto base mantiene `$font-base` (1rem) para legibilidad óptima
- Usamos pesos tipográficos diferenciados:
  - Títulos: `$font-weight-bold` (700)
  - Subtítulos: `$font-weight-semibold` (600)
  - Texto normal: `$font-weight-regular` (400)
- El espaciado vertical entre secciones aumenta progresivamente (`$spacing-4`, `$spacing-8`, `$spacing-12`) para crear respiración visual

**Implementación en el diseño:**
- El header principal usa color naranja vibrante (#FF5D1C) con tipografía grande para máxima visibilidad
- Los destinos destacados tienen mayor tamaño y peso visual que los elementos secundarios
- La información de precios se enfatiza con color amarillo (#F5BB00) y tamaño mayor

#### 2. Contraste
**Cómo lo aplicamos:**
- Paleta de colores con alto contraste:
  - Naranja principal (#FF5D1C) sobre fondos claros
  - Texto oscuro (#000000 - #333333) sobre fondos blancos
  - Textos blancos (#FFFFFF) sobre fondos de color primario
- Contraste de tamaño entre títulos y texto base (ratio mínimo de 1.25)
- Contraste de peso: bold (700) vs regular (400)
- Sombras con diferentes niveles de intensidad para crear profundidad visual

**Implementación en el diseño:**
- Botones de acción principal en naranja con texto blanco (WCAG AAA)
- Tarjetas de destinos con fondo blanco sobre fondo neutro claro
- Íconos en colores brillantes (#F5BB00, #8EA604) contrastan con fondos neutros

#### 3. Alineación
**Nuestra estrategia:**
- Sistema de grid consistente basado en CSS Grid
- Alineación a la izquierda para texto largo (mejor legibilidad)
- Centrado para elementos destacados (títulos principales, CTAs)
- Grid de columnas para tarjetas de destinos:
  - 1 columna en móvil
  - 2 columnas en tablet (≥768px)
  - 3-4 columnas en desktop (≥1024px)
- Contenedor máximo de 1280px centrado horizontalmente
- Padding consistente: 16px móvil, 24px tablet, 32px desktop

**Implementación en el diseño:**
- Header con logo centrado y navegación alineada
- Grilla de destinos perfectamente alineada con gaps consistentes
- Formularios con campos alineados verticalmente

#### 4. Proximidad
**Cómo agrupamos elementos:**
- Sistema de espaciado basado en múltiplos de 4px
- Elementos relacionados mantienen espaciado pequeño (`$spacing-2` a `$spacing-4`)
- Grupos de contenido separados con espaciado medio (`$spacing-6` a `$spacing-8`)
- Secciones distintas separadas con espaciado grande (`$spacing-12` a `$spacing-16`)

**Ejemplos de proximidad:**
- Título de destino + descripción: `$spacing-2` (8px)
- Precio + botón de reserva: `$spacing-3` (12px)
- Tarjetas entre sí: `$spacing-6` (24px)
- Secciones diferentes: `$spacing-12` (48px)

**Implementación en el diseño:**
- Información de un mismo destino agrupada visualmente con poco espacio
- Separación clara entre diferentes destinos con mayor espaciado
- Footer separado del contenido principal con espaciado significativo

#### 5. Repetición
**Cómo creamos coherencia:**
- Componentes reutilizables con estilos consistentes
- Todos los botones principales usan el mismo estilo (mixin `button-base`)
- Tarjetas con mismo formato: border-radius consistente (`$radius-lg`), sombras (`$shadow-sm`), padding interno uniforme
- Transiciones consistentes: `$transition-base` (300ms) para la mayoría de interacciones
- Paleta de colores limitada y repetida estratégicamente
- Tipografía consistente: Roboto para texto, Montserrat para títulos

**Patrones repetidos:**
- Todas las tarjetas de destino mantienen la misma estructura visual
- Botones de acción usan siempre color primario
- Íconos del mismo tamaño y estilo en toda la aplicación
- Sombras suaves en elementos interactivos (`$shadow-sm` al reposar, `$shadow-md` al hover)

---

### 1.2 Metodología CSS: BEM (Block Element Modifier)

**¿Por qué BEM?**
BEM (Block Element Modifier) es una metodología de nomenclatura CSS que proporciona claridad, especificidad baja y reutilización. Es ideal para proyectos escalables como T4 Traveling porque:

1. **Claridad**: Los nombres de clase describen exactamente qué hace el elemento
2. **Evita conflictos**: No hay colisiones de nombres ni problemas de especificidad
3. **Mantenibilidad**: Fácil identificar a qué componente pertenece cada estilo
4. **Escalabilidad**: Funciona bien en proyectos grandes con múltiples desarrolladores
5. **Compatible con Angular**: Se integra perfectamente con la arquitectura de componentes

**Nomenclatura BEM:**

```scss
// BLOQUE: Componente independiente y reutilizable
.card { }

// ELEMENTO: Parte de un bloque, no tiene sentido fuera de él
.card__title { }
.card__image { }
.card__description { }
.card__price { }
.card__button { }

// MODIFICADOR: Variante del bloque o elemento
.card--featured { }
.card--large { }
.card__button--primary { }
.card__button--secondary { }
```

**Ejemplos de uso en T4 Traveling:**

```scss
// Componente: Tarjeta de destino
.destination-card {
  @include card-container;
  
  &__image {
    width: 100%;
    border-radius: $radius-md;
    margin-bottom: $spacing-4;
  }
  
  &__title {
    font-size: $font-xl;
    font-weight: $font-weight-bold;
    color: $color-neutral-0;
    margin-bottom: $spacing-2;
  }
  
  &__location {
    font-size: $font-sm;
    color: $color-neutral-400;
    margin-bottom: $spacing-4;
  }
  
  &__price {
    font-size: $font-2xl;
    font-weight: $font-weight-bold;
    color: $color-primary-3;
    margin-bottom: $spacing-4;
  }
  
  &__button {
    @include button-base($color-primary-0);
    width: 100%;
  }
  
  // Modificador: Tarjeta destacada
  &--featured {
    border: 2px solid $color-primary-0;
    box-shadow: $shadow-lg;
  }
  
  // Modificador: Tarjeta compacta
  &--compact {
    padding: $spacing-4;
    
    .destination-card__title {
      font-size: $font-md;
    }
  }
}

// Componente: Botón
.btn {
  @include button-base($color-primary-0);
  
  &--secondary {
    background-color: $color-secondary-1;
  }
  
  &--outline {
    background-color: transparent;
    border: 2px solid $color-primary-0;
    color: $color-primary-0;
  }
  
  &--large {
    padding: $spacing-5 $spacing-8;
    font-size: $font-lg;
  }
  
  &--small {
    padding: $spacing-2 $spacing-4;
    font-size: $font-sm;
  }
}

// Componente: Navegación
.nav {
  display: flex;
  gap: $spacing-6;
  
  &__item {
    list-style: none;
  }
  
  &__link {
    color: $color-neutral-1000;
    transition: color $transition-base;
    
    &:hover {
      color: $color-primary-3;
    }
    
    &--active {
      font-weight: $font-weight-bold;
      border-bottom: 2px solid $color-primary-3;
    }
  }
}
```

---

### 1.3 Organización de Archivos: ITCSS

**¿Qué es ITCSS?**
ITCSS (Inverted Triangle CSS) es una arquitectura que organiza CSS de menor a mayor especificidad, lo que previene problemas de cascada y facilita el mantenimiento.

**Estructura de carpetas:**

```
src/styles/
├── 00-settings/          # Variables y configuración
│   └── _variables.scss   # Design tokens (colores, tipografía, etc.)
│
├── 01-tools/            # Mixins y funciones
│   └── _mixins.scss     # Mixins reutilizables
│
├── 02-generic/          # Reset y normalize
│   └── reset.scss       # Reset CSS básico
│
├── 03-elements/         # Estilos de elementos HTML
│   └── estilo-elementos.scss  # h1, p, a, etc.
│
└── 04-layout/           # Sistema de grid y layout
    └── _layout.scss     # Contenedores, grid, flexbox

styles.scss              # Archivo principal que importa todo
```

**¿Por qué este orden?**

1. **00-settings**: Variables primero, porque todo lo demás las necesita
2. **01-tools**: Mixins y funciones que usan las variables
3. **02-generic**: Reset que no usa clases, solo selectores de elementos
4. **03-elements**: Estilos base de elementos HTML sin clases
5. **04-layout**: Sistema de layout con clases reutilizables

**Ventajas de ITCSS:**
- **Baja especificidad**: Empezamos con selectores genéricos, aumentamos gradualmente
- **Sin !important**: Nunca necesitamos forzar especificidad
- **Fácil debugging**: Sabemos exactamente dónde buscar cada tipo de estilo
- **Escalable**: Fácil añadir nuevas capas sin romper lo existente
- **Performance**: CSS más eficiente al seguir el flujo natural de cascada

**Importación en styles.scss:**

```scss
/* Orden crítico - NO cambiar */

// 1. Variables (menor especificidad)
@import 'styles/00-settings/variables';

// 2. Mixins
@import 'styles/01-tools/mixins';

// 3. Reset genérico
@import 'styles/02-generic/reset';

// 4. Elementos base
@import 'styles/03-elements/estilo-elementos';

// 5. Layout (mayor especificidad)
@import 'styles/04-layout/layout';
```

---

### 1.4 Sistema de Design Tokens

Los Design Tokens son la única fuente de verdad para propiedades visuales. Todas las variables están en `00-settings/_variables.scss`.

#### Colores

**Paleta Primaria** (basada en diseño Figma T4-Traveling)
```scss
$color-primary-0: #FF5D1C;  // Naranja principal - CTA, headers
$color-primary-1: #BF3100;  // Naranja oscuro - hover, énfasis
$color-primary-2: #EC9F05;  // Amarillo-naranja - acentos
$color-primary-3: #F5BB00;  // Amarillo - precios, destacados
$color-primary-4: #8EA604;  // Verde-amarillo - éxito, disponibilidad
```

**Decisión:** Esta paleta cálida transmite energía, aventura y entusiasmo - perfecto para una agencia de viajes. El naranja (#FF5D1C) es el color principal porque atrae la atención y genera acción (ideal para CTAs).

**Paleta Secundaria**
```scss
$color-secondary-0: #FFF2C7;  // Crema claro - fondos suaves
$color-secondary-1: #812100;  // Marrón oscuro - contraste
$color-secondary-2: #C4EAF5;  // Azul claro - información
```

**Decisión:** Colores secundarios que complementan sin competir con los primarios. El crema (#FFF2C7) proporciona fondos cálidos y acogedores.

**Colores Semánticos**
```scss
$color-error: #F44930;    // Rojo - errores, validaciones
$color-success: #8DCC52;  // Verde - confirmaciones
$color-warning: #EC9F05;  // Naranja - advertencias
$color-info: #00CFFD;     // Azul - información
```

**Decisión:** Colores universalmente reconocidos para estados de interfaz (rojo=error, verde=éxito), garantizando UX intuitiva.

**Escala de Neutrales**
```scss
$color-neutral-0: #000000;      // Negro - texto principal
$color-neutral-100: #333333;    // Texto secundario
$color-neutral-400: #808080;    // Texto deshabilitado
$color-neutral-700: #CCCCCC;    // Bordes
$color-neutral-900: #F5F5F5;    // Fondos claros
$color-neutral-1000: #FFFFFF;   // Blanco - fondo principal
```

**Decisión:** Escala completa para texto, bordes y fondos con contraste adecuado (WCAG AA mínimo).

---

#### Tipografía

**Familias de Fuentes**
```scss
$font-primary: 'Roboto', sans-serif;      // Texto general
$font-secondary: 'Montserrat', sans-serif; // Títulos
```

**Decisión:** 
- **Roboto**: Legible, moderna, optimizada para pantallas. Google Fonts (gratuita y CDN rápido)
- **Montserrat**: Geométrica y elegante para títulos, crea contraste visual con Roboto

**Escala Tipográfica** (Ratio 1.25 - Escala Mayor Tercera)
```scss
$font-xs: 0.64rem;     // 10.24px - Etiquetas pequeñas
$font-sm: 0.8rem;      // 12.8px - Texto pequeño
$font-base: 1rem;      // 16px - Texto base (accesibilidad)
$font-md: 1.25rem;     // 20px - Subtítulos
$font-lg: 1.563rem;    // 25px - Títulos pequeños
$font-xl: 1.953rem;    // 31.25px - Títulos medianos
$font-2xl: 2.441rem;   // 39px - Títulos grandes
$font-3xl: 3.052rem;   // 48.83px - Hero titles
$font-4xl: 3.815rem;   // 61px - Display titles
$font-5xl: 4.768rem;   // 76.29px - Hero principal
```

**Decisión:** Ratio 1.25 crea saltos visuales claros sin ser demasiado agresivos. Base de 16px garantiza legibilidad en todos los dispositivos y cumple estándares de accesibilidad.

**Pesos Tipográficos**
```scss
$font-weight-light: 300;      // Textos sutiles
$font-weight-regular: 400;    // Texto normal
$font-weight-medium: 500;     // Énfasis sutil
$font-weight-semibold: 600;   // Subtítulos
$font-weight-bold: 700;       // Títulos principales
```

**Line Heights**
```scss
$line-height-tight: 1.2;      // Títulos (menos espacio)
$line-height-normal: 1.5;     // Texto base (legibilidad)
$line-height-relaxed: 1.75;   // Párrafos largos (lectura cómoda)
```

**Decisión:** Line-height adaptado al tipo de contenido. Títulos compactos (1.2) vs párrafos espaciados (1.75) mejora legibilidad.

---

#### Espaciado

**Sistema basado en 4px** (mejor para divisibilidad)
```scss
$spacing-1: 0.25rem;   // 4px
$spacing-2: 0.5rem;    // 8px
$spacing-3: 0.75rem;   // 12px
$spacing-4: 1rem;      // 16px
$spacing-5: 1.25rem;   // 20px
$spacing-6: 1.5rem;    // 24px
$spacing-8: 2rem;      // 32px
$spacing-10: 2.5rem;   // 40px
$spacing-12: 3rem;     // 48px
$spacing-16: 4rem;     // 64px
$spacing-20: 5rem;     // 80px
$spacing-24: 6rem;     // 96px
```

**Decisión:** Sistema de 4px porque:
- Se adapta bien a la mayoría de tamaños de pantalla
- Facilita cálculos y alineación
- Suficiente granularidad sin ser excesivo
- Compatible con el base-16 de rem

**Uso recomendado:**
- Elementos muy próximos: `$spacing-1` a `$spacing-3`
- Elementos relacionados: `$spacing-4` a `$spacing-6`
- Grupos de contenido: `$spacing-8` a `$spacing-12`
- Secciones principales: `$spacing-16` a `$spacing-24`

---

#### Breakpoints

```scss
$breakpoint-sm: 640px;    // Móvil grande (iPhone Pro Max)
$breakpoint-md: 768px;    // Tablet (iPad)
$breakpoint-lg: 1024px;   // Desktop (laptop estándar)
$breakpoint-xl: 1280px;   // Desktop grande
$breakpoint-2xl: 1536px;  // Pantallas muy grandes
```

**Decisión:** Breakpoints basados en dispositivos reales más comunes:
- **640px**: Cubre móviles grandes (90% de smartphones modernos)
- **768px**: Tablets en portrait (iPads, Android tablets)
- **1024px**: Laptops estándar (punto crítico desktop)
- **1280px**: Monitores HD comunes
- **1536px**: Monitores 2K/4K

Mobile-first approach: estilos base para móvil, mejoras progresivas para pantallas mayores.

---

#### Elevaciones (Sombras)

```scss
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
$shadow-md: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
$shadow-lg: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
$shadow-xl: 0 19px 38px rgba(0, 0, 0, 0.30), 0 15px 12px rgba(0, 0, 0, 0.22);
```

**Decisión:** Sistema de sombras basado en Material Design (probado y efectivo):
- **sm**: Tarjetas en reposo, elementos sutilmente elevados
- **md**: Tarjetas en hover, elementos interactivos
- **lg**: Modales, dropdowns, elementos flotantes
- **xl**: Popups principales, notificaciones importantes

Sombras con dos capas (blur + offset) crean profundidad más realista.

---

#### Bordes y Radios

```scss
// Grosores de borde
$border-thin: 1px;      // Bordes sutiles
$border-medium: 2px;    // Bordes estándar
$border-thick: 4px;     // Bordes prominentes

// Radios de borde
$radius-sm: 2px;        // Radio mínimo
$radius-md: 4px;        // Radio estándar (botones, inputs)
$radius-lg: 8px;        // Radio medio (tarjetas)
$radius-xl: 12px;       // Radio grande
$radius-2xl: 16px;      // Radio muy grande
$radius-full: 9999px;   // Círculos perfectos
```

**Decisión:** 
- `$radius-md` (4px) como estándar: moderno sin ser excesivo
- `$radius-lg` (8px) para tarjetas: suficiente suavidad visual
- `$radius-full` (9999px) para botones circulares, avatares

---

#### Transiciones

```scss
$transition-fast: 150ms ease-in-out;    // Cambios rápidos
$transition-base: 300ms ease-in-out;    // Transición estándar
$transition-slow: 500ms ease-in-out;    // Animaciones complejas
```

**Decisión:** 
- **150ms**: Hovers simples, cambios de color (percepción instantánea)
- **300ms**: Estándar de UX (equilibrio perfecto entre velocidad y suavidad)
- **500ms**: Animaciones complejas, transiciones de página

Ease-in-out para movimientos naturales (aceleración + desaceleración).

---

### 1.5 Mixins y Funciones

Todos los mixins están en `01-tools/_mixins.scss`.

#### 1. Mixin: `respond-to`
**Propósito:** Simplificar media queries responsive

```scss
@mixin respond-to($breakpoint) {
  @if $breakpoint == 'sm' {
    @media (min-width: $breakpoint-sm) { @content; }
  } @else if $breakpoint == 'md' {
    @media (min-width: $breakpoint-md) { @content; }
  } @else if $breakpoint == 'lg' {
    @media (min-width: $breakpoint-lg) { @content; }
  } @else if $breakpoint == 'xl' {
    @media (min-width: $breakpoint-xl) { @content; }
  }
}
```

**Ejemplo de uso:**
```scss
.destination-card {
  padding: $spacing-4;
  
  @include respond-to('md') {
    padding: $spacing-6; // Más padding en tablet
  }
  
  @include respond-to('lg') {
    padding: $spacing-8; // Aún más en desktop
  }
}
```

**Beneficio:** Código más limpio y consistente. Evita errores al escribir media queries manualmente.

---

#### 2. Mixin: `flex-center`
**Propósito:** Centrar contenido con flexbox (patrón común)

```scss
@mixin flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

**Ejemplo de uso:**
```scss
.modal {
  @include flex-center;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
}

.button-icon {
  @include flex-center;
  width: 40px;
  height: 40px;
  border-radius: $radius-full;
}
```

**Beneficio:** Elimina repetición de código. Centra perfectamente en horizontal y vertical con una línea.

---

#### 3. Mixin: `button-base`
**Propósito:** Estilos base reutilizables para botones

```scss
@mixin button-base($bg-color, $text-color: $color-neutral-1000, $padding: $spacing-3 $spacing-6) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: $padding;
  background-color: $bg-color;
  color: $text-color;
  border: none;
  border-radius: $radius-md;
  font-weight: $font-weight-medium;
  cursor: pointer;
  transition: all $transition-base;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: $shadow-md;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
```

**Ejemplo de uso:**
```scss
.btn-primary {
  @include button-base($color-primary-0);
}

.btn-secondary {
  @include button-base($color-secondary-1, $color-neutral-1000);
}

.btn-large {
  @include button-base($color-primary-0, $color-neutral-1000, $spacing-5 $spacing-10);
}
```

**Beneficio:** Todos los botones mantienen comportamiento consistente (hover, disabled) automáticamente.

---

#### 4. Mixin: `card-container`
**Propósito:** Estilos base para tarjetas

```scss
@mixin card-container($padding: $spacing-6, $shadow: $shadow-sm) {
  background-color: $color-neutral-1000;
  border-radius: $radius-lg;
  padding: $padding;
  box-shadow: $shadow;
  transition: box-shadow $transition-base;
  
  &:hover {
    box-shadow: $shadow-md;
  }
}
```

**Ejemplo de uso:**
```scss
.destination-card {
  @include card-container;
}

.user-profile-card {
  @include card-container($spacing-8, $shadow-md);
}
```

**Beneficio:** Todas las tarjetas mantienen estilo visual coherente.

---

#### 5. Mixin: `truncate-text`
**Propósito:** Truncar texto con ellipsis

```scss
@mixin truncate-text($lines: 1) {
  @if $lines == 1 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  } @else {
    display: -webkit-box;
    -webkit-line-clamp: $lines;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
}
```

**Ejemplo de uso:**
```scss
.destination-title {
  @include truncate-text(1); // Una línea
}

.destination-description {
  @include truncate-text(3); // Tres líneas máximo
}
```

**Beneficio:** Previene que textos largos rompan el diseño. Especialmente útil en tarjetas de tamaño fijo.

---

#### 6. Mixin: `visually-hidden`
**Propósito:** Ocultar visualmente pero mantener accesibilidad (screen readers)

```scss
@mixin visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

**Ejemplo de uso:**
```scss
.skip-to-content {
  @include visually-hidden;
  
  &:focus {
    // Mostrar al recibir foco (navegación por teclado)
    position: static;
    width: auto;
    height: auto;
  }
}
```

**Beneficio:** Mejora accesibilidad sin afectar diseño visual.

---

#### 7. Función: `spacing`
**Propósito:** Calcular espaciado basado en unidad base

```scss
@function spacing($multiplier) {
  @return $spacing-1 * $multiplier;
}
```

**Ejemplo de uso:**
```scss
.custom-element {
  margin-bottom: spacing(6); // 24px (4px * 6)
  padding: spacing(4) spacing(8); // 16px 32px
}
```

**Beneficio:** Permite espaciados personalizados manteniendo consistencia con el sistema de 4px.

---

### 1.6 ViewEncapsulation en Angular

**Estrategia elegida: Emulated (por defecto)**

```typescript
@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.component.html',
  styleUrls: ['./destination-card.component.scss'],
  encapsulation: ViewEncapsulation.Emulated // Por defecto, no hace falta especificar
})
```

**Justificación:**

✅ **Ventajas de ViewEncapsulation.Emulated:**
1. **Aislamiento de estilos**: Cada componente tiene sus estilos encapsulados, no afectan al resto de la aplicación
2. **Evita colisiones**: Puedes usar nombres de clase simples (`.card`, `.button`) sin preocuparte por conflictos
3. **Mantenibilidad**: Modificar estilos de un componente no rompe otros componentes
4. **Compatible con Shadow DOM**: Simula Shadow DOM sin necesitar soporte nativo del navegador
5. **Funciona con BEM**: Se complementa perfectamente - BEM para organización, Emulated para encapsulación técnica

❌ **Por qué NO usar ViewEncapsulation.None:**
1. Los estilos del componente serían globales (contaminarían otros componentes)
2. Perdemos el beneficio de modularización de Angular
3. Mayor riesgo de efectos secundarios no deseados
4. Más difícil de depurar (no sabemos qué componente aplica qué estilos)

**Casos donde usaríamos ViewEncapsulation.None:**
- Componentes de layout global (header, footer)
- Estilos que intencionalmente deben ser globales
- Integraciones con librerías de terceros que requieren estilos globales

**Estrategia híbrida implementada:**

```typescript
// Componentes específicos: Emulated (defecto)
@Component({
  selector: 'app-destination-card',
  styleUrls: ['./destination-card.component.scss']
  // Emulated por defecto
})

// Layout global: None (excepciones)
@Component({
  selector: 'app-header',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
```

**Flujo de estilos en la aplicación:**

1. **styles.scss (global)**: Variables, mixins, reset, elementos base, utilidades de layout
2. **Componentes individuales (encapsulated)**: Estilos específicos del componente usando BEM
3. **Mixins compartidos**: Accesibles desde cualquier componente vía import de variables

**Ejemplo práctico:**

```scss
// destination-card.component.scss (Encapsulated)
@import '../../../styles/00-settings/variables';
@import '../../../styles/01-tools/mixins';

// Estos estilos solo afectarán a este componente
.destination-card {
  @include card-container;
  
  &__title {
    font-size: $font-xl;
    color: $color-neutral-0;
  }
  
  &__button {
    @include button-base($color-primary-0);
  }
}
```

Angular generará atributos únicos como `_ngcontent-abc-123` para aislar estos estilos.

**Conclusión:**
Mantenemos **ViewEncapsulation.Emulated** en todos los componentes por defecto. Solo usaremos `.None` en casos excepcionales y documentados, como layouts globales donde la encapsulación impediría el funcionamiento correcto.

---

## Resumen de Implementación

### ✅ Checklist Fase 1 Completada:

- [x] Sistema de Design Tokens (variables SCSS completas)
- [x] Paleta de colores primarios, secundarios, semánticos y neutrales
- [x] Escala tipográfica con familias, tamaños, pesos y line-heights
- [x] Sistema de espaciado basado en 4px
- [x] Breakpoints responsive
- [x] Sistema de elevaciones (sombras)
- [x] Bordes y radios
- [x] Transiciones
- [x] Mixins reutilizables (mínimo 3, implementados 7)
- [x] Organización ITCSS completa
- [x] Reset CSS implementado
- [x] Estilos base de elementos HTML
- [x] Sistema de grid con CSS Grid y Flexbox
- [x] Documentación completa con justificaciones
- [x] Metodología BEM documentada con ejemplos
- [x] ViewEncapsulation explicado y justificado

### 📁 Estructura de archivos generada:

```
frontend/src/
├── styles/
│   ├── 00-settings/
│   │   └── _variables.scss ✅
│   ├── 01-tools/
│   │   └── _mixins.scss ✅
│   ├── 02-generic/
│   │   └── reset.scss ✅
│   ├── 03-elements/
│   │   └── estilo-elementos.scss ✅
│   └── 04-layout/
│       └── _layout.scss ✅
└── styles.scss ✅

docs/design/
└── Documentacion.md ✅
```

### 🎨 Design Tokens definidos:
- 18 colores (primarios, secundarios, semánticos, neutrales)
- 2 familias tipográficas
- 10 tamaños de fuente
- 5 pesos tipográficos
- 3 line-heights
- 13 niveles de espaciado
- 5 breakpoints responsive
- 4 niveles de sombras
- 3 grosores de borde
- 6 radios de borde
- 3 duraciones de transición

### 🛠️ Mixins y funciones:
1. `respond-to` - Media queries responsive
2. `flex-center` - Centrado con flexbox
3. `button-base` - Botones reutilizables
4. `card-container` - Tarjetas consistentes
5. `truncate-text` - Truncado de texto
6. `visually-hidden` - Accesibilidad
7. `spacing` - Función de espaciado

---

---

## Sección 2: HTML Semántico y Estructura

### 2.1 Elementos Semánticos Utilizados

El uso de HTML semántico mejora la accesibilidad, el SEO y la mantenibilidad del código. A continuación se explican los elementos semánticos utilizados en T4 Traveling y su propósito específico.

#### `<header>` - Encabezado Principal

**Propósito:** Contiene el logo, navegación principal y utilidades del sitio.

**Ubicación:** Componente `HeaderComponent` (`app-header`)

**Ejemplo de implementación:**

```html
<header class="header">
  <div class="header__container container">
    <!-- Logo -->
    <div class="header__logo">
      <a routerLink="/" aria-label="Ir a la página principal">
        <img src="/assets/images/logo.svg" alt="T4 Traveling" />
        <span>T4 Traveling</span>
      </a>
    </div>

    <!-- Navegación principal -->
    <nav class="header__nav" aria-label="Navegación principal">
      <ul class="header__nav-list">
        <li><a routerLink="/">Inicio</a></li>
        <li><a routerLink="/destinos">Destinos</a></li>
        <li><a routerLink="/transportes">Transportes</a></li>
        <li><a routerLink="/reservas">Mis Reservas</a></li>
        <li><a routerLink="/contacto">Contacto</a></li>
      </ul>
    </nav>

    <!-- Utilidades -->
    <div class="header__utilities">
      <button aria-label="Buscar destinos">🔍</button>
      <button aria-label="Cuenta de usuario">👤</button>
    </div>
  </div>
</header>
```

**Características clave:**
- ✅ Etiqueta semántica `<header>`
- ✅ Logo con enlace a home
- ✅ `<nav>` con `aria-label` descriptivo
- ✅ Botones con `aria-label` para accesibilidad
- ✅ Estructura responsive con menú hamburguesa en móvil

---

#### `<nav>` - Navegación

**Propósito:** Define una sección de navegación principal o secundaria.

**Cuándo usarlo:**
- Navegación principal del sitio (header)
- Navegación de pie de página
- Breadcrumbs
- Menús de filtros

**Ejemplo de navegación principal:**

```html
<nav class="header__nav" aria-label="Navegación principal">
  <ul class="header__nav-list">
    <li class="header__nav-item">
      <a routerLink="/" 
         class="header__nav-link" 
         routerLinkActive="header__nav-link--active"
         [routerLinkActiveOptions]="{exact: true}">
        Inicio
      </a>
    </li>
    <!-- Más items... -->
  </ul>
</nav>
```

**Ejemplo de navegación footer:**

```html
<nav class="footer__nav" aria-label="Enlaces rápidos">
  <ul class="footer__nav-list">
    <li><a routerLink="/destinos">Destinos</a></li>
    <li><a routerLink="/transportes">Transportes</a></li>
  </ul>
</nav>
```

**Buenas prácticas:**
- ✅ Siempre incluir `aria-label` descriptivo para distinguir múltiples navegaciones
- ✅ Usar listas `<ul>` dentro de `<nav>` (mejora accesibilidad con lectores de pantalla)
- ✅ Indicar visualmente el enlace activo con clases (`routerLinkActive`)

---

#### `<main>` - Contenido Principal

**Propósito:** Contiene el contenido principal único de la página. Solo debe haber **UNO** por página.

**Ubicación:** Componente `MainComponent` (`app-main`)

**Ejemplo de implementación:**

```html
<main class="main">
  <ng-content></ng-content>
</main>
```

**Uso en la aplicación principal:**

```html
<!-- app.component.html -->
<app-header></app-header>
<app-main>
  <!-- Aquí va el contenido específico de cada página -->
  <router-outlet></router-outlet>
</app-main>
<app-footer></app-footer>
```

**Reglas importantes:**
- ✅ Solo un `<main>` por página
- ✅ Debe contener el contenido principal (excluye header, footer, sidebars secundarios)
- ✅ No debe estar dentro de `<article>`, `<aside>`, `<footer>`, `<header>` o `<nav>`
- ✅ Permite a lectores de pantalla saltar directamente al contenido principal

---

#### `<article>` - Contenido Independiente

**Propósito:** Contenido que tiene sentido por sí mismo (puede ser distribuido independientemente).

**Cuándo usarlo:**
- Posts de blog
- Tarjetas de destinos
- Comentarios de usuarios
- Noticias individuales

**Ejemplo - Tarjeta de Destino:**

```html
<article class="destination-card">
  <header class="destination-card__header">
    <h2 class="destination-card__title">París, Francia</h2>
    <p class="destination-card__location">Europa Occidental</p>
  </header>
  
  <img src="paris.jpg" alt="Torre Eiffel en París" class="destination-card__image" />
  
  <div class="destination-card__content">
    <p class="destination-card__description">
      Descubre la ciudad del amor con sus icónicos monumentos...
    </p>
    <p class="destination-card__price">Desde 899€</p>
  </div>
  
  <footer class="destination-card__footer">
    <button class="destination-card__button">Ver Detalles</button>
  </footer>
</article>
```

**Nota:** `<article>` puede contener su propio `<header>` y `<footer>` internos (no confundir con el header/footer de página).

---

#### `<section>` - Sección Temática

**Propósito:** Agrupa contenido temáticamente relacionado. Generalmente tiene un encabezado.

**Cuándo usarlo:**
- Secciones de la página principal (hero, destinos destacados, testimonios)
- Capítulos de un artículo largo
- Diferentes categorías en una página de listado

**Ejemplo - Página de Inicio:**

```html
<main class="main">
  <!-- Sección Hero -->
  <section class="hero">
    <h1 class="hero__title">Descubre el Mundo con T4 Traveling</h1>
    <p class="hero__subtitle">Tu aventura comienza aquí</p>
    <button class="hero__cta">Explorar Destinos</button>
  </section>

  <!-- Sección Destinos Destacados -->
  <section class="featured-destinations">
    <div class="container">
      <h2 class="featured-destinations__heading">Destinos Destacados</h2>
      <p class="featured-destinations__intro">Los lugares más populares</p>
      
      <div class="featured-destinations__grid">
        <article class="destination-card">...</article>
        <article class="destination-card">...</article>
        <article class="destination-card">...</article>
      </div>
    </div>
  </section>

  <!-- Sección Cómo Funciona -->
  <section class="how-it-works">
    <div class="container">
      <h2 class="how-it-works__heading">¿Cómo Funciona?</h2>
      
      <div class="how-it-works__steps">
        <article class="step">
          <h3 class="step__title">1. Elige tu destino</h3>
          <p class="step__description">...</p>
        </article>
        <!-- Más pasos... -->
      </div>
    </div>
  </section>
</main>
```

**Regla de oro:** Si el contenido necesita un título/encabezado (`<h2>`, `<h3>`, etc.), probablemente debería estar en una `<section>`.

---

#### `<aside>` - Contenido Secundario

**Propósito:** Contenido tangencialmente relacionado con el contenido principal.

**Ubicación:** Componente `SidebarComponent` (`app-sidebar`)

**Cuándo usarlo:**
- Barras laterales con filtros
- Publicidad
- Widgets (artículos relacionados, enlaces destacados)
- Navegación secundaria

**Ejemplo - Sidebar de Filtros:**

```html
<div class="page-layout">
  <aside class="sidebar">
    <h2 class="sidebar__heading">Filtrar Destinos</h2>
    
    <!-- Filtro por precio -->
    <section class="filter-group">
      <h3 class="filter-group__title">Precio</h3>
      <label>
        <input type="checkbox" /> Hasta 500€
      </label>
      <label>
        <input type="checkbox" /> 500€ - 1000€
      </label>
    </section>

    <!-- Filtro por continente -->
    <section class="filter-group">
      <h3 class="filter-group__title">Continente</h3>
      <label>
        <input type="checkbox" /> Europa
      </label>
      <label>
        <input type="checkbox" /> Asia
      </label>
    </section>
  </aside>

  <main class="main-content">
    <!-- Listado de destinos -->
  </main>
</div>
```

**Implementación del componente:**

```html
<!-- sidebar.component.html -->
<aside class="sidebar" [class.sidebar--right]="position === 'right'">
  <ng-content></ng-content>
</aside>
```

**Características:**
- ✅ Position sticky para seguir al usuario al hacer scroll
- ✅ Scrollbar personalizado si el contenido es muy largo
- ✅ Configurable para posición izquierda o derecha

---

#### `<footer>` - Pie de Página

**Propósito:** Información de cierre de la página (enlaces legales, contacto, copyright).

**Ubicación:** Componente `FooterComponent` (`app-footer`)

**Ejemplo de implementación:**

```html
<footer class="footer">
  <div class="footer__container container">
    <!-- Contenido principal del footer -->
    <div class="footer__content">
      <!-- Columna 1: Sobre nosotros -->
      <div class="footer__column">
        <h3 class="footer__heading">T4 Traveling</h3>
        <p class="footer__description">
          Tu agencia de viajes de confianza...
        </p>
        <!-- Redes sociales -->
        <div class="footer__social">
          <a href="https://facebook.com" aria-label="Facebook">📘</a>
          <a href="https://twitter.com" aria-label="Twitter">🐦</a>
        </div>
      </div>

      <!-- Columna 2: Enlaces rápidos -->
      <div class="footer__column">
        <h3 class="footer__heading">Enlaces Rápidos</h3>
        <nav aria-label="Enlaces rápidos">
          <ul>
            <li><a routerLink="/">Inicio</a></li>
            <li><a routerLink="/destinos">Destinos</a></li>
          </ul>
        </nav>
      </div>

      <!-- Columna 3: Legal -->
      <div class="footer__column">
        <h3 class="footer__heading">Legal</h3>
        <nav aria-label="Información legal">
          <ul>
            <li><a routerLink="/terminos">Términos y Condiciones</a></li>
            <li><a routerLink="/privacidad">Política de Privacidad</a></li>
            <li><a routerLink="/cookies">Política de Cookies</a></li>
          </ul>
        </nav>
      </div>

      <!-- Columna 4: Contacto -->
      <div class="footer__column">
        <h3 class="footer__heading">Contacto</h3>
        <address class="footer__contact">
          <p>📍 Calle Ejemplo, 123, Madrid</p>
          <p>📞 <a href="tel:+34912345678">+34 912 345 678</a></p>
          <p>✉️ <a href="mailto:info@t4traveling.com">info@t4traveling.com</a></p>
        </address>
      </div>
    </div>

    <!-- Separador -->
    <hr class="footer__divider" />

    <!-- Copyright -->
    <div class="footer__bottom">
      <p class="footer__copyright">
        &copy; 2025 T4 Traveling. Todos los derechos reservados.
      </p>
    </div>
  </div>
</footer>
```

**Características del footer:**
- ✅ Grid responsive (1 col móvil → 2 cols tablet → 4 cols desktop)
- ✅ Navegaciones secundarias con `aria-label`
- ✅ Etiqueta `<address>` para información de contacto
- ✅ Enlaces a redes sociales con iconos y `aria-label`
- ✅ Copyright dinámico con año actual

---

### 2.2 Jerarquía de Headings

La jerarquía correcta de encabezados (`<h1>` a `<h6>`) es **crítica** para:
- **Accesibilidad**: Lectores de pantalla navegan por encabezados
- **SEO**: Los motores de búsqueda usan la jerarquía para entender la estructura
- **Usabilidad**: Usuarios escanean visualmente los encabezados

#### Reglas Fundamentales

1. ✅ **Solo un `<h1>` por página**
   - Representa el título principal del contenido
   - Debe describir el propósito de la página

2. ✅ **No saltar niveles**
   - Correcto: h1 → h2 → h3
   - ❌ Incorrecto: h1 → h3 (saltamos h2)

3. ✅ **Usar niveles por jerarquía, no por tamaño visual**
   - Si necesitas un h3 con aspecto de h1, usa CSS para cambiar el tamaño
   - NO uses h1 solo porque quieres texto grande

4. ✅ **Orden lógico descendente**
   - h2 es subsección de h1
   - h3 es subsección de h2
   - Y así sucesivamente

#### Diagrama de Jerarquía - T4 Traveling

```
📄 PÁGINA: Home (/)
│
├── <h1> Descubre el Mundo con T4 Traveling
│
├── <section> Hero
│   └── [El h1 está aquí]
│
├── <section> Destinos Destacados
│   ├── <h2> Destinos Destacados
│   │
│   ├── <article> Destino 1
│   │   └── <h3> París, Francia
│   │
│   ├── <article> Destino 2
│   │   └── <h3> Tokyo, Japón
│   │
│   └── <article> Destino 3
│       └── <h3> Nueva York, EE.UU.
│
├── <section> Cómo Funciona
│   ├── <h2> ¿Cómo Funciona?
│   │
│   ├── <article> Paso 1
│   │   └── <h3> Elige tu Destino
│   │
│   ├── <article> Paso 2
│   │   └── <h3> Selecciona tu Transporte
│   │
│   └── <article> Paso 3
│       └── <h3> Confirma tu Reserva
│
└── <section> Testimonios
    ├── <h2> Lo que Dicen Nuestros Clientes
    │
    ├── <article> Testimonio 1
    │   ├── <h3> María González
    │   └── <p> Comentario...
    │
    └── <article> Testimonio 2
        ├── <h3> Juan Pérez
        └── <p> Comentario...

---

📄 PÁGINA: Listado de Destinos (/destinos)
│
├── <h1> Todos los Destinos
│
├── <section> Filtros
│   ├── <h2> Filtrar Resultados
│   │
│   ├── <h3> Por Precio
│   ├── <h3> Por Continente
│   └── <h3> Por Categoría
│
└── <section> Resultados
    ├── <h2> 24 Destinos Encontrados
    │
    ├── <article> Destino
    │   ├── <h3> Roma, Italia
    │   └── <h4> Paquete Todo Incluido
    │
    └── <article> Destino
        ├── <h3> Barcelona, España
        └── <h4> Escapada de Fin de Semana

---

📄 PÁGINA: Detalle de Destino (/destinos/paris)
│
├── <h1> París, Francia
│
├── <section> Galería
│   └── <h2> Galería de Fotos
│
├── <section> Descripción
│   ├── <h2> Sobre el Destino
│   │
│   ├── <h3> Qué Ver
│   │   ├── <h4> Torre Eiffel
│   │   ├── <h4> Museo del Louvre
│   │   └── <h4> Arco del Triunfo
│   │
│   └── <h3> Qué Hacer
│       ├── <h4> Crucero por el Sena
│       └── <h4> Tour gastronómico
│
├── <section> Paquetes
│   ├── <h2> Paquetes Disponibles
│   │
│   ├── <article>
│   │   ├── <h3> Paquete Básico
│   │   └── <h4> Incluye: Vuelo + Hotel
│   │
│   └── <article>
│       ├── <h3> Paquete Premium
│       └── <h4> Incluye: Vuelo + Hotel + Tours
│
└── <section> Opiniones
    ├── <h2> Opiniones de Viajeros
    │
    └── <article>
        ├── <h3> María López - ⭐⭐⭐⭐⭐
        └── <p> Experiencia increíble...
```

#### Ejemplos de Código

**✅ CORRECTO - Página de inicio:**

```html
<main class="main">
  <!-- Sección Hero con h1 -->
  <section class="hero">
    <h1 class="hero__title">Descubre el Mundo con T4 Traveling</h1>
    <p class="hero__subtitle">Tu aventura comienza aquí</p>
  </section>

  <!-- Sección de destinos con h2 -->
  <section class="featured-destinations">
    <h2 class="section-heading">Destinos Destacados</h2>
    
    <div class="destinations-grid">
      <!-- Cada destino es h3 (subsección de h2) -->
      <article class="destination-card">
        <h3 class="destination-card__title">París, Francia</h3>
        <p class="destination-card__description">...</p>
      </article>
      
      <article class="destination-card">
        <h3 class="destination-card__title">Tokyo, Japón</h3>
        <p class="destination-card__description">...</p>
      </article>
    </div>
  </section>

  <!-- Otra sección principal con h2 -->
  <section class="how-it-works">
    <h2 class="section-heading">¿Cómo Funciona?</h2>
    
    <!-- Pasos con h3 (subsección de h2) -->
    <article class="step">
      <h3 class="step__title">1. Elige tu Destino</h3>
      <p class="step__description">...</p>
    </article>

    <article class="step">
      <h3 class="step__title">2. Reserva tu Viaje</h3>
      <p class="step__description">...</p>
    </article>
  </section>
</main>
```

**❌ INCORRECTO - Salto de niveles:**

```html
<main>
  <h1>Título Principal</h1>
  
  <!-- ❌ ERROR: Saltamos directamente de h1 a h3 -->
  <h3>Subtítulo</h3>
  
  <!-- Debería ser h2 -->
</main>
```

**❌ INCORRECTO - Múltiples h1:**

```html
<main>
  <h1>Página de Destinos</h1>
  
  <section>
    <!-- ❌ ERROR: Segundo h1 en la misma página -->
    <h1>Destinos de Europa</h1>
  </section>
  
  <!-- Debería ser h2 -->
</main>
```

#### Ajustar Tamaño Visual con CSS

Si necesitas que un `<h3>` se vea como un `<h1>`, usa CSS:

```html
<!-- HTML semántico correcto -->
<article class="blog-post">
  <h3 class="blog-post__title blog-post__title--large">
    Título del Post
  </h3>
</article>
```

```scss
// CSS para controlar el tamaño visual
.blog-post__title {
  font-size: $font-lg; // Tamaño base de h3
  
  // Modificador para tamaño grande (aspecto de h1)
  &--large {
    font-size: $font-4xl; // Tamaño visual de h1
  }
}
```

**Regla de oro:** El nivel de heading depende de la estructura del documento, NO del diseño visual.

---

### 2.3 Estructura de Formularios

Los formularios accesibles y bien estructurados son fundamentales para la experiencia de usuario. T4 Traveling implementa formularios siguiendo las mejores prácticas de HTML semántico y accesibilidad.

#### Elementos Fundamentales

##### `<form>` - Contenedor del Formulario

**Atributos importantes:**
- `novalidate`: Desactiva validación HTML5 nativa (usamos validación de Angular)
- `[formGroup]`: Enlaza con el FormGroup de Angular

```html
<form [formGroup]="contactForm" (ngSubmit)="onSubmit()" novalidate>
  <!-- Campos del formulario -->
</form>
```

##### `<fieldset>` y `<legend>` - Agrupación de Campos

**Propósito:**
- `<fieldset>`: Agrupa campos relacionados
- `<legend>`: Describe el grupo de campos

**Beneficios:**
- Mejora accesibilidad (lectores de pantalla anuncian el grupo)
- Organización visual clara
- Permite deshabilitar grupos completos

**Ejemplo:**

```html
<form [formGroup]="contactForm" (ngSubmit)="onSubmit()">
  <!-- Grupo 1: Información Personal -->
  <fieldset class="contact-form__fieldset">
    <legend class="contact-form__legend">Información Personal</legend>
    
    <app-form-input
      id="nombre"
      label="Nombre"
      type="text"
      [required]="true"
    ></app-form-input>
    
    <app-form-input
      id="apellidos"
      label="Apellidos"
      type="text"
      [required]="true"
    ></app-form-input>
  </fieldset>

  <!-- Grupo 2: Información de Contacto -->
  <fieldset class="contact-form__fieldset">
    <legend class="contact-form__legend">Información de Contacto</legend>
    
    <app-form-input
      id="email"
      label="Correo Electrónico"
      type="email"
      [required]="true"
    ></app-form-input>
    
    <app-form-input
      id="telefono"
      label="Teléfono"
      type="tel"
      [required]="true"
    ></app-form-input>
  </fieldset>
</form>
```

##### Asociación `<label>` con `<input>`

**Métodos de asociación:**

**1. Método explícito con `for` e `id` (RECOMENDADO):**

```html
<label for="email">Correo Electrónico</label>
<input id="email" type="email" name="email" />
```

**2. Método implícito (label envuelve input):**

```html
<label>
  Correo Electrónico
  <input type="email" name="email" />
</label>
```

**En T4 Traveling usamos el método explícito** porque:
- ✅ Más flexible para layout complejo
- ✅ Funciona mejor con frameworks como Angular
- ✅ Permite separar label e input visualmente si es necesario

#### Componente FormInput - Estructura Completa

**Archivo:** `form-input.component.html`

```html
<div class="form-input" 
     [class.form-input--error]="showError" 
     [class.form-input--disabled]="disabled">
  
  <!-- Label con asociación explícita -->
  <label [for]="id" class="form-input__label">
    {{ label }}
    <!-- Indicador de campo requerido -->
    <span *ngIf="required" 
          class="form-input__required" 
          aria-label="campo requerido">*</span>
  </label>

  <!-- Input con atributos de accesibilidad -->
  <input
    [id]="id"
    [type]="type"
    [name]="name"
    [placeholder]="placeholder"
    [required]="required"
    [disabled]="disabled"
    [autocomplete]="autocomplete"
    [value]="value"
    (input)="onInput($event)"
    (blur)="onBlur()"
    class="form-input__field"
    [attr.aria-required]="required"
    [attr.aria-invalid]="showError"
    [attr.aria-describedby]="helpText ? id + '-help' : (showError ? id + '-error' : null)"
  />

  <!-- Texto de ayuda (cuando no hay error) -->
  <p *ngIf="helpText && !showError" 
     [id]="id + '-help'" 
     class="form-input__help">
    {{ helpText }}
  </p>

  <!-- Mensaje de error (cuando hay error) -->
  <p *ngIf="showError" 
     [id]="id + '-error'" 
     class="form-input__error" 
     role="alert">
    <svg class="form-input__error-icon" width="16" height="16">...</svg>
    {{ errorMessage }}
  </p>
</div>
```

**Características clave:**

1. **Asociación label-input:**
   - `[for]="id"` en label
   - `[id]="id"` en input
   - IDs únicos pasados como Input property

2. **Indicador de campo requerido:**
   - Asterisco visual (`*`)
   - `aria-label="campo requerido"` para lectores de pantalla

3. **Atributos ARIA:**
   - `aria-required`: Indica si el campo es obligatorio
   - `aria-invalid`: Indica si el campo tiene error
   - `aria-describedby`: Enlaza con mensaje de ayuda o error

4. **Mensajes contextuales:**
   - `helpText`: Instrucciones cuando el campo es válido
   - `errorMessage`: Mensaje de error cuando el campo es inválido
   - `role="alert"`: Anuncia errores a lectores de pantalla

#### Uso del Componente FormInput

**Ejemplo básico:**

```html
<app-form-input
  id="nombre"
  label="Nombre Completo"
  type="text"
  name="nombre"
  placeholder="Juan García"
  [required]="true"
  helpText="Ingresa tu nombre tal como aparece en tu documento"
  [errorMessage]="getErrorMessage('nombre')"
  autocomplete="name"
></app-form-input>
```

**Ejemplo con validación:**

```typescript
// En el componente TypeScript
getErrorMessage(fieldName: string): string {
  const control = this.form.get(fieldName);
  
  if (!control || !control.errors || !control.touched) {
    return '';
  }

  if (control.errors['required']) {
    return 'Este campo es obligatorio';
  }

  if (control.errors['minlength']) {
    return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
  }

  if (control.errors['email']) {
    return 'Ingrese un email válido';
  }

  return 'Campo inválido';
}
```

#### Formulario Completo - Ejemplo ContactForm

**Estructura HTML simplificada:**

```html
<form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="contact-form" novalidate>
  
  <h2 class="contact-form__title">Formulario de Contacto</h2>
  <p class="contact-form__description">
    Completa el formulario y nos pondremos en contacto contigo.
  </p>

  <!-- FIELDSET 1: Información Personal -->
  <fieldset class="contact-form__fieldset">
    <legend class="contact-form__legend">Información Personal</legend>
    
    <div class="contact-form__row">
      <app-form-input
        id="nombre"
        label="Nombre"
        type="text"
        name="nombre"
        [required]="true"
        [errorMessage]="getErrorMessage('nombre')"
        helpText="Ingresa tu nombre"
      ></app-form-input>

      <app-form-input
        id="apellidos"
        label="Apellidos"
        type="text"
        name="apellidos"
        [required]="true"
        [errorMessage]="getErrorMessage('apellidos')"
        helpText="Ingresa tus apellidos"
      ></app-form-input>
    </div>
  </fieldset>

  <!-- FIELDSET 2: Contacto -->
  <fieldset class="contact-form__fieldset">
    <legend class="contact-form__legend">Información de Contacto</legend>
    
    <div class="contact-form__row">
      <app-form-input
        id="email"
        label="Correo Electrónico"
        type="email"
        name="email"
        [required]="true"
        [errorMessage]="getErrorMessage('email')"
        autocomplete="email"
      ></app-form-input>

      <app-form-input
        id="telefono"
        label="Teléfono"
        type="tel"
        name="telefono"
        [required]="true"
        [errorMessage]="getErrorMessage('telefono')"
        helpText="9 dígitos sin espacios"
      ></app-form-input>
    </div>
  </fieldset>

  <!-- FIELDSET 3: Mensaje -->
  <fieldset class="contact-form__fieldset">
    <legend class="contact-form__legend">Tu Mensaje</legend>
    
    <app-form-input
      id="asunto"
      label="Asunto"
      type="text"
      [required]="true"
    ></app-form-input>

    <!-- Textarea (campo especial) -->
    <div class="contact-form__textarea-wrapper">
      <label for="mensaje">
        Mensaje
        <span class="contact-form__required">*</span>
      </label>
      <textarea
        id="mensaje"
        name="mensaje"
        formControlName="mensaje"
        rows="6"
        required
        aria-required="true"
      ></textarea>
    </div>
  </fieldset>

  <!-- Botones -->
  <div class="contact-form__actions">
    <button type="submit" class="contact-form__submit">
      Enviar Mensaje
    </button>
    <button type="button" class="contact-form__reset" (click)="contactForm.reset()">
      Limpiar Formulario
    </button>
  </div>
</form>
```

#### Atributos de Accesibilidad Implementados

| Atributo | Propósito | Ejemplo |
|----------|-----------|---------|
| `for` / `id` | Asocia label con input | `<label for="email">` + `<input id="email">` |
| `aria-label` | Etiqueta invisible para lectores de pantalla | `<button aria-label="Buscar">🔍</button>` |
| `aria-required` | Indica campo obligatorio | `<input aria-required="true">` |
| `aria-invalid` | Indica campo con error | `<input aria-invalid="true">` |
| `aria-describedby` | Enlaza input con descripción/error | `<input aria-describedby="email-error">` |
| `role="alert"` | Anuncia mensajes importantes | `<p role="alert">Error: ...</p>` |
| `autocomplete` | Facilita autocompletado | `<input autocomplete="email">` |

#### Validación y Estados

**Estados del campo:**

```scss
.form-input {
  // Estado normal
  &__field {
    border: 2px solid $color-neutral-700;
  }

  // Estado hover
  &__field:hover:not(:disabled) {
    border-color: $color-neutral-600;
  }

  // Estado focus (usuario interactuando)
  &__field:focus {
    border-color: $color-info;
    box-shadow: 0 0 0 3px rgba($color-info, 0.1);
  }

  // Estado error
  &--error {
    .form-input__field {
      border-color: $color-error;
    }
  }

  // Estado deshabilitado
  &--disabled {
    opacity: 0.6;
    .form-input__field {
      cursor: not-allowed;
      background-color: $color-neutral-900;
    }
  }
}
```

#### Resumen de Buenas Prácticas

✅ **Siempre usar `<form>`** para agrupar campos relacionados

✅ **Usar `<fieldset>` y `<legend>`** para agrupar lógicamente

✅ **Asociar labels con inputs** usando `for` e `id`

✅ **Indicar campos requeridos** visual y semánticamente

✅ **Proporcionar mensajes de error claros** con `role="alert"`

✅ **Incluir texto de ayuda** para campos complejos

✅ **Usar atributos `autocomplete`** apropiados

✅ **Implementar estados visuales** (hover, focus, error, disabled)

✅ **Validar accesibilidad** con herramientas como WAVE o Lighthouse

✅ **Probar con teclado** (Tab, Enter, Esc deben funcionar)

✅ **Probar con lector de pantalla** (NVDA, JAWS, VoiceOver)

---

## Resumen Fase 2

### ✅ Componentes de Layout Creados

| Componente | Etiqueta | Archivos | Estado |
|------------|----------|----------|--------|
| Header | `<header>` | header.component.{ts,html,scss} | ✅ |
| Main | `<main>` | main.component.{ts,html,scss} | ✅ |
| Footer | `<footer>` | footer.component.{ts,html,scss} | ✅ |
| Sidebar | `<aside>` | sidebar.component.{ts,html,scss} | ✅ |

### ✅ Componentes Funcionales Creados

| Componente | Propósito | Archivos | Estado |
|------------|-----------|----------|--------|
| FormInput | Input reutilizable | form-input.component.{ts,html,scss} | ✅ |
| ContactForm | Formulario completo | contact-form.component.{ts,html,scss} | ✅ |

### ✅ Características Implementadas

- ✅ HTML 100% semántico en todos los componentes
- ✅ Navegación principal con menú responsive
- ✅ Footer con múltiples columnas y redes sociales
- ✅ Componente FormInput con ControlValueAccessor
- ✅ Formulario completo con fieldset, legend y validación
- ✅ Atributos ARIA completos en formularios
- ✅ CSS Custom Properties para temas
- ✅ Estilos BEM en todos los componentes
- ✅ Documentación completa de HTML semántico
- ✅ Diagramas de jerarquía de headings
- ✅ Guía completa de estructura de formularios

### 📊 Estadísticas

- **Componentes de layout:** 4 (Header, Main, Footer, Sidebar)
- **Componentes funcionales:** 2 (FormInput, ContactForm)
- **Archivos creados:** 18
- **Líneas de código:** ~2,000+
- **Documentación:** 2,000+ palabras adicionales

---

---

## Sección 3: Sistema de Componentes UI

### 3.1 Componentes Implementados

En esta fase se han creado los componentes UI reutilizables que forman la base del sistema de diseño de T4 Traveling. Cada componente ha sido desarrollado con todas sus variantes, tamaños y estados.

#### 1. Button Component (`app-button`)

**Propósito:** Botón reutilizable para acciones en toda la aplicación.

**Variantes disponibles:**
- `primary` - Acción principal (fondo naranja #FF5D1C)
- `secondary` - Acción secundaria (fondo amarillo #FFE5A1)
- `ghost` - Sin fondo, solo borde (transparente con borde naranja)
- `danger` - Acciones destructivas (fondo rojo #EF4444)

**Tamaños disponibles:**
- `sm` - Pequeño (padding: 8px 16px, min-height: 32px)
- `md` - Mediano/Default (padding: 12px 24px, min-height: 40px)
- `lg` - Grande (padding: 16px 32px, min-height: 48px)

**Estados que maneja:**
- Normal - Estado por defecto
- Hover - Elevación de sombra y translateY(-2px)
- Focus - Outline azul para accesibilidad
- Active - translateY(1px) al hacer clic
- Disabled - Opacidad 0.5, cursor not-allowed

**Propiedades @Input:**
```typescript
@Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';
@Input() size: 'sm' | 'md' | 'lg' = 'md';
@Input() disabled: boolean = false;
@Input() type: 'button' | 'submit' | 'reset' = 'button';
@Input() fullWidth: boolean = false;
```

**Ejemplo de uso:**
```html
<!-- Primary button -->
<app-button variant="primary" size="md" (click)="onSave()">
  Guardar Cambios
</app-button>

<!-- Ghost button small -->
<app-button variant="ghost" size="sm">
  Cancelar
</app-button>

<!-- Danger button large disabled -->
<app-button variant="danger" size="lg" [disabled]="true">
  Eliminar Cuenta
</app-button>

<!-- Full width secondary -->
<app-button variant="secondary" [fullWidth]="true">
  Aplicar Filtros
</app-button>
```

**Nomenclatura BEM aplicada:**
```scss
.button {
  // Elemento base
  
  // Modificadores de variante
  &--primary { }
  &--secondary { }
  &--ghost { }
  &--danger { }
  
  // Modificadores de tamaño
  &--sm { }
  &--md { }
  &--lg { }
  
  // Modificadores de estado
  &--full-width { }
  &--loading { }
  
  // Estados CSS
  &:hover { }
  &:focus { }
  &:active { }
  &:disabled { }
}
```

---

#### 2. Card Component (`app-card`)

**Propósito:** Tarjeta para mostrar contenido estructurado (destinos, productos, artículos).

**Variantes disponibles:**
- Básica - Imagen arriba, contenido abajo (vertical)
- Horizontal - Imagen izquierda, contenido derecha (opcional)

**Modificadores:**
- `hoverable` - Añade efecto hover con elevación
- `compact` - Versión más pequeña
- `large` - Versión más grande

**Estados que maneja:**
- Normal - Estado por defecto con sombra sutil
- Hover (si hoverable) - Elevación de sombra, translateY(-4px), imagen scale(1.05)
- Focus-within - Outline para accesibilidad

**Propiedades @Input:**
```typescript
@Input() imageSrc?: string;
@Input() imageAlt?: string;
@Input() title?: string;
@Input() description?: string;
@Input() horizontal: boolean = false;
@Input() hoverable: boolean = true;
```

**Ejemplo de uso:**
```html
<!-- Card básica -->
<app-card
  imageSrc="paris.jpg"
  imageAlt="Torre Eiffel"
  title="París, Francia"
  description="La ciudad del amor con monumentos icónicos.">
  <div slot="actions">
    <app-button variant="primary" size="sm">Ver Detalles</app-button>
    <app-button variant="ghost" size="sm">Guardar</app-button>
  </div>
</app-card>

<!-- Card horizontal -->
<app-card
  [horizontal]="true"
  imageSrc="tokyo.jpg"
  title="Tokyo, Japón"
  description="Metrópolis vibrante.">
  <div slot="actions">
    <app-button variant="primary" size="sm">Explorar</app-button>
  </div>
</app-card>

<!-- Card sin imagen -->
<app-card
  title="Información"
  description="Contenido textual.">
</app-card>
```

**Nomenclatura BEM aplicada:**
```scss
.card {
  // Elementos
  &__image-wrapper { }
  &__image { }
  &__content { }
  &__title { }
  &__description { }
  &__body { }
  &__actions { }
  
  // Modificadores
  &--horizontal { }
  &--hoverable { }
  &--compact { }
  &--large { }
}
```

---

#### 3. Form Textarea Component (`app-form-textarea`)

**Propósito:** Campo textarea reutilizable para texto largo, implementa ControlValueAccessor.

**Variantes disponibles:**
- Normal - Estado estándar
- Error - Con mensaje de error visible
- Disabled - Deshabilitado

**Estados que maneja:**
- Normal - Borde gris neutral
- Hover - Borde más oscuro
- Focus - Borde azul con box-shadow
- Error - Borde rojo con mensaje
- Disabled - Opacidad reducida, no editable

**Propiedades @Input:**
```typescript
@Input() id!: string;
@Input() label!: string;
@Input() name!: string;
@Input() placeholder: string = '';
@Input() required: boolean = false;
@Input() errorMessage: string = '';
@Input() helpText: string = '';
@Input() disabled: boolean = false;
@Input() rows: number = 4;
@Input() maxLength?: number;
```

**Ejemplo de uso:**
```html
<app-form-textarea
  id="comentarios"
  label="Comentarios"
  name="comentarios"
  placeholder="Escribe tus comentarios..."
  [required]="true"
  [rows]="6"
  [maxLength]="500"
  helpText="Máximo 500 caracteres"
  formControlName="comentarios">
</app-form-textarea>
```

**Características especiales:**
- Contador de caracteres si se define maxLength
- Resize vertical permitido
- ARIA completo (aria-required, aria-invalid, aria-describedby)
- Compatible con Reactive Forms

---

#### 4. Form Select Component (`app-form-select`)

**Propósito:** Dropdown select reutilizable, implementa ControlValueAccessor.

**Variantes disponibles:**
- Normal - Con opciones habilitadas
- Error - Con mensaje de error
- Disabled - Deshabilitado

**Estados que maneja:**
- Normal - Select estándar
- Hover - Borde más oscuro
- Focus - Borde azul con box-shadow
- Error - Borde rojo
- Disabled - Opacidad reducida

**Propiedades @Input:**
```typescript
@Input() id!: string;
@Input() label!: string;
@Input() name!: string;
@Input() options: SelectOption[] = [];
@Input() placeholder: string = 'Selecciona una opción';
@Input() required: boolean = false;
@Input() errorMessage: string = '';
@Input() helpText: string = '';
@Input() disabled: boolean = false;
```

**Interfaz SelectOption:**
```typescript
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}
```

**Ejemplo de uso:**
```typescript
// En el componente TypeScript
selectOptions: SelectOption[] = [
  { value: '1', label: 'Opción 1' },
  { value: '2', label: 'Opción 2' },
  { value: '3', label: 'Opción 3' },
  { value: '4', label: 'Opción 4 (Deshabilitada)', disabled: true }
];
```

```html
<app-form-select
  id="destino"
  label="Selecciona tu destino"
  name="destino"
  [options]="selectOptions"
  [required]="true"
  helpText="Elige tu destino favorito"
  formControlName="destino">
</app-form-select>
```

**Características especiales:**
- Icono chevron personalizado (SVG)
- Opción placeholder deshabilitada si required=true
- appearance: none para estilos custom
- Compatible con Reactive Forms

---

#### 5. Alert Component (`app-alert`)

**Propósito:** Mensajes de feedback para el usuario (éxito, error, advertencia, info).

**Variantes disponibles:**
- `success` - Verde (#10B981) para confirmaciones
- `error` - Rojo (#EF4444) para errores
- `warning` - Naranja (#F59E0B) para advertencias
- `info` - Azul (#3B82F6) para información

**Tamaños:** Tamaño único adaptativo

**Estados que maneja:**
- Visible - Animación slideInDown al aparecer
- Dismissible - Con botón X para cerrar
- Hidden - Se oculta al hacer dismiss

**Propiedades @Input/@Output:**
```typescript
@Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';
@Input() title?: string;
@Input() dismissible: boolean = true;
@Output() dismissed = new EventEmitter<void>();
```

**Ejemplo de uso:**
```html
<!-- Alert de éxito con título -->
<app-alert 
  type="success" 
  title="¡Reserva Confirmada!"
  (dismissed)="onAlertClosed()">
  Tu reserva ha sido confirmada. Recibirás un email con los detalles.
</app-alert>

<!-- Alert de error sin título -->
<app-alert type="error">
  Hubo un problema al procesar tu solicitud. Intenta nuevamente.
</app-alert>

<!-- Alert de advertencia no dismissible -->
<app-alert 
  type="warning" 
  title="Mantenimiento Programado"
  [dismissible]="false">
  El sistema estará en mantenimiento el 20 de diciembre.
</app-alert>

<!-- Alert de info -->
<app-alert type="info" title="Nuevo Destino Disponible">
  Ahora puedes reservar viajes a Bali, Indonesia.
</app-alert>
```

**Nomenclatura BEM aplicada:**
```scss
.alert {
  // Elementos
  &__icon { }
  &__content { }
  &__title { }
  &__message { }
  &__close { }
  
  // Modificadores por tipo
  &--success { }
  &--error { }
  &--warning { }
  &--info { }
}
```

**Animaciones:**
```scss
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 3.2 Nomenclatura y Metodología BEM

#### Estrategia de Nomenclatura

En T4 Traveling seguimos estrictamente la metodología BEM (Block Element Modifier) para garantizar un CSS escalable y mantenible.

**Reglas aplicadas:**

1. **Block** - Entidad independiente con significado propio
   - Ejemplo: `.button`, `.card`, `.alert`
   - Es el contenedor principal del componente

2. **Element** - Parte de un block que no tiene significado independiente
   - Sintaxis: `.block__element`
   - Ejemplo: `.card__image`, `.button__icon`, `.alert__close`
   - Siempre lleva doble guión bajo

3. **Modifier** - Bandera en block o element que cambia apariencia/comportamiento
   - Sintaxis: `.block--modifier` o `.block__element--modifier`
   - Ejemplo: `.button--primary`, `.card--horizontal`, `.alert--error`
   - Siempre lleva doble guión medio

#### Ejemplos Reales del Proyecto

**Ejemplo 1: Button Component**

```scss
// BLOCK
.button {
  display: inline-flex;
  // ... estilos base
  
  // MODIFICADORES de variante
  &--primary {
    background-color: $color-primary-0;
    color: $color-neutral-1000;
  }
  
  &--secondary {
    background-color: $color-secondary-1;
    color: $color-neutral-1000;
  }
  
  &--ghost {
    background-color: transparent;
    border-color: $color-primary-0;
  }
  
  &--danger {
    background-color: $color-error;
    color: $color-neutral-1000;
  }
  
  // MODIFICADORES de tamaño
  &--sm {
    padding: $spacing-2 $spacing-4;
    font-size: $font-sm;
  }
  
  &--md {
    padding: $spacing-3 $spacing-6;
    font-size: $font-base;
  }
  
  &--lg {
    padding: $spacing-4 $spacing-8;
    font-size: $font-lg;
  }
  
  // MODIFICADOR de layout
  &--full-width {
    width: 100%;
  }
}
```

**Uso en HTML:**
```html
<!-- Block + Modifier de variante + Modifier de tamaño -->
<button class="button button--primary button--lg">
  Reservar Ahora
</button>

<!-- Block + Múltiples Modifiers -->
<button class="button button--secondary button--sm button--full-width">
  Ver Más
</button>
```

**Ejemplo 2: Card Component**

```scss
// BLOCK
.card {
  display: flex;
  flex-direction: column;
  
  // ELEMENT - Wrapper de imagen
  &__image-wrapper {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  
  // ELEMENT - Imagen
  &__image {
    width: 100%;
    height: 200px;
    object-fit: cover;
    transition: transform $transition-slow;
  }
  
  // ELEMENT - Contenido
  &__content {
    padding: $spacing-6;
    display: flex;
    flex-direction: column;
  }
  
  // ELEMENT - Título
  &__title {
    font-size: $font-xl;
    font-weight: $font-weight-bold;
    color: $color-neutral-0;
  }
  
  // ELEMENT - Descripción
  &__description {
    font-size: $font-base;
    color: $color-neutral-400;
  }
  
  // ELEMENT - Acciones
  &__actions {
    display: flex;
    gap: $spacing-3;
  }
  
  // MODIFIER - Card horizontal
  &--horizontal {
    flex-direction: row;
    
    // Modificación del ELEMENT dentro del MODIFIER
    .card__image-wrapper {
      width: 40%;
    }
    
    .card__content {
      width: 60%;
    }
  }
  
  // MODIFIER - Card hoverable
  &--hoverable {
    cursor: pointer;
    
    &:hover {
      box-shadow: $shadow-lg;
      transform: translateY(-4px);
      
      .card__image {
        transform: scale(1.05);
      }
    }
  }
}
```

**Uso en HTML:**
```html
<!-- Block + Element -->
<article class="card">
  <div class="card__image-wrapper">
    <img src="..." alt="..." class="card__image" />
  </div>
  <div class="card__content">
    <h3 class="card__title">París, Francia</h3>
    <p class="card__description">La ciudad del amor...</p>
    <div class="card__actions">
      <button class="button button--primary button--sm">Ver Detalles</button>
    </div>
  </div>
</article>

<!-- Block + Modifier + Elements -->
<article class="card card--horizontal card--hoverable">
  <div class="card__image-wrapper">
    <img src="..." class="card__image" />
  </div>
  <div class="card__content">
    <h3 class="card__title">Tokyo, Japón</h3>
    <p class="card__description">Metrópolis vibrante...</p>
  </div>
</article>
```

**Ejemplo 3: Form Input Component**

```scss
// BLOCK
.form-input {
  display: flex;
  flex-direction: column;
  
  // ELEMENT - Label
  &__label {
    font-size: $font-sm;
    font-weight: $font-weight-medium;
    color: $color-neutral-100;
  }
  
  // ELEMENT - Required indicator
  &__required {
    color: $color-error;
    font-weight: $font-weight-bold;
  }
  
  // ELEMENT - Input field
  &__field {
    width: 100%;
    padding: $spacing-3 $spacing-4;
    border: $border-medium solid $color-neutral-700;
    
    &:focus {
      border-color: $color-info;
      box-shadow: 0 0 0 3px rgba($color-info, 0.1);
    }
  }
  
  // ELEMENT - Help text
  &__help {
    font-size: $font-xs;
    color: $color-neutral-500;
  }
  
  // ELEMENT - Error message
  &__error {
    display: flex;
    align-items: center;
    color: $color-error;
  }
  
  // ELEMENT - Error icon (dentro de error)
  &__error-icon {
    width: 16px;
    height: 16px;
  }
  
  // MODIFIER - Estado de error
  &--error {
    .form-input__field {
      border-color: $color-error;
    }
    
    .form-input__label {
      color: $color-error;
    }
  }
  
  // MODIFIER - Estado deshabilitado
  &--disabled {
    opacity: 0.6;
    
    .form-input__label {
      cursor: not-allowed;
    }
  }
}
```

#### Cuándo Usar Block vs Element vs Modifier

**Usa un BLOCK cuando:**
- El componente puede existir independientemente
- Puede ser reutilizado en diferentes contextos
- Ejemplo: `.button`, `.card`, `.alert`, `.header`

**Usa un ELEMENT cuando:**
- Es una parte integral del componente
- No tiene sentido sin su block padre
- Ejemplo: `.card__title`, `.button__icon`, `.header__logo`

**Usa un MODIFIER cuando:**
- Necesitas cambiar la apariencia del block o element
- Representa una variante, estado o tamaño
- Ejemplo: `.button--primary`, `.card--horizontal`, `.input--error`

**NO hagas esto (anidación profunda):**
```scss
// ❌ INCORRECTO - Demasiado anidado
.card__content__body__text { }
```

**HAZ esto en su lugar:**
```scss
// ✅ CORRECTO - Flat BEM
.card__body-text { }
```

#### Ventajas de BEM en T4 Traveling

1. **Baja especificidad**: Todas las clases tienen la misma especificidad, evitando guerras de !important
2. **Autoexplicativo**: Al leer el HTML sabes qué hace cada clase
3. **Modular**: Los componentes son independientes y portables
4. **Mantenible**: Fácil encontrar y modificar estilos
5. **Escalable**: Funciona bien en proyectos grandes

---

### 3.3 Style Guide

El Style Guide de T4 Traveling es una página especial ubicada en `/style-guide` que muestra todos los componentes UI con todas sus variantes, tamaños y estados.

#### Propósito del Style Guide

1. **Documentación Visual**: Ver todos los componentes en un solo lugar
2. **Testing Rápido**: Verificar que los estilos funcionan correctamente
3. **Referencia para Desarrollo**: Copiar ejemplos de código
4. **Consistencia**: Asegurar que todos usan los mismos componentes
5. **Onboarding**: Nuevos desarrolladores pueden ver el sistema completo

#### Estructura del Style Guide

La página está organizada en secciones:

1. **Botones** - Todas las variantes, tamaños y estados
2. **Cards** - Básicas, horizontales, con/sin imagen, grid
3. **Formularios** - Input, Textarea, Select con estados
4. **Alertas** - Success, Error, Warning, Info
5. **Colores** - Paleta completa (primarios y semánticos)
6. **Tipografía** - Headings y párrafos con tamaños

#### Características del Style Guide

**Tabla de Contenidos:**
- Enlaces de navegación a cada sección
- Scroll suave al hacer clic

**Grupos de Demostración:**
- Componente renderizado (vista previa)
- Código de ejemplo (snippet HTML)
- Descripción y variantes

**Responsive:**
- Funciona en mobile, tablet y desktop
- Los componentes se adaptan según breakpoints

**Interactivo:**
- Botones clicables (console.log en eventos)
- Alerts dismissible funcionando
- Formularios con validación

#### Acceso al Style Guide

**URL:** `http://localhost:4200/style-guide`

**Ruta configurada en:**
```typescript
// app.routes.ts
export const routes: Routes = [
  {
    path: 'style-guide',
    loadComponent: () => import('./pages/style-guide/style-guide.component')
      .then(m => m.StyleGuideComponent)
  }
];
```

#### Capturas de Pantalla

**Sección Botones:**
Muestra los 4 variantes (primary, secondary, ghost, danger) en 3 tamaños (sm, md, lg), más estados disabled y full-width. Cada grupo incluye el código HTML para reproducirlo.

**Sección Cards:**
Presenta cards básicas con imagen, título y descripción. También cards horizontales y un grid de 3 columnas para mostrar cómo se ven en un layout real.

**Sección Formularios:**
Demuestra los componentes FormInput, FormTextarea y FormSelect con diferentes estados: normal, error, disabled. Incluye contador de caracteres en textarea y opciones disabled en select.

**Sección Alertas:**
Exhibe los 4 tipos de alertas (success, error, warning, info) con título y sin título, dismissible y no dismissible.

**Sección Colores:**
Paleta visual con swatches de colores primarios (Primary #FF5D1C, Secondary #FFE5A1) y semánticos (Success #10B981, Error #EF4444, Warning #F59E0B, Info #3B82F6). Cada swatch muestra el nombre y código hexadecimal.

**Sección Tipografía:**
Ejemplos de todos los niveles de headings (h1 a h4) y párrafos en diferentes tamaños, con el código de tamaño en rem debajo de cada muestra.

#### Mantenimiento del Style Guide

**Cuándo actualizar:**
- Al crear un nuevo componente → Añadir sección
- Al añadir variante → Añadir ejemplo a sección existente
- Al cambiar estilos → Verificar que se reflejan correctamente

**Checklist al añadir componente:**
1. Importar el componente en `style-guide.component.ts`
2. Añadir sección en el HTML con título
3. Mostrar TODAS las variantes del componente
4. Incluir snippet de código de ejemplo
5. Añadir enlace en tabla de contenidos

---

## Resumen Fase 3

### ✅ Componentes UI Creados

| Componente | Variantes | Tamaños | Estados | Archivos | Estado |
|------------|-----------|---------|---------|----------|--------|
| Button | 4 | 3 | 5 | button.component.{ts,html,scss} | ✅ |
| Card | 2 | 3 | 3 | card.component.{ts,html,scss} | ✅ |
| FormTextarea | 3 | 1 | 5 | form-textarea.component.{ts,html,scss} | ✅ |
| FormSelect | 3 | 1 | 5 | form-select.component.{ts,html,scss} | ✅ |
| Alert | 4 | 1 | 2 | alert.component.{ts,html,scss} | ✅ |

### ✅ Style Guide Implementado

| Aspecto | Detalles | Estado |
|---------|----------|--------|
| Página | `/style-guide` ruta funcional | ✅ |
| Secciones | 6 (Botones, Cards, Forms, Alerts, Colores, Tipografía) | ✅ |
| Ejemplos | Todos los componentes con variantes | ✅ |
| Código | Snippets HTML incluidos | ✅ |
| Responsive | Adaptativo mobile/tablet/desktop | ✅ |

### ✅ Características Implementadas

- ✅ 5 componentes UI obligatorios completados
- ✅ Todas las variantes implementadas por componente
- ✅ Todos los tamaños definidos (sm, md, lg)
- ✅ Todos los estados CSS (hover, focus, active, disabled)
- ✅ BEM nomenclature consistente en todo el código
- ✅ Transiciones suaves en interacciones
- ✅ ARIA attributes para accesibilidad
- ✅ ControlValueAccessor en componentes de formulario
- ✅ Animaciones (slideInDown, scale, translateY)
- ✅ Style Guide completo y funcional
- ✅ Documentación exhaustiva con ejemplos

### 📊 Estadísticas

- **Componentes UI:** 5 (Button, Card, FormTextarea, FormSelect, Alert)
- **Archivos creados:** 15 (5 componentes × 3 archivos)
- **Variantes totales:** 17 entre todos los componentes
- **Líneas de código:** ~1,800
- **Líneas de documentación:** ~1,500
- **Secciones en Style Guide:** 6

### 🎯 Sistema de Diseño Completo

Con la Fase 3, T4 Traveling tiene ahora un **sistema de diseño completo y funcional**:

**Fundamentos (Fase 1):**
- Variables SCSS (colores, espaciado, tipografía)
- Mixins reutilizables
- Reset CSS
- Sistema de grid

**Estructura (Fase 2):**
- Componentes de layout (Header, Main, Footer, Sidebar)
- Componentes de formulario básicos (FormInput, ContactForm)
- HTML semántico completo

**Componentes UI (Fase 3):**
- Sistema de botones completo
- Cards reutilizables
- Formularios avanzados (Textarea, Select)
- Sistema de alertas
- Style Guide para documentación

**Próximos pasos:**
- Fase 4: Páginas completas y routing
- Fase 5: Integración con backend
- Fase 6: Testing y optimización

---

**Última actualización:** 16 de diciembre de 2025
**Autor:** T4 Traveling Development Team
**Versión:** 3.0.0

