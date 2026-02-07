import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';

export const welcomeGuard = async () => {
  const authService = inject(AuthService);
  const salaryState = inject(SalaryState);
  const movementState = inject(MovementState);
  const router = inject(Router);

  const user = await authService.waitForAuthState();

  if (!user) {
    return true;
  }

  await Promise.all([salaryState.ready(), movementState.ready()]);

  if (salaryState.hasAnySalary()) {
    return router.createUrlTree(['/finance-space']);
  }

  return router.createUrlTree(['/setup']);
};
