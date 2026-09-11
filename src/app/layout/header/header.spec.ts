import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavigationSchema, NavigationService } from '@jmgduarte/wp-angular-renderer';
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

  it('should let the renderer open its mobile navigation', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('.navigation__toggle') as HTMLButtonElement;

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('true');
    expect(compiled.querySelector('.navigation__mobile-panel--open')?.textContent).toContain('Projects');
  });

  it('should let the renderer close its mobile navigation', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const toggle = compiled.querySelector('.navigation__toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();

    toggle.click();
    fixture.detectChanges();

    expect(toggle.getAttribute('aria-expanded')).toBe('false');
  });

  it('should render the mobile navigation links from the renderer', async () => {
    const fixture = TestBed.createComponent(Header);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const mobileLinkLabels = [...compiled.querySelectorAll('.navigation__list--mobile a')].map(
      (link) => link.textContent?.trim(),
    );

    expect(mobileLinkLabels).toContain('Projects');
  });
});
