import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MovementState } from '@state/finance/movement.state';

@Component({
  selector: 'app-movement-detail',
  imports: [DecimalPipe, DatePipe, RouterLink],
  templateUrl: './movement-detail.html',
  styleUrl: './movement-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class MovementDetail {

  private route = inject(ActivatedRoute);
  private location = inject(Location);
  private movementState = inject(MovementState);

  private id = toSignal(this.route.paramMap.pipe(map(params => params.get('id'))));

  readonly movement = computed(() => {
    const id = this.id();
    if (!id) return undefined;
    return this.movementState.getById(id);
  });

  readonly categoryConfig: Record<string, { icon: string; label: string }> = {
    fixed: { icon: '🏠', label: 'Gasto Fijo' },
    variable: { icon: '🛒', label: 'Gasto Variable' },
    saving: { icon: '💰', label: 'Ahorro' },
    leisure: { icon: '🎮', label: 'Ocio' },
  };

  readonly paymentConfig: Record<string, { icon: string; label: string }> = {
    cash: { icon: '💵', label: 'Efectivo' },
    card: { icon: '💳', label: 'Tarjeta' },
    domiciled: { icon: '🏦', label: 'Domiciliado' },
  };

  goBack() {
    this.location.back();
  }

}
