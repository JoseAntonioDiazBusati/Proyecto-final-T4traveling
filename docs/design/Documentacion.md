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

**Última actualización:** 16 de diciembre de 2025
**Autor:** T4 Traveling Development Team
**Versión:** 1.0.0

