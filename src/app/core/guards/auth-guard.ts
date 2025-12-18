import { ToastService } from './../../shared/services/toast';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { status } from '../../types/statusType';
import { AuthService } from '../auth/auth'

export const authGuard: CanActivateFn = (route, state) => {
  const toastService = inject(ToastService);
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.getIsLogged()) {
    return true;
  }
  toastService.showToast(status.error, 'Ошибка', 'Требуется авторизация.');
  router.navigate(['/login']);
  return false;
};
