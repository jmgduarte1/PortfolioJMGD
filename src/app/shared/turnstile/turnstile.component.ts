import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnDestroy, PLATFORM_ID, inject, output, viewChild } from '@angular/core';
import { RuntimeConfigService } from '../../core/runtime-config.service';

interface TurnstileApi {
  render(element: HTMLElement, options: Record<string, unknown>): string;
  reset(widgetId: string): void;
  remove(widgetId: string): void;
}

declare global { interface Window { turnstile?: TurnstileApi; } }

let scriptPromise: Promise<void> | undefined;

@Component({
  selector: 'app-turnstile',
  templateUrl: './turnstile.component.html',
  styleUrl: './turnstile.component.scss',
})
export class TurnstileComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly runtimeConfig = inject(RuntimeConfigService);
  private readonly container = viewChild.required<ElementRef<HTMLElement>>('container');
  private widgetId: string | undefined;

  readonly tokenChange = output<string>();
  readonly verificationError = output<void>();

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    void loadTurnstile().then(() => this.render()).catch(() => this.verificationError.emit());
  }

  reset(): void {
    if (this.widgetId && window.turnstile) window.turnstile.reset(this.widgetId);
    this.tokenChange.emit('');
  }

  ngOnDestroy(): void {
    if (this.widgetId && window.turnstile) window.turnstile.remove(this.widgetId);
  }

  private render(): void {
    if (!window.turnstile) return;
    this.widgetId = window.turnstile.render(this.container().nativeElement, {
      sitekey: this.runtimeConfig.value.turnstileSiteKey,
      action: 'contact',
      size: 'flexible',
      callback: (token: string) => this.tokenChange.emit(token),
      'expired-callback': () => this.tokenChange.emit(''),
      'error-callback': () => { this.tokenChange.emit(''); this.verificationError.emit(); },
    });
  }
}

function loadTurnstile(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Turnstile failed to load.'));
    document.head.appendChild(script);
  });
  return scriptPromise;
}
