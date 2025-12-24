import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ActionCommentEnum } from '../../types/action-comment.enum';
import { ActionTypeInterface } from '../../types/actionType.interface';
import { DefaultResponse } from '../../types/defaultResponse.interface';
import { CommentResponseInterface } from '../../types/main/commentResponse.interface';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  getCommentsByArticle(
    id: string,
    offset: number
  ): Observable<CommentResponseInterface | DefaultResponse> {
    let httpParams = new HttpParams();

    if (id) {
      httpParams = httpParams.set('article', id.toString());
    }
    if (offset) {
      httpParams = httpParams.set('offset', offset.toString());
    }

    return this.http.get<CommentResponseInterface | DefaultResponse>(
      environment.apiUrl + '/comments',
      {
        params: httpParams,
      }
    );
  }

  sendComment(text: string, article: string): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(environment.apiUrl + '/comments', {
      text,
      article,
    });
  }
  actionByComment(
    id: string,
    action: ActionCommentEnum
  ): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      environment.apiUrl + '/comments/' + id + '/apply-action',
      { action: action }
    );
  }
  getCommentsAction(
    id: string
  ): Observable<DefaultResponse | ActionTypeInterface[]> {
    return this.http.get<DefaultResponse | ActionTypeInterface[]>(
      environment.apiUrl + '/comments/' + id + '/actions',
      { withCredentials: true }
    );
  }

  getArticleCommentsActions(
    articleId: string
  ): Observable<DefaultResponse | ActionTypeInterface[]> {
    return this.http.get<DefaultResponse | ActionTypeInterface[]>(
      environment.apiUrl + '/comments/article-comment-actions',
      { params: { articleId , withCredentials: true} }
    );
  }
}
