import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@core/auth/auth.service";

export const authGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  try {
    const user = await authService.waitForAuthState();
    return user ? true : router.createUrlTree(['/welcome']);
  } catch {
    return router.createUrlTree(['/welcome']);
  }
};
