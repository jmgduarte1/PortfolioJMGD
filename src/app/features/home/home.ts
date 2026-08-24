import { AsyncPipe } from '@angular/common';
import { Component, inject, viewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { SeoService } from '../../core/seo.service';
import { ContentRepository } from '../../data-access/content-repository';
import { ContactService } from '../../core/contact.service';
import { TurnstileComponent } from '../../shared/turnstile/turnstile.component';

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
    TurnstileComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  private readonly contentRepository = inject(ContentRepository);
  private readonly formBuilder = inject(FormBuilder);
  private readonly seo = inject(SeoService);
  private readonly contactService = inject(ContactService);
  private readonly turnstile = viewChild(TurnstileComponent);

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
    turnstileToken: ['', Validators.required],
    website: [''],
  });

  protected submitContact(formDirective: FormGroupDirective): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.submitStatus = 'idle';

    this.contactService
      .submit(this.contactForm.getRawValue())
      .pipe(finalize(() => (this.isSubmitting = false)))
      .subscribe({
        next: () => {
          this.submitStatus = 'success';
          this.resetContactForm(formDirective);
        },
        error: () => {
          this.submitStatus = 'error';
          this.turnstile()?.reset();
        },
      });
  }

  protected setTurnstileToken(token: string): void {
    this.contactForm.controls.turnstileToken.setValue(token);
  }

  private resetContactForm(formDirective: FormGroupDirective): void {
    const emptyContactForm = {
      name: '',
      email: '',
      company: '',
      message: '',
      turnstileToken: '',
      website: '',
    };

    this.turnstile()?.reset();
    formDirective.resetForm(emptyContactForm);
    this.contactForm.reset(emptyContactForm);
    this.contactForm.markAsPristine();
    this.contactForm.markAsUntouched();
    this.contactForm.updateValueAndValidity();
  }
}
