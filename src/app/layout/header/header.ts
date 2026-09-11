import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LinkModel,
  NavigationItem,
  NavigationRendererComponent,
  NavigationService,
} from '@jmgduarte/wp-angular-renderer';
import { catchError, map, of, shareReplay, startWith } from 'rxjs';
import { Loader } from '../../loader/loader';

type NavigationState =
  | { status: 'loading' }
  | { status: 'loaded'; ariaLabel: string; items: NavigationItem[] }
  | { status: 'error'; error: NavigationError };

interface NavigationError {
  name: string;
  message: string;
  code?: string;
  issues?: unknown;
  cause?: unknown;
}

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLink, Loader, NavigationRendererComponent],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly router = inject(Router);
  private readonly navigationService = inject(NavigationService);

  readonly menuState$ = this.navigationService.getMenu('primary').pipe(
    map((schema): NavigationState => ({
      status: 'loaded',
      ariaLabel: schema.menu.ariaLabel,
      items: schema.items.map((item) => this.toHeaderNavigationItem(item)),
    })),
    startWith({ status: 'loading' } satisfies NavigationState),
    catchError((error: unknown) =>
      of({ status: 'error', error: this.toNavigationError(error) } satisfies NavigationState),
    ),
    shareReplay({ bufferSize: 1, refCount: true }),
  );

  private toNavigationError(error: unknown): NavigationError {
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

  onLinkSelected(link: LinkModel): void {
    if (link.type === 'anchor') {
      const currentPath = this.router.url.split(/[?#]/, 1)[0].replace(/\/+$/g, '');

      if (currentPath !== '') {
        void this.router.navigateByUrl(`/#${link.anchor}`);
      }

      return;
    }

    if (link.type !== 'internal') {
      return;
    }

    const normalizedPath = this.normalizeInternalPath(link.path);

    void this.router.navigateByUrl(normalizedPath);
  }

  private toHeaderNavigationItem(item: NavigationItem): NavigationItem {
    return {
      id: item.id,
      label: item.label,
      link: this.toHeaderLink(item.link),
      ...(item.children
        ? { children: item.children.map((child) => this.toHeaderNavigationItem(child)) }
        : {}),
    };
  }

  private toHeaderLink(link: LinkModel): LinkModel {
    if (link.type === 'internal') {
      return { ...link, path: this.normalizeInternalPath(link.path) };
    }

    if (link.type !== 'external' || link.target !== '_blank') {
      return link;
    }

    return {
      ...link,
      rel: [...new Set([...(link.rel ?? []), 'noopener', 'noreferrer'])],
    };
  }

  private normalizeInternalPath(path: string): string {
    const trimmed = path.trim();

    // Some WordPress menu configurations return an absolute site URL even
    // though the item is classified as an internal link.
    if (/^https?:\/\//i.test(trimmed)) {
      try {
        const url = new URL(trimmed);
        return this.normalizeInternalPath(`${url.pathname}${url.search}${url.hash}`);
      } catch {
        // Fall through to the regular path normalization for malformed data.
      }
    }

    const normalized = trimmed.replace(/\/+$/g, '');
    const slug = normalized.replace(/^\/+/g, '');

    if (slug === '' || slug === 'home') {
      return '/';
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
}
