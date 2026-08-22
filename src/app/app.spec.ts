import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { App } from './app';
import { ContentRepository } from './data-access/content-repository';
import { fallbackContent } from './data-access/fallback-content';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: ContentRepository,
          useValue: {
            getContent: () => of(fallbackContent),
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render brand and navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.brand')?.textContent).toContain(fallbackContent.profile.name);
    expect(compiled.querySelector('.brand__logo img')?.getAttribute('src')).toBe('/assets/logo-square.png');
    expect(compiled.querySelector('nav')?.textContent).toContain('Projects');
  });
});
