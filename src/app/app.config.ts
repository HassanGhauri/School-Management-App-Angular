import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';

import { DialogService } from 'primeng/dynamicdialog';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withFetch()),
    DialogService,
    provideAnimations(),
    providePrimeNG({
      theme: {
        preset: Lara,
      },
    }),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
  ],
};
