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

    // Если текст уже содержит HTML-теги
    if (/<[a-z][\s\S]*>/i.test(text)) {
      let processedText = text;

      // Удаляем первый <h1> тег
      processedText = processedText.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, '');
      
      // Удаляем первый <p> тег  
      processedText = processedText.replace(/<p[^>]*>[\s\S]*?<\/p>/i, '');

      // ✅ Возвращаем безопасный HTML
      return this.sanitizer.bypassSecurityTrustHtml(processedText);
    }

    // Обычный текст → HTML с переносами
    const htmlWithBreaks = text.replace(/\n/g, '<br>');
    return this.sanitizer.bypassSecurityTrustHtml(htmlWithBreaks);
  }
}
