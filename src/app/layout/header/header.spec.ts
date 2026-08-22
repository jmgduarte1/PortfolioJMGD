import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ContentRepository } from '../../data-access/content-repository';
import { fallbackContent } from '../../data-access/fallback-content';
import { Header } from './header';

describe('Header', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
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

  it('should render the brand, logo, and navigation', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('.brand')?.textContent).toContain(fallbackContent.profile.name);
    expect(compiled.querySelector('.brand__logo img')?.getAttribute('src')).toBe('/assets/logo-square.png');
    expect(compiled.querySelector('nav')?.getAttribute('aria-label')).toBe('Primary navigation');
    expect(compiled.querySelector('nav')?.textContent).toContain('Projects');
  });

  it('should open the mobile navigation from the hamburger button', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('.menu-toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('#mobile-navigation')?.textContent).toContain('Projects');
    expect(compiled.querySelector('.mobile-nav__close')).toBeTruthy();
  });

  it('should close the mobile navigation from the close button', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.menu-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    (compiled.querySelector('.mobile-nav__close') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(compiled.querySelector('#mobile-navigation')).toBeNull();
    expect(compiled.querySelector('.menu-toggle')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should close the mobile navigation when the backdrop is clicked', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.menu-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    (compiled.querySelector('.mobile-menu__backdrop') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(compiled.querySelector('#mobile-navigation')).toBeNull();
  });

  it('should close the mobile navigation when a mobile link is clicked', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    (compiled.querySelector('.menu-toggle') as HTMLButtonElement).click();
    fixture.detectChanges();

    (compiled.querySelector('.mobile-nav__links a') as HTMLAnchorElement).click();
    fixture.detectChanges();

    expect(compiled.querySelector('#mobile-navigation')).toBeNull();
  });
});
