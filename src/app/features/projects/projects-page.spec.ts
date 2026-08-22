import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContentRepository } from '../../data-access/content-repository';
import { Project } from '../../models/portfolio-content';
import { ProjectsPage } from './projects-page';

const projects: Project[] = [
  {
    id: 1,
    slug: 'magento-configurable-product-ux',
    title: 'Adobe Commerce Configurable Product UX Optimization',
    summary: 'Customized PDP behavior for configurable products.',
    impact: 'Reduced customer interaction in applicable scenarios.',
    tags: ['Adobe Commerce', 'Magento 2'],
  },
];

describe('ProjectsPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [
        {
          provide: ContentRepository,
          useValue: {
            getProjects: () => of(projects),
          },
        },
      ],
    }).compileComponents();
  });

  it('should render the page heading and project cards', async () => {
    const fixture = TestBed.createComponent(ProjectsPage);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain('Selected project evidence');
    expect(compiled.textContent).toContain('Adobe Commerce Configurable Product UX Optimization');
    expect(compiled.textContent).toContain('Magento 2');
  });
});
