import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { AuthService } from '@core/auth/auth.service';

export const financeInitGuard = async () => {
  const authService = inject(AuthService);
  const salaryState = inject(SalaryState);
  const movementState = inject(MovementState);
  const router = inject(Router);

  try {
    const user = await authService.waitForAuthState();

    if (!user) {
      return router.createUrlTree(['/welcome']);
    }

    await Promise.all([salaryState.ready(), movementState.ready()]);

    return salaryState.hasAnySalary() ? true : router.createUrlTree(['/setup']);
  } catch (error) {
    console.error('[Guard] Error in financeInitGuard:', error);
    return router.createUrlTree(['/welcome']);
  }
};
