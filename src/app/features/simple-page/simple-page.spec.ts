import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ContentRepository } from '../../data-access/content-repository';
import { fallbackContent } from '../../data-access/fallback-content';
import { SimplePage } from './simple-page';

describe('SimplePage', () => {
  async function setup(page: string) {
    await TestBed.configureTestingModule({
      imports: [SimplePage],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: { page },
            },
          },
        },
        {
          provide: ContentRepository,
          useValue: {
            getContent: () =>
              of({
                ...fallbackContent,
                certifications: [
                  {
                    name: 'Mastering Angular Development',
                    issuer: 'Edureka',
                    issued: '2026',
                    url: 'https://example.com/angular',
                  },
                ],
              }),
          },
        },
      ],
    }).compileComponents();

    const fixture = TestBed.createComponent(SimplePage);
    fixture.detectChanges();
    await fixture.whenStable();
    return fixture.nativeElement as HTMLElement;
  }

  afterEach(() => TestBed.resetTestingModule());

  it('should render certifications content', async () => {
    const compiled = await setup('certifications');

    expect(compiled.querySelector('h1')?.textContent).toContain('Certifications and recent training');
    expect(compiled.textContent).toContain('Mastering Angular Development');
  });

  it('should render skills content', async () => {
    const compiled = await setup('skills');

    expect(compiled.querySelector('h1')?.textContent).toContain('Technical skills');
    expect(compiled.textContent).toContain('TypeScript');
  });

  it('should render accessibility content by default page type', async () => {
    const compiled = await setup('accessibility');

    expect(compiled.querySelector('h1')?.textContent).toContain('Accessibility commitment');
    expect(compiled.textContent).toContain('WCAG 2.0 Level AA');
  });
});
