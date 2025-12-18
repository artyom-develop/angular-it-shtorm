import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[clickHide]',
})
export class ClickHide {
  @Output() clickHideChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() className: string = '';
  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    if (this.className && this.className !== '') {
      if (!(event.target as HTMLElement).closest(this.className)) {
        this.clickHideChange.emit(true);
      }
    } 
    // Проверяем, находится ли target внутри элемента с директивой
    const clickedInside = this.elementRef.nativeElement.contains(event.target as Node);

    // Если клик был ВНЕ элемента (на overlay), emit true для закрытия
    if (!clickedInside) {
      this.clickHideChange.emit(true);
    }
  }
}
