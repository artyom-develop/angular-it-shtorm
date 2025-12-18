import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../types/defaultResponse.interface';
import { UserResponse } from '../../types/user/userResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  http = inject(HttpClient);
  userInfo$ = new BehaviorSubject<UserResponse | null>(null);
  getUserInfo(): Observable<UserResponse | DefaultResponse> {
    return this.http.get<UserResponse | DefaultResponse>(environment.apiUrl + '/users');
  }

  setUserInfo(user: UserResponse | null): void {
    this.userInfo$.next(user);
  }
}
