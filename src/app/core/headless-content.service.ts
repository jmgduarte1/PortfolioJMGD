import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import {
  Injectable,
  PendingTasks,
  inject,
  makeStateKey,
  PLATFORM_ID,
  TransferState,
  type StateKey,
} from '@angular/core';
import { RestContentClient } from '@jmgduarte/headless-rest';
import type { NavigationSchema, PageSchema } from '@jmgduarte/headless-core';
import { defer, from, of, type Observable } from 'rxjs';
import { finalize, shareReplay, tap } from 'rxjs/operators';
import { appEnvironment } from './app-environment.generated';

const TRANSFER_STATE_VERSION = 'v1';

@Injectable({ providedIn: 'root' })
export class HeadlessContentService {
  private readonly client = inject(RestContentClient);
  private readonly pendingTasks = inject(PendingTasks);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly transferState = inject(TransferState);
  private readonly pageRequests = new Map<string, Observable<PageSchema>>();
  private readonly navigationRequests = new Map<string, Observable<NavigationSchema>>();

  getPage(slug: string, locale: string = appEnvironment.defaultLocale): Observable<PageSchema> {
    const cacheKey = this.createCacheKey('page', slug, locale);
    const cachedRequest = this.pageRequests.get(cacheKey);

    if (cachedRequest) {
      return cachedRequest;
    }

    const request = this.createRequest(
      makeStateKey<PageSchema>(cacheKey),
      () => this.client.getPage(slug, { locale }),
    );
    this.pageRequests.set(cacheKey, request);
    return request;
  }

  getNavigation(location: string, locale: string = appEnvironment.defaultLocale): Observable<NavigationSchema> {
    const cacheKey = this.createCacheKey('navigation', location, locale);
    const cachedRequest = this.navigationRequests.get(cacheKey);

    if (cachedRequest) {
      return cachedRequest;
    }

    const request = this.createRequest(
      makeStateKey<NavigationSchema>(cacheKey),
      () => this.client.getNavigation(location, { locale }),
    );
    this.navigationRequests.set(cacheKey, request);
    return request;
  }

  private createCacheKey(resource: 'page' | 'navigation', identifier: string, locale: string): string {
    return [
      'headless-content',
      TRANSFER_STATE_VERSION,
      resource,
      encodeURIComponent(identifier),
      'locale',
      encodeURIComponent(locale),
    ].join(':');
  }

  private createRequest<T>(stateKey: StateKey<T>, load: () => Promise<T>): Observable<T> {
    const request = defer(() => {
      if (isPlatformBrowser(this.platformId) && this.transferState.hasKey(stateKey)) {
        const transferredValue = this.transferState.get(stateKey, undefined as T);
        this.transferState.remove(stateKey);
        return of(transferredValue);
      }

      const cleanupPendingTask = isPlatformServer(this.platformId) ? this.pendingTasks.add() : undefined;

      return from(load()).pipe(
        tap((value) => {
          if (isPlatformServer(this.platformId)) {
            this.transferState.set(stateKey, value);
          }
        }),
        finalize(() => cleanupPendingTask?.()),
      );
    }).pipe(shareReplay({ bufferSize: 1, refCount: false }));

    return request;
  }
}
