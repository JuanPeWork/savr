import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/auth/auth.service';
import { SalaryState } from '@state/finance/salary.state';
import { MovementState } from '@state/finance/movement.state';
import { PrivacyState } from '@state/ui/privacy.state';

export const welcomeGuard = async () => {
  const authService = inject(AuthService);
  const salaryState = inject(SalaryState);
  const movementState = inject(MovementState);
  const privacyState = inject(PrivacyState);
  const router = inject(Router);

  try {
    const user = await authService.waitForAuthState();

    if (!user) {
      return true;
    }

    await Promise.all([salaryState.ready(), movementState.ready(), privacyState.ready()]);

    if (salaryState.hasAnySalary()) {
      return router.createUrlTree(['/finance-space']);
    }

    return router.createUrlTree(['/setup']);
  } catch (error) {
    console.error('[Guard] Error in welcomeGuard:', error);
    return true;
  }
};
