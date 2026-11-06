// Layer: Frontend Layer (Application Bootstrap)
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

/**
 * Main TypeScript entry point that bootstraps the standalone AppComponent.
 */
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error('Failed to bootstrap Angular Contact Book:', err));

