import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../core/auth/auth';
import { ToastService } from '../../../shared/services/toast';
import { UserService } from '../../../shared/services/user';
import { status } from '../../../types/statusType';
import { LoginModel, LoginSchema, ValidateForm } from '../auth.schema';
import { LoginResponse } from './../../../types/auth/loginResponse.interface';
import { DefaultResponse } from './../../../types/defaultResponse.interface';

@Component({
  selector: 'app-login',
  imports: [RouterModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  standalone: true,
})
export class Login {
  zodErrors: ValidationErrors = {};
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  toastService = inject(ToastService);
  router = inject(Router);
  userService = inject(UserService);
  loginForm = this.fb.nonNullable.group({
    email: [''],
    password: [''],
    rememberMe: false,
  });
  destroy$ = new Subject<void>();
  constructor() {
    this.runZodValidation(this.loginForm.getRawValue() as LoginModel);
    this.loginForm.valueChanges.pipe(takeUntilDestroyed()).subscribe(() => {
      this.runZodValidation(this.loginForm.getRawValue() as LoginModel);
    });
  }

  private runZodValidation(value: LoginModel) {
    const res = ValidateForm(LoginSchema, value);
    this.zodErrors = res.errors;
  }

  getZodErrors(controlName: keyof LoginModel): string[] {
    return this.zodErrors[controlName] ?? [];
  }

  onLogin(): void {
    if (this.isFormValid()) {
      const val = this.loginForm.getRawValue() as LoginModel;
      const res = ValidateForm(LoginSchema, val);

      if (res.success) {
        const email = res.data.email!;
        const password = res.data.password!;
        const rememberMe = res.data.rememberMe;

        this.authService
          .login(email, password, !!rememberMe)
          .pipe(takeUntil(this.destroy$))
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
                this.toastService.showToast(status.error, 'Ошибка', 'Ошибка входа.');
                return; // Просто return
              }

              this.authService.setTokens(loginResponse.accessToken, loginResponse.refreshToken);
              this.authService.userId = loginResponse.userId;
              this.toastService.showToast(status.success, 'Успех', 'Вы успешно вошли в систему.');
              this.router.navigate(['/']);
            },
            error: (err: HttpErrorResponse) => {
              if (err.error && err.error.message) {
                this.toastService.showToast(status.error, 'Ошибка', err.error.message);
              } else {
                this.toastService.showToast(status.error, 'Ошибка', 'Ошибка авторизации.');
              }
            },
          });
      }
    }
  }

  isFormValid(): boolean {
    return Object.keys(this.zodErrors).length === 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
