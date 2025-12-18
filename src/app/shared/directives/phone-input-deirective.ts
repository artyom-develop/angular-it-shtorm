import { Directive, Host, HostListener, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[phoneMask]',
})
export class PhoneInputDeirective {
  private ngControl = inject(NgControl);

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '');
    if (value.startsWith('8')) {
      value = '7' + value.slice(1);
    }
    if (value && !value.startsWith('7')) {
      value = '7' + value;
    }
    value = value.slice(0, 11);
    let formatted = '';
    if (value.length > 0) {
      formatted = '+7';
      if (value.length > 1) {
        formatted += ' (' + value.slice(1, 4);
      }
      if (value.length >= 5) {
        formatted += ') ' + value.slice(4, 7);
      }
      if (value.length >= 8) {
        formatted += '-' + value.slice(7, 9);
      }
      if (value.length >= 10) {
        formatted += '-' + value.slice(9, 11);
      }
    }
     this.ngControl.control?.patchValue(formatted, { emitEvent: false });
    input.value = formatted;

    const cursorPosition = formatted.length;
    input.setSelectionRange(cursorPosition, cursorPosition);
    
  }
}
