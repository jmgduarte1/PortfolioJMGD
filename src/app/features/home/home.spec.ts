import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ContentRepository } from '../../data-access/content-repository';
import { fallbackContent } from '../../data-access/fallback-content';
import { ContactSubmission, PortfolioContent } from '../../models/portfolio-content';
import { Home } from './home';

const testContent: PortfolioContent = {
  ...fallbackContent,
  projects: [
    {
      id: 1,
      slug: 'portfolio',
      title: 'Angular SSR Portfolio Platform',
      summary: 'Built with Angular SSR and Angular Material.',
      impact: 'Demonstrates Angular architecture and accessibility planning.',
      tags: ['Angular', 'SSR'],
    },
  ],
  experience: [
    {
      company: 'Northern Commerce',
      role: 'Technical Lead',
      dates: 'Sep 2022 - Apr 2026',
      location: 'London, Ontario',
      summary: 'Led frontend delivery for enterprise commerce platforms.',
      bullets: ['Mentored developers.'],
    },
  ],
};

describe('Home', () => {
  let submitContactCalls: ContactSubmission[];

  beforeEach(async () => {
    submitContactCalls = [];

    await TestBed.configureTestingModule({
      imports: [Home],
      providers: [
        provideRouter([]),
        {
          provide: ContentRepository,
          useValue: {
            getContent: () => of(testContent),
            submitContact: (submission: ContactSubmission) => {
              submitContactCalls.push(submission);
              return of(submission);
            },
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the hero and homepage sections', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(testContent.hero.headline);
    expect(compiled.querySelector('#about-title')?.textContent).toContain('Senior frontend experience');
    expect(compiled.querySelector('#expertise-title')?.textContent).toContain('Enterprise frontend strengths');
    expect(compiled.querySelector('#contact-title')?.textContent).toContain('Start a focused conversation');
  });

  it('should render hero CTAs with the configured destinations', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    const ctas = Array.from(compiled.querySelectorAll('.hero__actions a')) as HTMLAnchorElement[];

    expect(ctas[0].textContent).toContain('Contact Me');
    expect(ctas[0].getAttribute('href')).toBe('/#contact');
    expect(ctas[1].textContent).toContain('View Projects');
    expect(ctas[1].getAttribute('href')).toBe('/projects');
  });

  it('should show validation errors and not submit an invalid contact form', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(submitContactCalls.length).toBe(0);
    expect(compiled.textContent).toContain('Please enter your name.');
    expect(compiled.textContent).toContain('Please enter a valid email address.');
    expect(compiled.textContent).toContain('Please include at least 20 characters.');
  });

  it('should submit a valid contact form and show success feedback', async () => {
    const fixture = TestBed.createComponent(Home);
    fixture.detectChanges();
    await fixture.whenStable();

    const component = fixture.componentInstance as unknown as {
      contactForm: {
        setValue(value: { name: string; email: string; company: string; message: string }): void;
      };
    };

    component.contactForm.setValue({
      name: 'Jane Recruiter',
      email: 'jane@example.com',
      company: 'Example Co',
      message: 'I would like to discuss a senior frontend opportunity with a job post link.',
    });

    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(submitContactCalls.length).toBe(1);
    expect(submitContactCalls[0].name).toBe('Jane Recruiter');
    expect(submitContactCalls[0].email).toBe('jane@example.com');
    expect(submitContactCalls[0].createdAt).toBeTruthy();
    expect((fixture.nativeElement as HTMLElement).textContent).toContain('Message saved locally.');
  });
});
