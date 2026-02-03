import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { AlertService } from '@core/ui/alert/alert.service';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Settings {

  private router = inject(Router);
  private location = inject(Location);
  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);

  goBack() {
    this.location.back();
  }

  async clearAllData() {
    const confirmed = await this.alertService.open({
      title: 'Borrar todos los datos',
      message: '¿Estás seguro? Se eliminarán todos los sueldos y movimientos. Esta acción no se puede deshacer.',
      confirmText: 'Borrar todo'
    });

    if (confirmed) {
      this.movementState.reset();
      this.salaryState.reset();
      this.toastService.show('Datos eliminados correctamente');
      this.router.navigate(['/welcome']);
    }
  }

}
