import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ArticleResponse } from '../../types/article/articleReponse.interface';
import { ArticleInterface } from '../../types/article/articleTop.interface';
import { ActivateParamsInterface } from '../../types/categories/activateParams.interface';
import { DefaultResponse } from '../../types/defaultResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  http = inject(HttpClient);

  getPopularArticles(): Observable<ArticleInterface[] | DefaultResponse> {
    return this.http.get<ArticleInterface[] | DefaultResponse>(
      environment.apiUrl + '/articles/top'
    );
  }

  getRelatedArticles(
    url: string
  ): Observable<ArticleInterface[] | DefaultResponse> {
    return this.http.get<ArticleInterface[] | DefaultResponse>(
      environment.apiUrl + '/articles/related/' + url
    );
  }

  getArticles(
    params?: ActivateParamsInterface
  ): Observable<ArticleResponse | DefaultResponse> {
    let httpParams = new HttpParams();

    if (params) {
      if (params.page) {
        httpParams = httpParams.set('page', params.page.toString());
      }
      if (params.url) {
        httpParams = httpParams.set('url', params.url);
      }
      if (params.categories && params.categories.length > 0) {
        params.categories.forEach(category => {
          httpParams = httpParams.append('categories', category);
        });
      }
    }

    return this.http.get<ArticleResponse | DefaultResponse>(
      environment.apiUrl + '/articles',
      { params: httpParams }
    );
  }

  getArticleByUrl(url: string): Observable<ArticleInterface | DefaultResponse> {
    return this.http.get<ArticleInterface | DefaultResponse>(
      environment.apiUrl + '/articles/' + url
    );
  }
}
