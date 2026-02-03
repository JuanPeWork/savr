import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Location, DecimalPipe, DatePipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MovementState } from '@state/finance/movement.state';
import { AlertService } from '@core/ui/alert/alert.service';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-movement-detail',
  imports: [DecimalPipe, DatePipe, RouterLink],
  templateUrl: './movement-detail.html',
  styleUrl: './movement-detail.css'
})
export default class MovementDetail {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private movementState = inject(MovementState);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);

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
    transfer: { icon: '📤', label: 'Transferencia' },
  };

  goBack() {
    this.location.back();
  }

  async deleteMovement() {
    const confirmed = await this.alertService.open({
      title: 'Eliminar movimiento',
      message: '¿Estás seguro de que quieres eliminar este movimiento?',
      confirmText: 'Eliminar'
    });

    if (confirmed) {
      const id = this.id();
      if (id) {
        this.movementState.remove(id);
        this.toastService.show('Movimiento eliminado correctamente');
        this.router.navigate(['/finance-space/movements']);
      }
    }
  }

}
