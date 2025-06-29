import { SafeHtmlPipe } from './safe-html.pipe';
import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('SafeHtmlPipe', () => {
  let pipe: SafeHtmlPipe;
  let sanitizer: DomSanitizer;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SafeHtmlPipe,
        {
          provide: DomSanitizer,
          useValue: {
            bypassSecurityTrustHtml: (value: string) => value
          }
        }
      ]
    });

    // Obtener las instancias inyectadas
    pipe = TestBed.inject(SafeHtmlPipe);
    sanitizer = TestBed.inject(DomSanitizer);
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform newlines into <br> tags', () => {
    const inputText = 'Line 1\nLine 2\nLine 3';
    const expectedOutput = 'Line 1<br>Line 2<br>Line 3';
    expect(pipe.transform(inputText)).toEqual(expectedOutput as any);
  });

  it('should return empty string for null input', () => {
    expect(pipe.transform(null as any)).toEqual('');
  });

  it('should return empty string for undefined input', () => {
    expect(pipe.transform(undefined as any)).toEqual('');
  });

  it('should return same string for input without newlines', () => {
    const inputText = 'Hello World';
    expect(pipe.transform(inputText)).toEqual(inputText as any);
  });
});