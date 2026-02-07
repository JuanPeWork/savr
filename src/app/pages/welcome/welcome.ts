import { Component, inject } from '@angular/core';
import { Router } from "@angular/router";
import { AuthService } from '@core/auth/auth.service';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';

@Component({
  selector: 'app-welcome',
  imports: [],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css'
})
export default class Welcome {

  private authService = inject(AuthService);
  private salaryState = inject(SalaryState);
  private movementState = inject(MovementState);
  private router = inject(Router);

  async createFinanceSpace() {
    await this.authService.signInAnonymously();
    this.router.navigate(['/setup']);
  }

  async signInWithGoogle() {
    await this.authService.signInWithGoogle();
    await this.authService.waitForAuthState();
    await Promise.all([this.salaryState.ready(), this.movementState.ready()]);

    if (this.salaryState.hasAnySalary()) {
      this.router.navigate(['/finance-space']);
    } else {
      this.router.navigate(['/setup']);
    }
  }
}
