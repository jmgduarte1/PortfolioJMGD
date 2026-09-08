import { isPlatformBrowser } from '@angular/common';
import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ContentRepository } from './data-access/content-repository';
import { JsonServerContentRepository } from './data-access/json-server-content.repository';
import { RuntimeConfigService } from './core/runtime-config.service';
import { provideHeadlessRenderer } from '@headless-angular/renderer';
import { appEnvironment } from './core/app-environment.generated';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideHttpClient(withFetch()),
    provideAppInitializer(() =>
      isPlatformBrowser(inject(PLATFORM_ID)) ? inject(RuntimeConfigService).load() : undefined,
    ),
    provideClientHydration(withEventReplay()),
    { provide: ContentRepository, useClass: JsonServerContentRepository },
    provideHeadlessRenderer({
      apiBaseUrl: appEnvironment.apiBaseUrl,
      defaultLocale: appEnvironment.defaultLocale,
      restRouteMode: 'query',
      unsupportedBlockStrategy: 'fallback',
      renderPageTitle: false
    }),
  ],
};
