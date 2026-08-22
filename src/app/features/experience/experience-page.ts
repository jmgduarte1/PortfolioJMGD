import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ContentRepository } from '../../data-access/content-repository';

@Component({
  selector: 'app-experience-page',
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './experience-page.html',
  styleUrl: './experience-page.scss',
})
export class ExperiencePage {
  private readonly contentRepository = inject(ContentRepository);
  protected readonly experience$ = this.contentRepository.getExperience();
}
