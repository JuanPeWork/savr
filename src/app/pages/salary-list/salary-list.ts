import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { AlertService } from '@core/ui/alert/alert.service';
import { ToastService } from '@core/ui/toast/toast.service';

@Component({
  selector: 'app-salary-list',
  imports: [DatePipe, DecimalPipe, RouterLink],
  templateUrl: './salary-list.html',
  styleUrl: './salary-list.css'
})
export default class SalaryList {

  private router = inject(Router);
  private location = inject(Location);
  private movementState = inject(MovementState);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  salaryState = inject(SalaryState);

  selectSalary(id: string) {
    this.salaryState.select(id);
    this.router.navigate(['/finance-space/movements']);
  }

  goBack() {
    this.location.back();
  }

  async deleteSalary(event: Event, id: string) {
    event.stopPropagation();

    const confirmed = await this.alertService.open({
      title: 'Eliminar sueldo',
      message: '¿Estás seguro? Se eliminarán también todos los movimientos asociados.',
      confirmText: 'Eliminar'
    });

    if (confirmed) {
      await this.movementState.removeBySalaryId(id);
      await this.salaryState.delete(id);
      this.toastService.show('Sueldo eliminado correctamente');
    }
  }

}
