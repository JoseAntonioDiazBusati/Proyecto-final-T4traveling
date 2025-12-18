# Fase 3: Formularios Reactivos - Documentación

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Formularios Implementados](#formularios-implementados)
3. [Validadores Personalizados](#validadores-personalizados)
4. [FormArray](#formarray)
5. [ViewChild y ElementRef](#viewchild-y-elementref)
6. [Guía de Uso](#guía-de-uso)
7. [Ejemplos de Validación](#ejemplos-de-validación)

## 📝 Descripción General

Esta fase implementa un sistema completo de formularios reactivos en Angular con validaciones síncronas y asíncronas, FormArrays dinámicos, y manipulación del DOM usando ViewChild y ElementRef.

### Objetivos Cumplidos ✅

- ✅ Mínimo 3 formularios reactivos completos
- ✅ Validadores personalizados síncronos (6 implementados)
- ✅ Validadores asíncronos (3 implementados)
- ✅ FormArray implementado en 2 formularios
- ✅ Feedback visual completo de validación
- ✅ Documentación completa de validadores
- ✅ ViewChild y ElementRef para manipulación del DOM

## 📄 Formularios Implementados

### 1. Formulario de Registro (`registration-form.component.ts`)

**Propósito**: Registro de nuevos usuarios con validaciones complejas.

**Campos**:
- Username (con validación de disponibilidad asíncrona)
- Email (con validación de unicidad asíncrona)
- Password (con validación de fortaleza)
- Confirm Password (validación cross-field)
- Nombre y Apellidos
- NIF/NIE (con validación de documento único asíncrona)
- Teléfono (validación de formato español)
- Fecha de nacimiento (validación de edad mínima)
- Aceptación de términos

**Validaciones Destacadas**:
- Validación asíncrona de email único (delay 1000ms)
- Validación asíncrona de username disponible (delay 800ms)
- Validación asíncrona de documento único (delay 1200ms)
- Validación de contraseña fuerte con requisitos múltiples
- Cross-field validation para confirmación de contraseña
- Validación de NIF/NIE español con letra correcta
- Validación de edad mínima (18 años)

**ViewChild/ElementRef**:
- Manipulación del título del formulario para cambiar color
- Animación del botón de submit al hacer click

### 2. Formulario de Reserva (`booking-form.component.ts`)

**Propósito**: Reserva de viajes con múltiples viajeros.

**Características**:
- Información de contacto
- Selección de destino con precios dinámicos
- Rango de fechas con validación
- **FormArray dinámico** para lista de viajeros
- Servicios adicionales (seguro, transfers)
- Cálculo automático del precio total

**FormArray - Viajeros**:
- Agregar/eliminar viajeros dinámicamente
- Máximo 10 viajeros por reserva
- Cada viajero tiene validación completa:
  - Nombre y apellidos (required, minLength)
  - NIF/NIE (validación de formato)
  - Fecha de nacimiento (required)
  - Necesidades especiales (opcional, maxLength)
- Animaciones CSS en agregar/eliminar
- Sincronización automática con número de viajeros seleccionado

**Validaciones Destacadas**:
- Validación de rango de fechas (fecha regreso > fecha salida)
- Validación de teléfono español
- Validación de NIF para cada viajero
- Límites mín/máx en número de viajeros

**ViewChild/ElementRef**:
- Referencia al contenedor de viajeros para animaciones
- Aplicación de clases CSS dinámicas para efectos de entrada/salida

### 3. Formulario de Contacto (`contact-form.component.ts`)

**Propósito**: Sistema de contacto con múltiples métodos de comunicación.

**Características**:
- Información personal
- **FormArray dinámico** para métodos de contacto
- Detalles de la consulta
- Validación de número de pedido opcional
- Contador de caracteres en tiempo real

**FormArray - Métodos de Contacto**:
- Agregar/eliminar hasta 4 métodos de contacto
- Tipos: Teléfono, Email, WhatsApp, Telegram
- Validación dinámica según tipo seleccionado:
  - Email: validación de formato email
  - Teléfono/WhatsApp: validación de teléfono español
  - Telegram: validación básica
- Selección de método preferido (radio button)
- Cambio automático de validadores al cambiar tipo

**Validaciones Destacadas**:
- Validación condicional según tipo de contacto
- Pattern validation para número de pedido (2 letras + 8 números)
- Validación de longitud de mensaje (10-1000 caracteres)
- Contador visual de caracteres con indicador de estado

**ViewChild/ElementRef**:
- Animación de entrada del formulario completo
- Focus automático en campo de asunto al cargar
- Scroll automático al primer error de validación

## 🔧 Validadores Personalizados

### Validadores Síncronos

Ubicación: `src/app/validators/custom-validators.ts`

#### 1. `strongPassword()`

Valida que la contraseña cumpla con requisitos de seguridad.

**Requisitos**:
- Mínimo 8 caracteres
- Al menos 1 letra mayúscula
- Al menos 1 letra minúscula
- Al menos 1 número
- Al menos 1 carácter especial (!@#$%^&*(),.?":{}|<>)

**Uso**:
```typescript
password: ['', [Validators.required, CustomValidators.strongPassword()]]
```

**Mensaje de Error**:
Devuelve un objeto con los requisitos no cumplidos:
```typescript
{
  strongPassword: {
    hasUpperCase: boolean,
    hasLowerCase: boolean,
    hasNumeric: boolean,
    hasSpecialChar: boolean,
    isValidLength: boolean
  }
}
```

#### 2. `passwordMatch(passwordField, confirmPasswordField)`

Valida que dos campos de contraseña coincidan (validación a nivel de FormGroup).

**Uso**:
```typescript
this.form = this.fb.group({
  password: ['', [Validators.required]],
  confirmPassword: ['', [Validators.required]]
}, {
  validators: [CustomValidators.passwordMatch('password', 'confirmPassword')]
});
```

#### 3. `nif()`

Valida formato y letra de NIF/NIE español.

**Formatos válidos**:
- NIF: 8 números + letra (12345678A)
- NIE: X/Y/Z + 7 números + letra (X1234567L)

**Algoritmo**:
- Verifica formato con regex
- Calcula la letra correcta usando módulo 23
- Compara con la letra proporcionada

**Uso**:
```typescript
nif: ['', [Validators.required, CustomValidators.nif()]]
```

#### 4. `spanishPhone()`

Valida números de teléfono españoles (móvil y fijo).

**Formatos aceptados**:
- 9 dígitos: 612345678
- Con prefijo: +34612345678
- Con prefijo alternativo: 34612345678

**Validación**:
- Primer dígito debe ser 6, 7, 8 o 9
- Total de 9 dígitos (sin contar prefijo)

**Uso**:
```typescript
phone: ['', [Validators.required, CustomValidators.spanishPhone()]]
```

#### 5. `spanishPostalCode()`

Valida códigos postales españoles (01000 a 52999).

**Formato**: 5 dígitos
**Rango**: 01000 - 52999

**Uso**:
```typescript
postalCode: ['', [CustomValidators.spanishPostalCode()]]
```

#### 6. `minAge(minAge: number)`

Valida edad mínima a partir de fecha de nacimiento.

**Cálculo**:
- Compara fecha de nacimiento con fecha actual
- Considera mes y día para cálculo exacto de edad

**Uso**:
```typescript
birthDate: ['', [Validators.required, CustomValidators.minAge(18)]]
```

#### 7. `url()`

Valida que el texto sea una URL válida.

**Uso**:
```typescript
website: ['', [CustomValidators.url()]]
```

#### 8. `dateRange(min: Date, max: Date)`

Valida que una fecha esté dentro de un rango específico.

**Uso**:
```typescript
const today = new Date();
const nextYear = new Date();
nextYear.setFullYear(nextYear.getFullYear() + 1);

departureDate: ['', [
  Validators.required, 
  CustomValidators.dateRange(today, nextYear)
]]
```

### Validadores Asíncronos

Ubicación: `src/app/validators/custom-validators.ts` (clase `AsyncCustomValidators`)

Los validadores asíncronos devuelven `Observable<ValidationErrors | null>` y simulan llamadas a API.

#### 1. `uniqueEmail()`

Simula verificación de email único en base de datos.

**Características**:
- Delay: 1000ms (simula latencia de red)
- Emails "registrados" de prueba:
  - usuario@example.com
  - admin@t4traveling.com
  - test@test.com
  - demo@demo.com

**Uso**:
```typescript
email: [
  '',
  [Validators.required, Validators.email],
  [AsyncCustomValidators.uniqueEmail()]
]
```

**Estado durante validación**:
El FormControl tendrá `pending: true` mientras valida.

#### 2. `usernameAvailable()`

Verifica disponibilidad de nombre de usuario.

**Características**:
- Delay: 800ms
- Usernames "ocupados":
  - admin, root, user, test, demo, superadmin, t4traveling

**Uso**:
```typescript
username: [
  '',
  [Validators.required, Validators.minLength(3)],
  [AsyncCustomValidators.usernameAvailable()]
]
```

#### 3. `uniqueDocument()`

Valida que un documento de identidad no esté registrado.

**Características**:
- Delay: 1200ms
- Documentos "registrados":
  - 12345678A
  - 87654321B
  - X1234567L

**Uso**:
```typescript
nif: [
  '',
  [Validators.required, CustomValidators.nif()],
  [AsyncCustomValidators.uniqueDocument()]
]
```

### Feedback Visual de Validación Asíncrona

Los validadores asíncronos muestran tres estados:

1. **Pendiente** (`control.pending`):
   - Muestra spinner de carga
   - Indica que la validación está en proceso

2. **Válido** (`control.valid`):
   - Muestra check mark verde
   - Indica que pasó todas las validaciones

3. **Inválido** (`control.invalid`):
   - Muestra mensaje de error
   - Borde rojo en el input

## 📦 FormArray

### Concepto

FormArray permite manejar una colección dinámica de controles de formulario. Útil para:
- Listas de elementos que pueden crecer/reducirse
- Cada elemento necesita validación individual
- El usuario puede agregar/eliminar elementos

### Implementación 1: Viajeros (Booking Form)

**Estructura**:
```typescript
this.bookingForm = this.fb.group({
  // ... otros campos
  travelers: this.fb.array([])
});
```

**Métodos clave**:

```typescript
// Getter para acceder al FormArray
get travelers(): FormArray {
  return this.bookingForm.get('travelers') as FormArray;
}

// Crear un FormGroup para un viajero
createTravelerFormGroup(): FormGroup {
  return this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    nif: ['', [Validators.required, CustomValidators.nif()]],
    birthDate: ['', [Validators.required]],
    specialNeeds: ['', [Validators.maxLength(200)]]
  });
}

// Agregar viajero
addTraveler(): void {
  this.travelers.push(this.createTravelerFormGroup());
}

// Eliminar viajero
removeTraveler(index: number): void {
  this.travelers.removeAt(index);
}

// Acceder a un viajero específico
getTravelerFormGroup(index: number): FormGroup {
  return this.travelers.at(index) as FormGroup;
}
```

**En el template**:
```html
<div formArrayName="travelers">
  <div *ngFor="let traveler of travelers.controls; let i = index" 
       [formGroupName]="i">
    <!-- Campos del viajero -->
    <input formControlName="firstName" />
    <input formControlName="lastName" />
    <!-- ... más campos -->
  </div>
</div>
```

**Validación de elementos**:
```typescript
shouldShowTravelerError(travelerIndex: number, fieldName: string): boolean {
  const control = this.travelers.at(travelerIndex).get(fieldName);
  return !!(control && control.invalid && (control.dirty || control.touched));
}
```

### Implementación 2: Métodos de Contacto (Contact Form)

**Características especiales**:
- Validación dinámica según tipo seleccionado
- Máximo 4 métodos
- Selección de método preferido

**Cambio dinámico de validadores**:
```typescript
onContactTypeChange(index: number): void {
  const contactMethod = this.getContactMethodFormGroup(index);
  const type = contactMethod.get('type')?.value;
  const valueControl = contactMethod.get('value');
  
  // Limpiar valor
  valueControl?.setValue('');
  
  // Aplicar validaciones según tipo
  if (type === 'email') {
    valueControl?.setValidators([Validators.required, Validators.email]);
  } else if (type === 'phone' || type === 'whatsapp') {
    valueControl?.setValidators([
      Validators.required, 
      CustomValidators.spanishPhone()
    ]);
  } else {
    valueControl?.setValidators([Validators.required]);
  }
  
  valueControl?.updateValueAndValidity();
}
```

## 🎯 ViewChild y ElementRef

### Concepto

`ViewChild` y `ElementRef` permiten acceder directamente a elementos del DOM para:
- Modificar estilos programáticamente
- Aplicar animaciones
- Gestionar focus
- Scroll automático

### Implementaciones

#### 1. Cambio de Color del Título (Registration Form)

```typescript
@ViewChild('formTitle', { static: true }) 
formTitle!: ElementRef<HTMLHeadingElement>;

ngOnInit(): void {
  if (this.formTitle) {
    this.formTitle.nativeElement.style.color = 'var(--color-primary)';
  }
}
```

#### 2. Animación del Botón Submit (Registration Form)

```typescript
@ViewChild('submitButton') 
submitButton!: ElementRef<HTMLButtonElement>;

async onSubmit(): Promise<void> {
  // Animación al hacer click
  if (this.submitButton) {
    this.submitButton.nativeElement.style.transform = 'scale(0.95)';
    setTimeout(() => {
      this.submitButton.nativeElement.style.transform = 'scale(1)';
    }, 200);
  }
  // ... resto del código
}
```

#### 3. Animación de Entrada del Formulario (Contact Form)

```typescript
@ViewChild('formContainer') 
formContainer!: ElementRef<HTMLDivElement>;

ngAfterViewInit(): void {
  if (this.formContainer) {
    this.formContainer.nativeElement.style.opacity = '0';
    this.formContainer.nativeElement.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      this.formContainer.nativeElement.style.transition = 'all 0.5s ease';
      this.formContainer.nativeElement.style.opacity = '1';
      this.formContainer.nativeElement.style.transform = 'translateY(0)';
    }, 50);
  }
}
```

#### 4. Focus Automático (Contact Form)

```typescript
@ViewChild('subjectInput') 
subjectInput!: ElementRef<HTMLInputElement>;

ngAfterViewInit(): void {
  if (this.subjectInput) {
    setTimeout(() => {
      this.subjectInput.nativeElement.focus();
    }, 100);
  }
}
```

#### 5. Animaciones en FormArray (Booking Form)

```typescript
@ViewChild('travelersContainer') 
travelersContainer!: ElementRef<HTMLDivElement>;

addTraveler(): void {
  this.travelers.push(this.createTravelerFormGroup());
  
  // Animar el nuevo elemento
  setTimeout(() => {
    if (this.travelersContainer) {
      const newElement = this.travelersContainer.nativeElement.lastElementChild;
      if (newElement) {
        newElement.classList.add('slide-in');
      }
    }
  }, 0);
}
```

#### 6. Scroll Automático a Errores (Contact Form)

```typescript
async onSubmit(): Promise<void> {
  if (this.contactForm.invalid) {
    this.formService.markFormGroupTouched(this.contactForm);
    
    // Scroll al primer error
    setTimeout(() => {
      const firstError = document.querySelector('.form-control.invalid');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
    
    return;
  }
  // ... resto del código
}
```

## 🚀 Guía de Uso

### Instalación y Ejecución

```bash
# Navegar a la carpeta frontend
cd frontend

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# La aplicación estará disponible en http://localhost:4200
```

### Navegación

La aplicación redirige automáticamente a `/forms-demo` donde encontrarás:
- Pestañas para cada formulario
- Documentación integrada
- Ejemplos en vivo

### Probar Validadores Asíncronos

**Emails ya "registrados"** (devuelven error):
- usuario@example.com
- admin@t4traveling.com
- test@test.com
- demo@demo.com

**Usernames ya "ocupados"** (devuelven error):
- admin
- root
- user
- test
- demo

**Documentos ya "registrados"** (devuelven error):
- 12345678A
- 87654321B
- X1234567L

### Probar FormArray

**Formulario de Reserva**:
1. Selecciona número de viajeros
2. Los campos se crean automáticamente
3. Click en "Añadir viajero" para agregar manualmente
4. Click en la X para eliminar un viajero
5. Observa las animaciones de entrada/salida

**Formulario de Contacto**:
1. Click en "+ Añadir método"
2. Selecciona tipo de contacto
3. Observa cómo cambian las validaciones
4. Marca uno como preferido

## 📊 Ejemplos de Validación

### Ejemplo 1: Contraseña Fuerte

```typescript
// Contraseña válida
"Abc123!@#" // ✅

// Contraseñas inválidas
"abc123!@#"  // ❌ Falta mayúscula
"ABC123!@#"  // ❌ Falta minúscula
"Abcdefgh"   // ❌ Falta número y carácter especial
"Abc123"     // ❌ Falta carácter especial y es muy corta
```

### Ejemplo 2: NIF/NIE

```typescript
// NIFs válidos
"12345678Z" // ✅
"87654321X" // ✅

// NIE válido
"X1234567L" // ✅

// Inválidos
"12345678A" // ❌ Letra incorrecta
"1234567Z"  // ❌ Menos de 8 dígitos
"ABCDEFGH"  // ❌ Formato incorrecto
```

### Ejemplo 3: Teléfono Español

```typescript
// Válidos
"612345678"     // ✅
"+34612345678"  // ✅
"34612345678"   // ✅
"912345678"     // ✅ (fijo)

// Inválidos
"512345678"  // ❌ No empieza por 6,7,8,9
"61234567"   // ❌ Menos de 9 dígitos
"abc123456"  // ❌ Contiene letras
```

### Ejemplo 4: Rango de Fechas

```typescript
// Válido
departureDate: "2025-01-15"
returnDate: "2025-01-20"  // ✅ returnDate > departureDate

// Inválido
departureDate: "2025-01-20"
returnDate: "2025-01-15"  // ❌ returnDate <= departureDate
```

## 🎨 Feedback Visual

### Estados de Validación

1. **Sin tocar** (pristine):
   - Borde gris normal
   - Sin mensajes

2. **Pendiente** (validación asíncrona):
   - Spinner girando
   - Borde amarillo
   - Texto "Validando..."

3. **Válido**:
   - Check mark verde ✓
   - Borde verde (opcional)

4. **Inválido**:
   - Borde rojo
   - Icono de advertencia ⚠
   - Mensaje de error específico

### Contador de Caracteres

El formulario de contacto incluye un contador visual:
- **0-70%**: Color normal (gris)
- **70-90%**: Color advertencia (amarillo)
- **90-100%**: Color peligro (rojo)

## 📁 Estructura de Archivos

```
frontend/src/app/
├── validators/
│   └── custom-validators.ts          # Todos los validadores personalizados
├── services/
│   ├── form.service.ts                # Gestión centralizada de formularios
│   ├── notification.service.ts        # Sistema de notificaciones
│   └── loading.service.ts             # Estados de carga
└── pages/
    └── forms-demo/
        ├── forms-demo.component.ts            # Componente principal con tabs
        ├── forms-demo.component.html
        ├── forms-demo.component.scss
        ├── registration-form.component.ts      # Formulario 1
        ├── registration-form.component.html
        ├── registration-form.component.scss
        ├── booking-form.component.ts           # Formulario 2 (con FormArray)
        ├── booking-form.component.html
        ├── booking-form.component.scss
        ├── contact-form.component.ts           # Formulario 3 (con FormArray)
        ├── contact-form.component.html
        └── contact-form.component.scss
```

## 🔍 Servicios Auxiliares

### FormService

Gestiona el estado de los formularios:
- Registro de formularios
- Tracking de estados
- Mensajes de error centralizados
- Utilidades para marcar campos como touched

### NotificationService

Sistema de toasts/notificaciones:
- success, error, warning, info
- Auto-dismiss configurable
- Acciones opcionales

### LoadingService

Gestiona estados de carga:
- Spinner global
- Loading states locales

## ✨ Características Adicionales

### Accesibilidad
- Labels asociados correctamente
- ARIA labels en botones de eliminar
- Focus management
- Navegación por teclado

### Responsive Design
- Grid adaptativo para campos
- Tabs responsive (horizontal → vertical)
- Diseño mobile-first

### Animaciones
- Fade in/out para errores
- Slide in/out para FormArray
- Transiciones suaves en estados

### Debug Mode
- Secciones colapsables con estado del formulario
- Valores del formulario en JSON
- Útil para desarrollo

## 📝 Notas Importantes

1. **Validadores Asíncronos**: Simulan llamadas a API con delays. En producción, reemplazar con llamadas HTTP reales.

2. **Performance**: Los validadores asíncronos se ejecutan solo después de que los validadores síncronos pasen. Esto optimiza el rendimiento.

3. **Debounce**: Considera agregar debounce a los validadores asíncronos para evitar llamadas excesivas:
```typescript
email: [
  '',
  [Validators.required, Validators.email],
  [AsyncCustomValidators.uniqueEmail()],
  { updateOn: 'blur' } // Solo valida al perder el focus
]
```

4. **FormArray Limits**: Los formularios tienen límites máximos configurables para prevenir abusos.

5. **ViewChild Timing**: Usa `static: true` solo si necesitas acceso en `ngOnInit`. Para la mayoría de casos, usa `ngAfterViewInit`.

## 🎓 Aprendizajes Clave

### FormBuilder vs FormControl/FormGroup
- FormBuilder es más conciso y legible
- Facilita la creación de estructuras complejas

### Validación Reactiva vs Template-Driven
- Reactiva: Mejor para lógica compleja, testing, y reutilización
- Template-driven: Más simple para formularios básicos

### FormArray vs FormGroup
- FormArray: Para colecciones dinámicas
- FormGroup: Para estructuras fijas

### ViewChild: Cuándo usarlo
- ✅ Animaciones complejas
- ✅ Integración con librerías de terceros
- ✅ Focus management
- ❌ Evitar para lógica de negocio (usar servicios)

## 🚀 Próximos Pasos

1. **Integración con Backend**: Reemplazar validadores simulados con API real
2. **Testing**: Agregar tests unitarios para validadores y formularios
3. **Más Validadores**: Implementar según necesidades del negocio
4. **Internacionalización**: Traducir mensajes de error
5. **Optimización**: Implementar debounce y updateOn strategies

## 📚 Referencias

- [Angular Reactive Forms](https://angular.io/guide/reactive-forms)
- [Angular Form Validation](https://angular.io/guide/form-validation)
- [Angular ViewChild](https://angular.io/api/core/ViewChild)
- [RxJS Operators](https://rxjs.dev/guide/operators)

---

**Desarrollado por**: Equipo T4 Traveling
**Fecha**: Diciembre 2025
**Versión**: 1.0.0

