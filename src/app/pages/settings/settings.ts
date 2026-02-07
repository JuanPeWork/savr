import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { AlertService } from '@core/ui/alert/alert.service';
import { ToastService } from '@core/ui/toast/toast.service';
import { AuthService } from '@core/auth/auth.service';

@Component({
  selector: 'app-settings',
  imports: [],
  templateUrl: './settings.html',
  styleUrl: './settings.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Settings {

  private router = inject(Router);
  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);
  private alertService = inject(AlertService);
  private toastService = inject(ToastService);
  private authService = inject(AuthService);

  readonly isAnonymous = this.authService.isAnonymous;
  readonly userEmail = () => this.authService.user()?.email;

  async resetFinanceSpace() {
    const confirmed = await this.alertService.open({
      title: 'Borrar espacio financiero',
      message: '¿Estás seguro? Se eliminarán todos tus datos y se cerrará la sesión. Esta acción no se puede deshacer.',
      confirmText: 'Borrar todo',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      await this.movementState.reset();
      await this.salaryState.reset();
      await this.authService.logout();
      this.router.navigate(['/welcome']);
    }
  }

  async linkWithGoogle() {
    const result = await this.authService.linkWithGoogle();

    if (result === 'needs-confirmation') {
      const confirmed = await this.alertService.open({
        title: 'Cuenta existente',
        message: 'Esta cuenta de Google ya tiene un espacio financiero. ¿Quieres acceder a él? Los datos actuales se perderán.',
        confirmText: 'Usar cuenta existente',
        cancelText: 'Cancelar'
      });

      if (confirmed) {
        this.salaryState.clearLocal();
        this.movementState.clearLocal();
        await this.authService.confirmSwitchToExistingAccount();
        await this.authService.waitForAuthState();
        await Promise.all([this.salaryState.ready(), this.movementState.ready()]);
        this.toastService.show('Sesión iniciada con cuenta existente');
        this.router.navigate(['/finance-space']);
      }
    } else {
      this.toastService.show('Cuenta vinculada correctamente');
    }
  }

  async logout() {
    const confirmed = await this.alertService.open({
      title: 'Cerrar sesión',
      message: '¿Estás seguro de que quieres cerrar sesión?',
      confirmText: 'Cerrar sesión',
      cancelText: 'Cancelar'
    });

    if (confirmed) {
      this.salaryState.clearLocal();
      this.movementState.clearLocal();
      await this.authService.logout();
      this.router.navigate(['/welcome']);
    }
  }

}
