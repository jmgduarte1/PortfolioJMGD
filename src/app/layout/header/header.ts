import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  LinkModel,
  NavigationItem,
  NavigationService,
} from '@headless-angular/renderer';
import { catchError, map, of, shareReplay, startWith } from 'rxjs';
import { Loader } from '../../loader/loader';

interface HeaderNavigationItem {
  id: string;
  label: string;
  href: string;
  rel: string | null;
  target: string | null;
  link: LinkModel;
}

type NavigationState =
  | { status: 'loading' }
  | { status: 'loaded'; ariaLabel: string; items: HeaderNavigationItem[] }
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
  imports: [AsyncPipe, RouterLink, Loader],
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
    if (link.type !== 'internal') {
      return;
    }

    const normalizedPath = this.normalizeInternalPath(link.path);

    void this.router.navigateByUrl(normalizedPath);
  }

  protected navigate(event: MouseEvent, link: LinkModel): void {
    if (link.type !== 'internal') {
      this.closeMobileMenu();
      return;
    }

    event.preventDefault();
    this.onLinkSelected(link);
    this.closeMobileMenu();
  }

  protected isMobileMenuOpen = false;

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:keydown.escape')
  protected closeMobileMenuOnEscape(): void {
    this.closeMobileMenu();
  }

  private toHeaderNavigationItem(item: NavigationItem): HeaderNavigationItem {
    return {
      id: item.id,
      label: item.label,
      href: this.href(item.link),
      rel: this.rel(item.link),
      target: this.target(item.link),
      link: item.link,
    };
  }

  private href(link: LinkModel): string {
    switch (link.type) {
      case 'internal':
        return this.normalizeInternalPath(link.path);
      case 'external':
        return link.url;
      case 'anchor':
        return `#${link.anchor}`;
      case 'email':
        return `mailto:${link.address}`;
      case 'telephone':
        return `tel:${link.number}`;
    }
  }

  private rel(link: LinkModel): string | null {
    if (link.type !== 'external') {
      return null;
    }

    const rel = new Set(link.rel ?? []);

    if (link.target === '_blank') {
      rel.add('noopener');
      rel.add('noreferrer');
    }

    return rel.size > 0 ? [...rel].join(' ') : null;
  }

  private target(link: LinkModel): string | null {
    return link.type === 'external' ? (link.target ?? null) : null;
  }

  private normalizeInternalPath(path: string): string {
    const normalized = path.trim().replace(/\/+$/g, '');
    const slug = normalized.replace(/^\/+/g, '');

    if (slug === '' || slug === 'home') {
      return '/';
    }

    return normalized.startsWith('/') ? normalized : `/${normalized}`;
  }
}
