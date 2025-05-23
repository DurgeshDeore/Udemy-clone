import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLoggedIn()) {
    // Redirect to login with return URL
    return router.createUrlTree(['/login'], { 
      queryParams: { returnUrl: state.url } 
    });
  }
  return true;
};

