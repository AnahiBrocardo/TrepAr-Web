import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
<<<<<<< HEAD
=======
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
>>>>>>> S.D.Costos

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
<<<<<<< HEAD
  provideHttpClient()]
=======
  provideHttpClient(), provideAnimationsAsync()]
>>>>>>> S.D.Costos
};
