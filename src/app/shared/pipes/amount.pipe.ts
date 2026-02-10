import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';

@Pipe({ name: 'amount', standalone: true })
export class AmountPipe implements PipeTransform {

  transform(value: number | null | undefined, hide: boolean): string {
    if (hide) return '•••• €';
    if (value == null) return '0.00 €';
    return formatNumber(value, 'es', '1.2-2') + ' €';
  }

}
