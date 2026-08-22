import { TestBed } from '@angular/core/testing';
import { Footer } from './footer';

describe('Footer', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Footer],
    }).compileComponents();
  });

  it('should render footer profile details', () => {
    const fixture = TestBed.createComponent(Footer);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Juan Manuel Gomez Duarte');
    expect(compiled.textContent).toContain('Senior Frontend / Full-stack Developer');
    expect(compiled.textContent).toContain('London, Ontario, Canada');
  });
});
