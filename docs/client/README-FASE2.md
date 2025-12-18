# Documentación Técnica - Fase 2: Servicios y Comunicación

## Índice
1. [Arquitectura de Servicios](#arquitectura-de-servicios)
2. [Patrones de Comunicación](#patrones-de-comunicación)
3. [Sistema de Notificaciones](#sistema-de-notificaciones)
4. [Gestión de Loading States](#gestión-de-loading-states)
5. [Separación de Responsabilidades](#separación-de-responsabilidades)
6. [Diagramas de Arquitectura](#diagramas-de-arquitectura)
7. [Buenas Prácticas](#buenas-prácticas)

---

## Arquitectura de Servicios

### Principios de Diseño

La arquitectura de servicios implementada sigue los siguientes principios fundamentales:

1. **Single Responsibility Principle (SRP)**
   - Cada servicio tiene una única responsabilidad bien definida
   - Los componentes solo gestionan la presentación
   - La lógica de negocio está en los servicios

2. **Dependency Injection**
   - Uso de `inject()` function de Angular 14+
   - Servicios singleton con `providedIn: 'root'`
   - Desacoplamiento entre componentes y servicios

3. **Observable Pattern**
   - RxJS Observables para datos asíncronos
   - Subjects para comunicación entre componentes
   - Operators para transformaciones de datos

4. **Reactive Programming con Signals**
   - Angular Signals para estado reactivo
   - Computed signals para valores derivados
   - Effects para side effects

---

## Servicios Implementados

### 1. CommunicationService

**Ubicación**: `src/app/services/communication.service.ts`

**Propósito**: Comunicación entre componentes sin relación directa (hermanos, sin parentesco)

**Características**:
- ✅ Subject para emisión de mensajes
- ✅ Observable público para suscripciones
- ✅ BehaviorSubject para último mensaje
- ✅ Signal para historial de mensajes
- ✅ Filtrado por tipo de mensaje
- ✅ Contador de mensajes

**API Pública**:
```typescript
class CommunicationService {
  // Observables
  messages$: Observable<ComponentMessage>;
  lastMessage$: Observable<ComponentMessage | null>;
  
  // Signals
  messages: Signal<ComponentMessage[]>;
  totalMessages: Signal<number>;
  
  // Métodos
  sendMessage<T>(type: string, payload?: T, source?: string): void;
  onMessage<T>(type: string): Observable<ComponentMessage<T>>;
  onMessages<T>(...types: string[]): Observable<ComponentMessage<T>>;
  clearHistory(): void;
  getHistory(): ComponentMessage[];
  getHistoryByType(type: string): ComponentMessage[];
}
```

**Ejemplo de Uso**:
```typescript
// Componente A - Envía mensaje
constructor() {
  private comm = inject(CommunicationService);
}

sendNotification() {
  this.comm.sendMessage('user-action', { 
    action: 'button-clicked',
    userId: '123'
  });
}

// Componente B - Recibe mensaje
ngOnInit() {
  this.comm.onMessage('user-action').subscribe(message => {
    console.log('Recibido:', message.payload);
  });
}
```

**Patrón Implementado**: **Observer Pattern / Pub-Sub**

---

### 2. StateService

**Ubicación**: `src/app/services/state.service.ts`

**Propósito**: Gestión de estado global de la aplicación

**Características**:
- ✅ Estado centralizado con Signals
- ✅ Persistencia en localStorage
- ✅ Computed signals para valores derivados
- ✅ Effects para sincronización automática
- ✅ Type-safe con TypeScript

**Estado Gestionado**:
```typescript
interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  selectedDestination: any | null;
  cart: any[];
  searchQuery: string;
  filters: Record<string, any>;
}
```

**API Pública**:
```typescript
class StateService {
  // Signals de solo lectura
  user: Signal<User | null>;
  isAuthenticated: Signal<boolean>;
  cart: Signal<any[]>;
  cartItemCount: Signal<number>;
  cartTotal: Signal<number>;
  
  // Métodos de usuario
  setUser(user: User): void;
  updateUser(updates: Partial<User>): void;
  logout(): void;
  
  // Métodos de carrito
  addToCart(item: any): void;
  removeFromCart(itemId: string): void;
  updateCartItem(itemId: string, updates: any): void;
  clearCart(): void;
  
  // Métodos de búsqueda y filtros
  setSearchQuery(query: string): void;
  setFilter(key: string, value: any): void;
  clearFilters(): void;
  
  // Persistencia
  resetState(): void;
}
```

**Ejemplo de Uso**:
```typescript
constructor() {
  private state = inject(StateService);
}

// Reactive - se actualiza automáticamente
user = this.state.user;
cartCount = this.state.cartItemCount;

// Acciones
login() {
  this.state.setUser({
    id: '1',
    name: 'Juan',
    email: 'juan@example.com'
  });
}

addProduct(product) {
  this.state.addToCart(product);
}
```

**Patrón Implementado**: **State Management Pattern / Store**

---

### 3. NotificationService

**Ubicación**: `src/app/services/notification.service.ts`

**Propósito**: Sistema centralizado de notificaciones toast

**Características**:
- ✅ 4 tipos: success, error, warning, info
- ✅ Auto-dismiss configurable
- ✅ Notificaciones persistentes (duration: 0)
- ✅ Acciones opcionales en notificaciones
- ✅ Control de máximo de notificaciones simultáneas
- ✅ Cierre manual y programático

**Tipos de Notificaciones**:
```typescript
type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // 0 = no auto-dismiss
  dismissible?: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}
```

**API Pública**:
```typescript
class NotificationService {
  // Signals
  notifications: Signal<Notification[]>;
  
  // Métodos principales
  success(message: string, options?: NotificationOptions): string;
  error(message: string, options?: NotificationOptions): string;
  warning(message: string, options?: NotificationOptions): string;
  info(message: string, options?: NotificationOptions): string;
  
  // Control
  dismiss(id: string): void;
  dismissAll(): void;
  dismissByType(type: NotificationType): void;
  
  // Configuración
  setDefaultDuration(duration: number): void;
  setMaxNotifications(max: number): void;
}
```

**Ejemplos de Uso**:
```typescript
// Notificación simple
this.notification.success('Operación completada');

// Notificación con título y duración custom
this.notification.error('Error al guardar', {
  title: 'Error de red',
  duration: 8000
});

// Notificación persistente con acción
this.notification.info('Nueva actualización disponible', {
  title: 'Actualización',
  duration: 0, // No se cierra automáticamente
  action: {
    label: 'Actualizar ahora',
    callback: () => this.updateApp()
  }
});

// Notificación de advertencia
this.notification.warning('Tu sesión expirará pronto', {
  duration: 10000
});
```

**Componente Visual**: `ToastContainerComponent`
- Renderiza las notificaciones
- Animaciones de entrada/salida
- Barra de progreso para auto-dismiss
- Posicionado fixed top-right

**Patrón Implementado**: **Observer Pattern + Queue Management**

---

### 4. LoadingService

**Ubicación**: `src/app/services/loading.service.ts`

**Propósito**: Gestión de estados de carga globales y específicos

**Características**:
- ✅ Loading global con overlay
- ✅ Loading específico por clave
- ✅ Contador de operaciones concurrentes
- ✅ Mensajes de carga personalizados
- ✅ Wrappers para Observables
- ✅ Helpers para Promises

**API Pública**:
```typescript
class LoadingService {
  // Signals
  isGlobalLoading: Signal<boolean>;
  activeLoadingStates: Signal<LoadingState[]>;
  hasActiveLoading: Signal<boolean>;
  
  // Loading Global
  showGlobal(): void;
  hideGlobal(): void;
  forceHideGlobal(): void;
  
  // Loading Específico
  show(key: string, message?: string): void;
  hide(key: string): void;
  isLoading(key: string): boolean;
  
  // Wrappers RxJS
  wrapGlobal<T>(observable: Observable<T>): Observable<T>;
  wrap<T>(key: string, obs: Observable<T>, msg?: string): Observable<T>;
  
  // Wrappers Promises
  withGlobalLoading<T>(fn: () => Promise<T>): Promise<T>;
  withLoading<T>(key: string, fn: () => Promise<T>): Promise<T>;
  
  // Utilidades
  clearAll(): void;
}
```

**Ejemplos de Uso**:
```typescript
// Loading global manual
this.loading.showGlobal();
setTimeout(() => this.loading.hideGlobal(), 2000);

// Loading específico
this.loading.show('save-data', 'Guardando información...');
// ... operación
this.loading.hide('save-data');

// Wrapper para Observable (automático)
this.loading.wrap('fetch-users', this.http.get('/api/users'))
  .subscribe(users => {
    // Loading se oculta automáticamente
  });

// Wrapper para Promise
await this.loading.withGlobalLoading(async () => {
  const data = await this.api.fetchData();
  return data;
});

// En servicios con RxJS
getData(): Observable<Data> {
  return this.loading.wrapGlobal(
    this.http.get<Data>('/api/data')
  );
}
```

**Componente Visual**: `LoadingSpinnerComponent`
- Overlay full-screen
- Spinner animado
- Mensaje de carga
- Backdrop blur

**Patrón Implementado**: **Decorator Pattern + State Management**

---

### 5. DestinationService (Ejemplo de Lógica de Negocio)

**Ubicación**: `src/app/services/destination.service.ts`

**Propósito**: Encapsular lógica de negocio relacionada con destinos

**Características**:
- ✅ Operaciones CRUD simuladas
- ✅ Búsqueda y filtrado
- ✅ Ordenamiento
- ✅ Recomendaciones
- ✅ Integración con Loading y Notifications
- ✅ Manejo de errores

**API Pública**:
```typescript
class DestinationService {
  // Operaciones básicas
  getDestinations(): Observable<Destination[]>;
  getDestinationById(id: string): Observable<Destination>;
  
  // Búsqueda y filtrado
  searchDestinations(query: string): Observable<Destination[]>;
  filterByCategory(category: string): Observable<Destination[]>;
  filterByPriceRange(min: number, max: number): Observable<Destination[]>;
  
  // Ordenamiento
  sortDestinations(
    destinations: Destination[],
    sortBy: 'name' | 'price' | 'rating',
    order: 'asc' | 'desc'
  ): Destination[];
  
  // Operaciones de negocio
  createBooking(destinationId: string, data: any): Observable<any>;
  getFeaturedDestinations(): Observable<Destination[]>;
  getRecommendations(destinationId: string): Observable<Destination[]>;
}
```

**Integración con otros servicios**:
```typescript
@Injectable({ providedIn: 'root' })
export class DestinationService {
  private loading = inject(LoadingService);
  private notification = inject(NotificationService);
  
  getDestinations(): Observable<Destination[]> {
    // Automáticamente muestra loading y maneja errores
    return this.loading.wrap(
      'destinations',
      this.http.get<Destination[]>('/api/destinations'),
      'Cargando destinos...'
    ).pipe(
      catchError(error => {
        this.notification.error('Error al cargar destinos');
        return throwError(() => error);
      })
    );
  }
}
```

**Patrón Implementado**: **Service Layer Pattern + Repository Pattern**

---

## Patrones de Comunicación

### 1. Parent → Child (Input)
```typescript
// Parent
<app-child [data]="parentData"></app-child>

// Child
@Input() data: any;
```

### 2. Child → Parent (Output)
```typescript
// Child
@Output() action = new EventEmitter<any>();

handleClick() {
  this.action.emit({ data: 'value' });
}

// Parent
<app-child (action)="onAction($event)"></app-child>
```

### 3. Sibling → Sibling (CommunicationService)
```typescript
// Component A
this.comm.sendMessage('event-type', { data: 'value' });

// Component B
this.comm.onMessage('event-type').subscribe(msg => {
  console.log(msg.payload);
});
```

### 4. Global State (StateService)
```typescript
// Component A
this.state.setUser(user);

// Component B
user = this.state.user; // Signal - auto-update
```

### 5. Service → Components (Subject/Observable)
```typescript
// Service
private dataSubject = new Subject<Data>();
public data$ = this.dataSubject.asObservable();

updateData(data: Data) {
  this.dataSubject.next(data);
}

// Components
this.service.data$.subscribe(data => {
  this.handleData(data);
});
```

---

## Separación de Responsabilidades

### Componentes (Presentación)

**Responsabilidades**:
- ✅ Renderizar UI
- ✅ Manejar eventos de usuario
- ✅ Binding de datos
- ✅ Animaciones y transiciones
- ✅ Validación visual

**NO deben**:
- ❌ Contener lógica de negocio
- ❌ Hacer llamadas HTTP directas
- ❌ Gestionar estado global
- ❌ Implementar algoritmos complejos

**Ejemplo Correcto**:
```typescript
@Component({...})
export class ProductListComponent {
  private productService = inject(ProductService);
  
  products = signal<Product[]>([]);
  
  ngOnInit() {
    this.loadProducts();
  }
  
  loadProducts() {
    // Delegar al servicio
    this.productService.getProducts().subscribe(products => {
      this.products.set(products);
    });
  }
  
  addToCart(product: Product) {
    // Delegar al servicio
    this.cartService.add(product);
  }
}
```

### Servicios (Lógica de Negocio)

**Responsabilidades**:
- ✅ Lógica de negocio
- ✅ Llamadas HTTP/API
- ✅ Transformación de datos
- ✅ Validación de datos
- ✅ Caché
- ✅ Estado compartido

**Ejemplo Correcto**:
```typescript
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private loading = inject(LoadingService);
  private notification = inject(NotificationService);
  
  getProducts(): Observable<Product[]> {
    return this.loading.wrapGlobal(
      this.http.get<Product[]>('/api/products').pipe(
        map(products => this.transformProducts(products)),
        catchError(this.handleError.bind(this))
      )
    );
  }
  
  private transformProducts(products: any[]): Product[] {
    // Lógica de transformación
    return products.map(p => ({
      ...p,
      price: this.calculatePrice(p)
    }));
  }
  
  private handleError(error: any): Observable<never> {
    this.notification.error('Error al cargar productos');
    return throwError(() => error);
  }
}
```

---

## Diagramas de Arquitectura

### Arquitectura General de Servicios

```
┌─────────────────────────────────────────────────────────────┐
│                     COMPONENTES (UI)                         │
│  - Presentación                                              │
│  - Event Handling                                            │
│  - Data Binding                                              │
└─────────────────────┬───────────────────────────────────────┘
                      │ inject()
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    SERVICIOS (LÓGICA)                        │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ CommunicationService                               │    │
│  │  - Subject/Observable para mensajes                │    │
│  │  - Comunicación entre componentes                  │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ StateService                                       │    │
│  │  - Estado global con Signals                       │    │
│  │  - Persistencia en localStorage                    │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ NotificationService                                │    │
│  │  - Sistema de toasts                               │    │
│  │  - 4 tipos de notificaciones                       │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ LoadingService                                     │    │
│  │  - Estados de carga                                │    │
│  │  - Global y específico                             │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌────────────────────────────────────────────────────┐    │
│  │ DestinationService (Business Logic)                │    │
│  │  - CRUD operations                                 │    │
│  │  - Búsqueda y filtrado                             │    │
│  │  - Integración con otros servicios                 │    │
│  └────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                  APIs EXTERNAS / BACKEND                     │
│  - HTTP Requests                                             │
│  - WebSockets                                                │
│  - LocalStorage                                              │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Comunicación entre Componentes

```
┌─────────────┐         ┌──────────────────┐         ┌─────────────┐
│Component A  │         │ Communication    │         │Component B  │
│             │         │    Service       │         │             │
│             │         │                  │         │             │
│             │────────▶│ sendMessage()    │         │             │
│             │         │      │           │         │             │
│             │         │      │           │         │             │
│             │         │      ▼           │         │             │
│             │         │  Subject.next()  │         │             │
│             │         │      │           │         │             │
│             │         │      │           │────────▶│ subscribe() │
│             │         │      └──────────────────── │  callback   │
│             │         │                  │         │             │
└─────────────┘         └──────────────────┘         └─────────────┘
```

### Flujo de Notificaciones

```
Acción del Usuario
        │
        ▼
┌──────────────────┐
│   Componente     │
│   llama a        │
│ service.action() │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│    Servicio      │
│  ejecuta lógica  │
└────────┬─────────┘
         │
         ├──────── Error ────────┐
         │                       │
         ▼                       ▼
      Success            NotificationService
         │                 .error(message)
         │                       │
         ▼                       │
NotificationService              │
  .success(message)              │
         │                       │
         └───────────┬───────────┘
                     │
                     ▼
          ┌────────────────────┐
          │ ToastContainer     │
          │ Component          │
          │ muestra toast      │
          └────────────────────┘
```

### Flujo de Loading

```
Componente inicia operación async
          │
          ▼
LoadingService.showGlobal()
  o
LoadingService.show('key')
          │
          ▼
┌────────────────────┐
│ LoadingSpinner     │
│ Component          │
│ muestra overlay    │
└────────────────────┘
          │
          │ ... operación en curso ...
          │
          ▼
Operación completa
          │
          ▼
LoadingService.hideGlobal()
  o
LoadingService.hide('key')
          │
          ▼
┌────────────────────┐
│ LoadingSpinner     │
│ Component          │
│ oculta overlay     │
└────────────────────┘
```

---

## Buenas Prácticas

### 1. Inyección de Dependencias
```typescript
// ✅ BIEN - inject() function (Angular 14+)
constructor() {
  private service = inject(MyService);
}

// ❌ EVITAR - constructor injection cuando no es necesario
constructor(private service: MyService) {}
```

### 2. Signals para Estado Reactivo
```typescript
// ✅ BIEN - Signals para estado reactivo
private userSignal = signal<User | null>(null);
public user = computed(() => this.userSignal());

// ❌ EVITAR - BehaviorSubject para estado simple
private user$ = new BehaviorSubject<User | null>(null);
```

### 3. Separación de Responsabilidades
```typescript
// ✅ BIEN - Lógica en servicio
class ProductComponent {
  private service = inject(ProductService);
  
  loadProducts() {
    this.service.getProducts().subscribe(/*...*/);
  }
}

// ❌ EVITAR - Lógica en componente
class ProductComponent {
  private http = inject(HttpClient);
  
  loadProducts() {
    this.http.get('/api/products').pipe(
      map(data => this.transform(data)), // ❌
      // lógica compleja aquí ❌
    ).subscribe(/*...*/);
  }
}
```

### 4. Manejo de Errores Centralizado
```typescript
// ✅ BIEN - Errores manejados en servicio
getData(): Observable<Data> {
  return this.http.get('/api/data').pipe(
    catchError(error => {
      this.notification.error('Error al cargar datos');
      return throwError(() => error);
    })
  );
}

// ❌ EVITAR - Cada componente maneja errores
// Se duplica código y lógica
```

### 5. Loading Automático con Wrappers
```typescript
// ✅ BIEN - Wrapper automático
getData(): Observable<Data> {
  return this.loading.wrap(
    'data',
    this.http.get('/api/data')
  );
}

// ❌ EVITAR - Manual en cada llamada
getData() {
  this.loading.show('data');
  this.http.get('/api/data').pipe(
    finalize(() => this.loading.hide('data'))
  ).subscribe(/*...*/);
}
```

### 6. Desuscripciones
```typescript
// ✅ BIEN - Array de subscriptions
private subscriptions: Subscription[] = [];

ngOnInit() {
  this.subscriptions.push(
    this.service.data$.subscribe(/*...*/)
  );
}

ngOnDestroy() {
  this.subscriptions.forEach(sub => sub.unsubscribe());
}

// ✅ MEJOR - takeUntilDestroyed (Angular 16+)
constructor() {
  this.service.data$
    .pipe(takeUntilDestroyed())
    .subscribe(/*...*/);
}
```

### 7. Tipado Estricto
```typescript
// ✅ BIEN - Interfaces y tipos definidos
interface User {
  id: string;
  name: string;
  email: string;
}

sendMessage(type: string, payload: User): void {
  // ...
}

// ❌ EVITAR - any
sendMessage(type: string, payload: any): void {
  // ...
}
```

---

## Testing

### Servicios
```typescript
describe('CommunicationService', () => {
  let service: CommunicationService;
  
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationService);
  });
  
  it('should send and receive messages', (done) => {
    service.onMessage('test').subscribe(msg => {
      expect(msg.payload).toEqual({ data: 'test' });
      done();
    });
    
    service.sendMessage('test', { data: 'test' });
  });
});
```

---

## Estadísticas

- **Servicios creados**: 5
- **Componentes visuales**: 2 (Toast, Loading)
- **Patrones implementados**: 6
- **Líneas de código TypeScript**: ~2,000
- **Signals utilizados**: 15+
- **Observables**: 10+

---

## Referencias

- [Angular Services](https://angular.io/guide/architecture-services)
- [RxJS Operators](https://rxjs.dev/guide/operators)
- [Angular Signals](https://angular.io/guide/signals)
- [Design Patterns](https://refactoring.guru/design-patterns)

---

**Última actualización**: 2025-12-17
**Versión**: 1.0.0
**Autor**: T4 Traveling Dev Team

