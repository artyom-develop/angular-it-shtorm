import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ValidationErrors } from '@angular/forms';
import {
  Field,
  form,
  submit,
  validateStandardSchema,
} from '@angular/forms/signals';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/auth/auth';
import { ToastService } from '../../../shared/services/toast';
import { UserService } from '../../../shared/services/user';
import { status } from '../../../types/statusType';
import { LoginModel, LoginSchema } from '../auth.schema';
import { LoginResponse } from './../../../types/auth/loginResponse.interface';
import { DefaultResponse } from './../../../types/defaultResponse.interface';
@Component({
  selector: 'app-login',
  imports: [RouterModule, Field],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  zodErrors: ValidationErrors = {};
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  userService = inject(UserService);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  redirectTimeout: number | null = null;
  isHidePassword = signal<boolean>(true);

  loginModel = signal<LoginModel>({
    email: '',
    password: '',
    rememberMe: false,
  });

  loginForm = form(this.loginModel, s =>
    validateStandardSchema(s, LoginSchema)
  );

  onLogin(event: Event): void {
    event.preventDefault();
    submit(this.loginForm, async () => {
      if (!this.loginForm().valid()) {
        return;
      }

      const email = this.loginModel().email;
      const password = this.loginModel().password;
      const rememberMe = this.loginModel().rememberMe;

      if (!email || !password) {
        return;
      }

      this.authService
        .login(email, password, !!rememberMe)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: LoginResponse | DefaultResponse) => {
            let error = null;
            if ((data as DefaultResponse).error !== undefined) {
              error = (data as DefaultResponse).message;
            }
            const loginResponse = data as LoginResponse;
            if (
              !loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId
            ) {
              error = 'Ошибка авторизации.';
            }

            if (error) {
              this.toastService.showToast(
                status.error,
                'Ошибка',
                'Ошибка входа.'
              );
              return;
            }

            this.authService.setTokens(
              loginResponse.accessToken,
              loginResponse.refreshToken
            );
            this.authService.userId = loginResponse.userId;
            this.toastService.showToast(
              status.success,
              'Успех',
              'Вы успешно вошли в систему.'
            );

            if (this.redirectTimeout) {
              clearTimeout(this.redirectTimeout);
            }
            this.redirectTimeout = setTimeout(() => {
              this.location.back();
            }, 100);
          },
          error: (err: HttpErrorResponse) => {
            if (err.error && err.error.message) {
              this.toastService.showToast(
                status.error,
                'Ошибка',
                err.error.message
              );
            } else {
              this.toastService.showToast(
                status.error,
                'Ошибка',
                'Ошибка авторизации.'
              );
            }
          },
        });
    });
  }

  togglePasswordVisibility() {
    this.isHidePassword.set(!this.isHidePassword());
  }
}
