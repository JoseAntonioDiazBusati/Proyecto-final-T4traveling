    )
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
import { NetworkAwarePreloadStrategy } from './strategies/preloading.strategy';

/**
 * Configuración optimizada de la aplicación
 *
    provideRouter(
      routes,
      // Estrategia de preloading consciente de la red
      withPreloading(NetworkAwarePreloadStrategy),
      withComponentInputBinding(),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loggingInterceptor,  // Logging primero para capturar todo
        authInterceptor,     // Añade token de autenticación
      withPreloading(PreloadAllModules),
  ]
};
