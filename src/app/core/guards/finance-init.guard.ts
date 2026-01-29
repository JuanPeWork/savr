import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { SalaryState } from '@state/finance/salary.state';

export const financeInitGuard = async () => {
  const salaryState = inject(SalaryState);
  const router = inject(Router);

  await salaryState.ready();

  return salaryState.hasAnySalary() ? true : router.createUrlTree(['/welcome']);
};
