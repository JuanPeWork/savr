import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movement } from '@domain/finance/interfaces/movements.interface';
import { AmountPipe } from '../../../../shared/pipes/amount.pipe';
import { PrivacyState } from '../../../../state/ui/privacy.state';

@Component({
  selector: 'movement-item',
  imports: [RouterLink, AmountPipe],
  templateUrl: './movement-item.html',
  styleUrl: './movement-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementItem {
  privacyState = inject(PrivacyState);
  movement = input.required<Movement>();

  readonly categoryLabels: Record<string, string> = {
    fixed: 'Fijo',
    variable: 'Variable',
    saving: 'Ahorro',
    leisure: 'Ocio'
  };

  typeMovementClass = computed(() =>
    this.movement().type === 'expense' ? 'badge-error' : 'badge-success'
  );

}
