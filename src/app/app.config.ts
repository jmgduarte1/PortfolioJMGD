import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHeadlessAngular } from '@jmgduarte/headless-angular';
import { withPremiumSeo } from '@jmgduarte/headless-angular-premium';
import { RestContentClient, RestTransport } from '@jmgduarte/headless-rest';
import { appEnvironment } from './core/app-environment.generated';

const restTransport = new RestTransport({ baseUrl: appEnvironment.apiBaseUrl });
const contentClient = new RestContentClient({
  transport: restTransport,
  endpoints: {
    pageBySlug: ({ slug, locale }) => withLocale(`/wp-json/headless-renderer/v1/pages/${encodeURIComponent(slug)}`, locale),
    navigationByLocation: ({ location, locale }) =>
      withLocale(`/wp-json/headless-renderer/v1/menus/${encodeURIComponent(location)}`, locale),
    submitForm: ({ formId }) => `/wp-json/headless-renderer/v1/forms/${encodeURIComponent(formId)}/submit`,
  },
});

function withLocale(path: string, locale?: string): string {
  return locale ? `${path}?locale=${encodeURIComponent(locale)}` : path;
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled' })),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    { provide: RestContentClient, useValue: contentClient },
    provideHeadlessAngular(
      { contentClient, unsupportedBlocks: { strategy: 'fallback' }, renderPageTitle: false },
      withPremiumSeo({ frontendUrl: appEnvironment.frontendBaseUrl }),
    ),
  ],
};
