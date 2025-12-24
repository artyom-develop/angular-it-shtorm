import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core';
import { DefaultResponse } from '../../types/defaultResponse.interface'
import { CategoryInterface } from '../../types/categories/categories.interface'
import { environment } from '../../../environments/environment'
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private http = inject(HttpClient);


  getCategories(): Observable<DefaultResponse | CategoryInterface[]>{
    return this.http.get<DefaultResponse | CategoryInterface[]>(environment.apiUrl + '/categories')
  }
}
