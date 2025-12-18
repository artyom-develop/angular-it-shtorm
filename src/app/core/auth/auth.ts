import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse } from '../../types/auth/loginResponse.interface';
import { DefaultResponse } from '../../types/defaultResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public accessTokenKey: string = environment.accessTokenKey;
  public refreshTokenKey: string = environment.refreshTokenKey;
  public userIdKey: string = environment.userIdKey;

  public isLogged$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    !!localStorage.getItem(environment.accessTokenKey)
  );
  private isLogged: boolean = !!localStorage.getItem(environment.accessTokenKey);

  private http = inject(HttpClient);

  constructor() {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(
    email: string,
    password: string,
    rememberMe: boolean
  ): Observable<LoginResponse | DefaultResponse> {
    return this.http.post<LoginResponse | DefaultResponse>(`${environment.apiUrl}/login`, {
      email,
      password,
      rememberMe,
    });
  }

  signup(
    email: string,
    password: string,
    name: string
  ): Observable<LoginResponse | DefaultResponse> {
    return this.http.post<LoginResponse | DefaultResponse>(`${environment.apiUrl}/signup`, {
      email,
      password,
      name,
    });
  }

  refresh(): Observable<DefaultResponse | LoginResponse> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponse | LoginResponse>(`${environment.apiUrl}/refresh`, {
        refreshToken: tokens.refreshToken,
      });
    }
    return throwError(() => 'Не могу найти токен');
  }

  logout(): Observable<DefaultResponse> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponse>(`${environment.apiUrl}/logout`, {
        refreshToken: tokens.refreshToken,
      });
    }
    return throwError(() => 'Не могу найти токен');
  }

  getIsLogged(): boolean {
    return this.isLogged;
  }

  getTokens() {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey),
    };
  }
  clearTokensAndUserId(): void {
    this.removeTokens();
    this.userId = null;
  }
  removeTokens(): void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }
  setTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  get userId(): string | null {
    return localStorage.getItem(this.userIdKey);
  }
  set userId(userId: string | null) {
    if (userId) {
      localStorage.setItem(this.userIdKey, userId);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }
}
