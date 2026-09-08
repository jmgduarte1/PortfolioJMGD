import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './loader.html',
  styleUrl: './loader.scss',
})
export class Loader {
  loadingMessage = input<string>('');
  compact = input(false);
}
