import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[selectOnFocus]',
  standalone: true
})
export class SelectOnFocusDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('focus')
  onFocus(): void {
    this.el.nativeElement.select();
  }
}
