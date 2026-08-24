import { isPlatformBrowser } from '@angular/common';
import { ApplicationConfig, inject, PLATFORM_ID, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ContentRepository } from './data-access/content-repository';
import { JsonServerContentRepository } from './data-access/json-server-content.repository';
import { RuntimeConfigService } from './core/runtime-config.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideAppInitializer(() =>
      isPlatformBrowser(inject(PLATFORM_ID)) ? inject(RuntimeConfigService).load() : undefined,
    ),
    provideClientHydration(withEventReplay()),
    { provide: ContentRepository, useClass: JsonServerContentRepository },
  ],
};
