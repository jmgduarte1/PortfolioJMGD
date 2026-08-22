import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContentRepository } from '../../data-access/content-repository';
import { ExperienceItem } from '../../models/portfolio-content';
import { ExperiencePage } from './experience-page';

const experience: ExperienceItem[] = [
  {
    company: 'Northern Commerce',
    role: 'Technical Lead',
    dates: 'Sep 2022 - Apr 2026',
    location: 'London, Ontario',
    summary: 'Led frontend delivery for enterprise commerce platforms.',
    bullets: ['Mentored developers through code reviews and debugging support.'],
  },
];

describe('ExperiencePage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExperiencePage],
      providers: [
        {
          provide: ContentRepository,
          useValue: {
            getExperience: () => of(experience),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the page heading and experience timeline', async () => {
    const fixture = TestBed.createComponent(ExperiencePage);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Professional delivery timeline');
    expect(compiled.textContent).toContain('Technical Lead');
    expect(compiled.textContent).toContain('Northern Commerce');
    expect(compiled.textContent).toContain('Mentored developers');
  });
});
