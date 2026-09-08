import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavigationSchema, NavigationService } from '@headless-angular/renderer';
import { of } from 'rxjs';
import { Header } from './header';

describe('Header', () => {
  const primaryMenu: NavigationSchema = {
    schemaVersion: '1.0',
    location: 'primary',
    menu: {
      ariaLabel: 'Primary navigation',
      orientation: 'horizontal',
    },
    items: [
      {
        id: 'home',
        label: 'Home',
        link: { type: 'internal', path: '/home' },
      },
      {
        id: 'projects',
        label: 'Projects',
        link: { type: 'internal', path: '/projects' },
      },
    ],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([
          { path: '', children: [] },
          { path: 'projects', children: [] },
        ]),
        {
          provide: NavigationService,
          useValue: {
            getMenu: () => of(primaryMenu),
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

    expect(compiled.querySelector('.brand')?.textContent).toContain('Juan Manuel Gomez');
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
