import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { SeoService } from '../../core/seo.service';
import { ContentRepository } from '../../data-access/content-repository';

@Component({
  selector: 'app-home',
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly contentRepository = inject(ContentRepository);
  private readonly formBuilder = inject(FormBuilder);
  private readonly seo = inject(SeoService);

  protected readonly content$ = this.contentRepository.getContent().pipe(
    tap((content) => this.seo.apply(content.seo)),
  );

  protected isSubmitting = false;
  protected submitStatus: 'idle' | 'success' | 'error' = 'idle';

  protected readonly contactForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    company: [''],
    message: ['', [Validators.required, Validators.minLength(20)]],
  });

  protected submitContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';

    this.contentRepository
      .submitContact({
        ...this.contactForm.getRawValue(),
        createdAt: new Date().toISOString(),
      })
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.submitStatus = 'success';
          this.contactForm.reset();
        },
        error: () => {
          this.submitStatus = 'error';
        },
      });
  }
}
