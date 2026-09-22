import { Injectable, inject } from '@angular/core';
import { RestContentClient } from '@jmgduarte/headless-rest';
import type { NavigationSchema, PageSchema } from '@jmgduarte/headless-core';
import { defer, type Observable } from 'rxjs';
import { appEnvironment } from './app-environment.generated';

@Injectable({ providedIn: 'root' })
export class HeadlessContentService {
  private readonly client = inject(RestContentClient);

  getPage(slug: string): Observable<PageSchema> {
    return defer(() => this.client.getPage(slug, { locale: appEnvironment.defaultLocale }));
  }

  getNavigation(location: string): Observable<NavigationSchema> {
    return defer(() => this.client.getNavigation(location, { locale: appEnvironment.defaultLocale }));
  }
}
