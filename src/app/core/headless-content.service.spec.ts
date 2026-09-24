import { PLATFORM_ID } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TransferState } from '@angular/core';
import type { NavigationSchema, PageSchema } from '@jmgduarte/headless-core';
import { RestContentClient } from '@jmgduarte/headless-rest';
import { firstValueFrom } from 'rxjs';
import { HeadlessContentService } from './headless-content.service';

describe('HeadlessContentService', () => {
  const page: PageSchema = {
    schemaVersion: '1.0',
    locale: 'en-CA',
    page: {},
  } as unknown as PageSchema;
  const navigation: NavigationSchema = {
    schemaVersion: '1.0',
    location: 'primary',
    menu: { ariaLabel: 'Primary navigation', orientation: 'horizontal' },
    items: [],
  };

  function configure(platformId: 'browser' | 'server', client: Partial<RestContentClient>): TransferState {
    TestBed.configureTestingModule({
      providers: [
        HeadlessContentService,
        { provide: RestContentClient, useValue: client },
        { provide: PLATFORM_ID, useValue: platformId },
      ],
    });

    return TestBed.inject(TransferState);
  }

  it('stores successful SSR page and navigation responses in TransferState', async () => {
    const transferState = configure('server', {
      getPage: async () => page,
      getNavigation: async () => navigation,
    });
    const service = TestBed.inject(HeadlessContentService);

    await firstValueFrom(service.getPage('home'));
    await firstValueFrom(service.getNavigation('primary'));

    expect(transferState.toJson()).toContain('"page":{}');
    expect(transferState.toJson()).toContain('primary');
  });

  it('does not store failed SSR requests', async () => {
    const transferState = configure('server', {
      getPage: async () => {
        throw new Error('backend unavailable');
      },
    });
    const service = TestBed.inject(HeadlessContentService);

    await expect(firstValueFrom(service.getPage('home'))).rejects.toThrow('backend unavailable');

    expect(transferState.isEmpty).toBe(true);
  });

  it('uses and removes transferred browser state without calling the client', async () => {
    const transferState = configure('server', { getPage: async () => page });
    const serverService = TestBed.inject(HeadlessContentService);
    await firstValueFrom(serverService.getPage('home'));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        HeadlessContentService,
        { provide: RestContentClient, useValue: { getPage: vi.fn() } },
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: TransferState, useValue: transferState },
      ],
    });

    const browserClient = TestBed.inject(RestContentClient);
    const browserService = TestBed.inject(HeadlessContentService);

    await expect(firstValueFrom(browserService.getPage('home'))).resolves.toEqual(page);

    expect(browserClient.getPage).not.toHaveBeenCalled();
    expect(transferState.isEmpty).toBe(true);
  });

  it('falls back to the browser client when no transferred state exists', async () => {
    const getPage = vi.fn(async () => page);
    configure('browser', { getPage });
    const service = TestBed.inject(HeadlessContentService);

    await firstValueFrom(service.getPage('home'));

    expect(getPage).toHaveBeenCalledTimes(1);
  });

  it('shares requests by resource identifier and locale', async () => {
    const getPage = vi.fn(async () => page);
    configure('browser', { getPage });
    const service = TestBed.inject(HeadlessContentService);

    await Promise.all([
      firstValueFrom(service.getPage('home', 'en-CA')),
      firstValueFrom(service.getPage('home', 'en-CA')),
    ]);
    await firstValueFrom(service.getPage('home', 'fr-CA'));

    expect(getPage).toHaveBeenCalledTimes(2);
  });
});
