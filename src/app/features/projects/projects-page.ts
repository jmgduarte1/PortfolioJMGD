import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ContentRepository } from '../../data-access/content-repository';

@Component({
  selector: 'app-projects-page',
  imports: [AsyncPipe, MatCardModule, MatChipsModule],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
})
export class ProjectsPage {
  private readonly contentRepository = inject(ContentRepository);
  protected readonly projects$ = this.contentRepository.getProjects();
}
