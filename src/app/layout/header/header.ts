import { AsyncPipe } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ContentRepository } from '../../data-access/content-repository';

@Component({
  selector: 'app-header',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly contentRepository = inject(ContentRepository);
  protected readonly content$ = this.contentRepository.getContent();
  protected isMobileMenuOpen = false;

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  @HostListener('window:keydown.escape')
  protected closeMobileMenuOnEscape(): void {
    this.closeMobileMenu();
  }
}
