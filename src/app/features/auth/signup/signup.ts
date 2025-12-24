import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { UserService } from './../../../shared/services/user';
import { SignupSchema } from './../auth.schema';

import { Router, RouterModule } from '@angular/router';

import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth';
import { ToastService } from '../../../shared/services/toast';
import { SignupResponse } from '../../../types/auth/signupResponse.interface';
import { DefaultResponse } from '../../../types/defaultResponse.interface';
import { status } from '../../../types/statusType';
import { UserResponse } from '../../../types/user/userResponse.interface';
import { SignupModel, ValidateForm } from '../auth.schema';
import { Location } from '@angular/common';
@Component({
  selector: 'app-signup',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.scss',
  standalone: true,
})
export class Signup {
  zodErrors: ValidationErrors = {};
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  userService = inject(UserService);
  router = inject(Router);
  signUpForm = this.fb.nonNullable.group({
    firstName: [''],
    email: [''],
    password: [''],
    repeatPassword: [''],
    agree: false,
  });
  location = inject(Location);
  destroy$ = new Subject<void>();
  isHidePassword =  signal<boolean>(true);
  isHideRepeatPassword = signal<boolean>(true);

  toggleRepeatPasswordVisibility() {
    this.isHideRepeatPassword.set(!this.isHideRepeatPassword());
  }
  togglePasswordVisibility() {
    this.isHidePassword.set(!this.isHidePassword());
  }
  constructor() {
    this.runZodValidation(this.signUpForm.getRawValue() as SignupModel);
    this.signUpForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.runZodValidation(this.signUpForm.getRawValue() as SignupModel);
    });
  }

  private runZodValidation(value: SignupModel) {
    const res = ValidateForm(SignupSchema, value);
    this.zodErrors = res.errors;
  }

  getZodErrors(controlName: keyof SignupModel): string[] {
    return this.zodErrors[controlName] ?? [];
  }

  onSignup(): void {
    if (this.isFormValid()) {
      const value = this.signUpForm.getRawValue() as SignupModel;
      const res = ValidateForm(SignupSchema, value);

      if (res.success) {
        const email = res.data.email;
        const password = res.data.password;
        const name = res.data.firstName;
        this.authService
          .signup(email, password, name)
          .pipe(takeUntil(this.destroy$))
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

              // Небольшая задержка перед редиректом для стабилизации состояния
              setTimeout(() => {
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
                  'Ошибка регистрации.'
                );
              }
            },
          });
      } else {
        this.signUpForm.markAllAsTouched();
        this.zodErrors = res.errors;
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  isFormValid(): boolean {
    return Object.keys(this.zodErrors).length === 0;
  }

  checkUser() {
    this.userService
      .getUserInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userData: UserResponse | DefaultResponse) => {
          let error = null;
          if ((userData as DefaultResponse).error !== undefined) {
            error = (userData as DefaultResponse).message;
          }
          const userResult = userData as UserResponse;
          if (!userResult.id || !userResult.name || !userResult.email) {
            error = 'Ошибка получения данных.';
          }

          if (error) {
            throw Error(error);
          }

          this.userService.setUserInfo(userResult);

          this.toastService.showToast(
            status.success,
            'Успех',
            'Вы успешно зарегистрировались в системе.'
          );
          this.location.back();
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
              'Ошибка получения данных.'
            );
          }
        },
      });
  }
}
