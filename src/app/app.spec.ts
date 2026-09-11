import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavigationSchema, NavigationService } from '@jmgduarte/wp-angular-renderer';
import { of } from 'rxjs';
import { App } from './app';

describe('App', () => {
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
      imports: [App],
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
    expect(compiled.querySelector('.brand')?.textContent).toContain('Juan Manuel Gomez');
    expect(compiled.querySelector('.brand__logo img')?.getAttribute('src')).toBe('/assets/logo-square.png');
    expect(compiled.querySelector('nav')?.textContent).toContain('Projects');
  });
});
