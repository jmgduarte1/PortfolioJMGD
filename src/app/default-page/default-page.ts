import { AsyncPipe, DOCUMENT, isPlatformBrowser, JsonPipe } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PremiumPageRendererComponent } from '@jmgduarte/headless-angular-premium';
import type { PageSchema } from '@jmgduarte/headless-core';
import { catchError, combineLatest, distinctUntilChanged, map, of, startWith, switchMap } from 'rxjs';
import { Loader } from '../loader/loader';
import { HeadlessContentService } from '../core/headless-content.service';

type DefaultPageState =
  | { status: 'loading' }
  | { status: 'loaded'; schema: PageSchema }
  | { status: 'error'; slug: string; error: DefaultPageError };

interface DefaultPageError {
  name: string;
  message: string;
  code?: string;
  issues?: unknown;
  cause?: unknown;
}

@Component({
  selector: 'app-default-page',
  imports: [AsyncPipe, JsonPipe, PremiumPageRendererComponent, Loader],
  templateUrl: './default-page.html',
  styleUrl: './default-page.scss',
})
export class DefaultPage {
  private readonly route = inject(ActivatedRoute);
  private readonly contentService = inject(HeadlessContentService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  readonly pageState$ = combineLatest([this.route.paramMap, this.route.data, this.route.fragment]).pipe(
    map(([params, data, fragment]) => ({
      slug: this.normalizeSlug(String(data['slug'] ?? params.get('slug') ?? 'home')),
      fragment,
    })),
    distinctUntilChanged((previous, current) => previous.slug === current.slug && previous.fragment === current.fragment),
    switchMap(({ slug, fragment }) =>
      this.contentService.getPage(slug).pipe(
        map((schema): DefaultPageState => {
          if (fragment) {
            this.scrollToFragment(fragment);
          }

          return { status: 'loaded', schema };
        }),
        startWith({ status: 'loading' } satisfies DefaultPageState),
        catchError((error: unknown) =>
          of({ status: 'error', slug, error: this.toDefaultPageError(error) } satisfies DefaultPageState),
        ),
      ),
    ),
  );

  private scrollToFragment(fragment: string): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    let attempts = 0;
    const findTarget = (): void => {
      const target = this.document.getElementById(fragment);

      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        return;
      }

      attempts += 1;
      if (attempts < 120) {
        view.requestAnimationFrame(findTarget);
      }
    };

    view.requestAnimationFrame(findTarget);
  }

  private normalizeSlug(slug: string): string {
    const normalized = slug.replace(/^\/+|\/+$/g, '');

    return normalized === '' ? 'home' : normalized;
  }

  private toDefaultPageError(error: unknown): DefaultPageError {
    if (error instanceof Error) {
      const errorRecord = error as Error & {
        code?: unknown;
        issues?: unknown;
        cause?: unknown;
      };

      return {
        name: error.name,
        message: error.message,
        code: typeof errorRecord.code === 'string' ? errorRecord.code : undefined,
        issues: errorRecord.issues,
        cause: this.describeCause(errorRecord.cause),
      };
    }

    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  private describeCause(cause: unknown): unknown {
    if (cause instanceof Error) {
      return {
        name: cause.name,
        message: cause.message,
      };
    }

    return cause;
  }

  formatTitle(title: string): string {
    const normalized = title.trim();
    if (normalized === 'home') {
      return 'Juan Manuel Gomez | Senior Software Engineer & Technical Lead';
    }

    const displayTitle = normalized.length > 0 ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : 'Home';

    return `${displayTitle} | Juan Manuel Gomez`;
  }
}
