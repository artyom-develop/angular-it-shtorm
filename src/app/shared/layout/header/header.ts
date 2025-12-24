import { ViewportScroller } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, effect, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';
import { DefaultResponse } from '../../../types/defaultResponse.interface';
import { status } from '../../../types/statusType';
import { UserResponse } from '../../../types/user/userResponse.interface';
import { ClickHide } from '../../directives/click-hide';
import { ToastService } from '../../services/toast';
import { UserService } from '../../services/user';

@Component({
  selector: 'app-header',
  imports: [RouterModule, ClickHide],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private router = inject(Router);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private toastService = inject(ToastService);
  private destroyRef = inject(DestroyRef);
  private viewportScroller = inject(ViewportScroller);

  isLoggedIn = toSignal(this.authService.isLogged$, { initialValue: false });
  userInfo = toSignal<UserResponse | null>(this.userService.userInfo$, {
    initialValue: null,
  });

  isShowMenu = signal<boolean>(false);

  navigateWithFragment(route: string, fragment: string) {
    this.router.navigate([route], { fragment }).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToAnchor(fragment);
      }, 100);
    });
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.isShowMenu.set(!this.isShowMenu());
  }

  clickHide(stateClick: boolean) {
    if (stateClick) {
      this.isShowMenu.set(false);
    }
  }
  constructor() {
    effect(() => {
      if (this.isLoggedIn() && this.authService.getTokens().accessToken) {
        this.loadUser();
        this.isShowMenu.set(false);
      }
    });
  }

  private loadUser() {
    this.userService
      .getUserInfo()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: UserResponse | DefaultResponse) => {
          if ((data as DefaultResponse).error !== undefined) {
            const error = (data as DefaultResponse).message;
            throw new Error(error);
          }
          this.userService.setUserInfo(data as UserResponse);
        },
        error: (err: HttpErrorResponse) => {
          if (err.error.message) {
            this.toastService.showToast(
              status.error,
              'Ошибка',
              err.error.message
            );
            this.clearDataUser();
            return;
          }
          
          this.clearDataUser();
        },
      });
  }

  clearDataUser() {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.userService.setUserInfo(null);
  }
  logout() {
    this.clearDataUser();
    this.authService
      .logout()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: data => {
          this.toastService.showToast(
            status.success,
            'Успешно',
            'Вы успешно вышли из системы.'
          );
          this.router.navigate(['/']);
        },
        error: err => {
          this.toastService.showToast(
            status.success,
            'Успешно',
            'Вы успешно вышли из системы.'
          );
          this.router.navigate(['/']);
        },
      });
  }
}
