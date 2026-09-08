import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { HeadlessPageRendererComponent, PageService } from '@headless-angular/renderer';
import { catchError, map, of, startWith, type Observable } from 'rxjs';

type ObservableValue<T> = T extends Observable<infer Value> ? Value : never;
type PageSchema = ObservableValue<ReturnType<PageService['getPage']>>;

type WpTestState =
  | { status: 'loading' }
  | { status: 'loaded'; schema: PageSchema }
  | { status: 'error'; error: WpTestError };

interface WpTestError {
  name: string;
  message: string;
  code?: string;
  issues?: unknown;
  cause?: unknown;
}

@Component({
  selector: 'app-wp-test',
  imports: [AsyncPipe, JsonPipe, HeadlessPageRendererComponent],
  templateUrl: './wp-test.html',
  styleUrl: './wp-test.scss',
})
export class WpTest {
  private readonly pageService = inject(PageService);

  readonly pageState$ = this.pageService.getPage('home').pipe(
    map((schema): WpTestState => ({ status: 'loaded', schema })),
    startWith({ status: 'loading' } satisfies WpTestState),
    catchError((error: unknown) => of({ status: 'error', error: this.toWpTestError(error) } satisfies WpTestState)),
  );

  private toWpTestError(error: unknown): WpTestError {
    if (error instanceof Error) {
      const errorRecord = error as Error & {
        code?: unknown;
        issues?: unknown;
        cause?: unknown;
      };

      return {
        name: error.name,
        message: error.message,
        code: typeof errorRecord.code === 'string' ? errorRecord.code : undefined,
        issues: errorRecord.issues,
        cause: this.describeCause(errorRecord.cause),
      };
    }

    return {
      name: 'UnknownError',
      message: String(error),
    };
  }

  private describeCause(cause: unknown): unknown {
    if (cause instanceof Error) {
      return {
        name: cause.name,
        message: cause.message,
      };
    }

    return cause;
  }
}
