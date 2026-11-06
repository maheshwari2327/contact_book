// Layer: Frontend Layer (Application Configuration)
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';

/**
 * Global application configuration for Angular standalone architecture.
 * Configures zone change detection and registers HttpClient provider globally.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    // Optimizes change detection cycle
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Configures Angular's modern HttpClient for API calls to Spring Boot
    provideHttpClient()
  ]
};

