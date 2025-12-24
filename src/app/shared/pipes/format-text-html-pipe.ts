import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'formatTextHtml',
  standalone: true  // ✅ Для Angular 17+ standalone
})
export class FormatTextHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string): SafeHtml {
    if (!text) return '';

    if (/<[a-z][\s\S]*>/i.test(text)) {
      let processedText = text;

      processedText = processedText.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
      
      processedText = processedText.replace(/<p[^>]*>[\s\S]*?<\/p>/i, '');

      return this.sanitizer.bypassSecurityTrustHtml(processedText);
    }

    const htmlWithBreaks = text.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(htmlWithBreaks);
  }
}
