import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLogedIn()) {
    console.log(authService.isLogedIn());
    return true;
  }
  router.navigate(['/']);
  return false;
};