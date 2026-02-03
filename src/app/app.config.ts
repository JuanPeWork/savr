import { ApplicationConfig, InjectionToken, LOCALE_ID, provideBrowserGlobalErrorListeners, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { StoragePort } from '@core/storage/storage-port.interface';
import { LocalForageStorageService } from '@core/storage/localforage-storage.service';

registerLocaleData(localeEs, 'es');

export const STORAGE = new InjectionToken<StoragePort>('FINANCE_STORAGE');

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideCharts(withDefaultRegisterables()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: LOCALE_ID, useValue: 'es' },
    {
      provide: STORAGE,
      useClass: LocalForageStorageService,
    }
  ]
};
