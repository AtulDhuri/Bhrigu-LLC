import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('Auth guard - checking authentication');
  console.log('Is authenticated:', authService.isAuthenticated());
  console.log('Current URL:', state.url);

  if (authService.isAuthenticated()) {
    return true;
  }

  console.log('Not authenticated - saving return URL:', state.url);
  authService.setReturnUrl(state.url);
  console.log('Redirecting to login');
  router.navigate(['/login']);
  return false;
};
