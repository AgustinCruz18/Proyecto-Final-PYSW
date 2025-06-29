import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) { }

  transform(value: string): SafeHtml {
    const formattedValue = value ? value.replace(/\n/g, '<br>') : '';
    return this.sanitizer.bypassSecurityTrustHtml(formattedValue);
  }
}