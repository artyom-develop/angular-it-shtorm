import { CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth';
import { inject } from '@angular/core';
import { Location } from '@angular/common';
export const forwardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const location = inject(Location);
  if (authService.getIsLogged()) {
    location.back();
    return false;
  }
  return true;
};
