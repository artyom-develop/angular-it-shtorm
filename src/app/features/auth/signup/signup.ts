import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, ValidationErrors } from '@angular/forms';
import { UserService } from './../../../shared/services/user';
import { SignupSchema } from './../auth.schema';

import { Router, RouterModule } from '@angular/router';

import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  Field,
  form,
  submit,
  validateStandardSchema,
} from '@angular/forms/signals';
import { AuthService } from '../../../core/auth/auth';
import { ToastService } from '../../../shared/services/toast';
import { SignupResponse } from '../../../types/auth/signupResponse.interface';
import { DefaultResponse } from '../../../types/defaultResponse.interface';
import { status } from '../../../types/statusType';
import { SignupModel } from '../auth.schema';
@Component({
  selector: 'app-signup',
  imports: [RouterModule, Field],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Signup {
  zodErrors: ValidationErrors = {};
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  userService = inject(UserService);
  router = inject(Router);
  destroyRef = inject(DestroyRef);
  location = inject(Location);
  redirectTimeout: number | null = null;
  isHidePassword = signal<boolean>(true);
  isHideRepeatPassword = signal<boolean>(true);

  signUpModel = signal<SignupModel>({
    firstName: '',
    email: '',
    password: '',
    repeatPassword: '',
    agree: false,
  });

  signupForm = form(this.signUpModel, s =>
    validateStandardSchema(s, SignupSchema)
  );

  toggleRepeatPasswordVisibility() {
    this.isHideRepeatPassword.set(!this.isHideRepeatPassword());
  }
  togglePasswordVisibility() {
    this.isHidePassword.set(!this.isHidePassword());
  }

  onSignup(event: Event): void {
    event.preventDefault();
    submit(this.signupForm, async () => {
      if (!this.signupForm().valid()) {
        return;
      }

      const name = this.signUpModel().firstName;
      const email = this.signUpModel().email;
      const password = this.signUpModel().password;
      const repeatPassword = this.signUpModel().repeatPassword;
      const agree = !!this.signUpModel().agree;

      if (!name || !email || !password || !repeatPassword || !agree) {
        return;
      }

      this.authService
        .signup(email, password, name)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (data: SignupResponse | DefaultResponse) => {
            let error = null;
            if ((data as DefaultResponse).error !== undefined) {
              error = (data as DefaultResponse).message;
            }
            const loginResponse = data as SignupResponse;
            if (
              !loginResponse.accessToken ||
              !loginResponse.refreshToken ||
              !loginResponse.userId
            ) {
              error = 'Ошибка регистрации.';
            }

            if (error) {
              this.toastService.showToast(
                status.error,
                'Ошибка',
                'Ошибка регистрации.'
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
              'Вы успешно зарегистрировались в системе.'
            );

            if (this.redirectTimeout) {
              clearTimeout(this.redirectTimeout);
            }
            this.redirectTimeout = setTimeout(() => {
              this.router.navigate(['/']);
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
                'Ошибка регистрации.'
              );
            }
          },
        });
    });
  }
}
