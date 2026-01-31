import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Movement } from '@domain/finance/interfaces/movements.interface';

@Component({
  selector: 'movement-item',
  imports: [RouterLink],
  templateUrl: './movement-item.html',
  styleUrl: './movement-item.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovementItem {
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
