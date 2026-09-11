import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHeadlessRenderer } from '@headless-angular/renderer';
import { appEnvironment } from './core/app-environment.generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    provideHeadlessRenderer({
      apiBaseUrl: appEnvironment.apiBaseUrl,
      defaultLocale: appEnvironment.defaultLocale,
      restRouteMode: 'pretty',
      unsupportedBlockStrategy: 'fallback',
      renderPageTitle: false
    }),
  ],
};
