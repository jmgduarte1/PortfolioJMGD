import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { ContentRepository } from '../../data-access/content-repository';

@Component({
  selector: 'app-simple-page',
  imports: [AsyncPipe, MatCardModule, MatChipsModule],
  templateUrl: './simple-page.html',
  styleUrl: './simple-page.scss',
})
export class SimplePage {
  private readonly route = inject(ActivatedRoute);
  private readonly contentRepository = inject(ContentRepository);
  protected readonly page = this.route.snapshot.data['page'] ?? 'accessibility';
  protected readonly content$ = this.contentRepository.getContent();
}
