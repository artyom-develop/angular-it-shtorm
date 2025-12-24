import {
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';

@Directive({
  selector: '[clickHide]',
})
export class ClickHide {
  @Output() clickHideChange: EventEmitter<boolean> =
    new EventEmitter<boolean>();
  @Input() className: string = '';
  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
 
    const clickedInside = this.elementRef.nativeElement.contains(
      event.target as Node
    );


    if (!clickedInside) {
      this.clickHideChange.emit(true);
    }
  }
}
