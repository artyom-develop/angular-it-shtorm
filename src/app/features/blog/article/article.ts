import { DatePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { AuthService } from '../../../core/auth/auth';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { Loading } from '../../../shared/components/loading/loading';
import { FormatTextHtmlPipe } from '../../../shared/pipes/format-text-html-pipe';
import { ArticlesService } from '../../../shared/services/articles-service';
import { CommentService } from '../../../shared/services/comment-service';
import { ToastService } from '../../../shared/services/toast';
import { ActionCommentEnum } from '../../../types/action-comment.enum';
import { ActionTypeInterface } from '../../../types/actionType.interface';
import { ArticleFullInterface } from '../../../types/article/articleFullResponse.interface';
import { ArticleInterface } from '../../../types/article/articleTop.interface';
import { DefaultResponse } from '../../../types/defaultResponse.interface';
import { CommentResponseInterface } from '../../../types/main/commentResponse.interface';
import { status } from '../../../types/statusType';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'app-article',
  imports: [
    ArticleCard,
    FormatTextHtmlPipe,
    RouterLink,
    DatePipe,
    FormsModule,
    Loading,
  ],
  templateUrl: './article.html',
  styleUrl: './article.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Article {
  activatedRoute = inject(ActivatedRoute);
  urlArticle = signal<string>('');
  articleService = inject(ArticlesService);
  destroyRef = inject(DestroyRef);
  authService = inject(AuthService);
  commentService = inject(CommentService);
  toastService = inject(ToastService);
  article = signal<ArticleFullInterface>({
    id: '',
    title: '',
    description: '',
    image: '',
    date: '',
    category: '',
    url: '',
    text: '',
    comments: [],
    commentsCount: 0,
  });
  relatedArticles = signal<ArticleInterface[]>([]);
  comments = signal<CommentResponseInterface>({
    comments: [],
    allCount: 0,
  });
  isLoggedIn = toSignal(this.authService.isLogged$, { initialValue: false });
  isLoadingComments = signal<boolean>(false);
  isLoadingActions = signal<boolean>(false);
  userActions = signal<Map<string, string>>(new Map());

  newComment: string = '';
  ActionCommentEnum = ActionCommentEnum;
  currentCommentOffset = signal<number>(3);

  constructor() {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        if (params['url']) {
          this.urlArticle.set(params['url']);
          this.loadArticle(params['url']);
          this.loadRelatedArticle(params['url']);
        }
      });
  }

  private loadArticle(url: string) {
    this.articleService
      .getArticleByUrl(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: ArticleInterface | DefaultResponse) => {
        if ((data as DefaultResponse).error === undefined) {
          this.article.set(data as ArticleFullInterface);
          this.loadComments(3);

          this.loadUserActions();
        }
      });
  }

  private loadRelatedArticle(url: string) {
    this.articleService
      .getRelatedArticles(url)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: ArticleInterface[] | DefaultResponse) => {
        if ((data as DefaultResponse).error === undefined) {
          this.relatedArticles.set(data as ArticleInterface[]);
        }
      });
  }

  private loadComments(offset: number) {
    this.isLoadingComments.set(true);
    this.commentService
      .getCommentsByArticle(this.article().id, offset)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: CommentResponseInterface | DefaultResponse) => {
        if ((data as DefaultResponse).error === undefined) {
          const response = data as CommentResponseInterface;

          this.comments.set(response);
        }
        this.isLoadingComments.set(false);
      });
  }

  loadMoreComments() {
    this.currentCommentOffset.set(this.currentCommentOffset() + 3);
    this.loadComments(this.currentCommentOffset());
  }

  createComment() {
    if (this.newComment.trim() === '') {
      return;
    }
    this.commentService
      .sendComment(this.newComment.trim(), this.article().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: DefaultResponse) => {
        if ((data as DefaultResponse).error) {
          this.toastService.showToast(
            status.error,
            'Ошибка',
            'Не удалось отправить комментарий. Попробуйте еще раз.'
          );
          return;
        }
        this.toastService.showToast(
          status.success,
          'Успешно',
          'Ваш комментарий успешно отправлен и будет опубликован после модерации.'
        );
        this.newComment = '';
        this.loadComments(0);
        this.loadUserActions();
      });
  }

  private loadUserActions() {
    this.commentService
      .getArticleCommentsActions(this.article().id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: ActionTypeInterface[] | DefaultResponse) => {
        if ((data as DefaultResponse).error === undefined) {
          const actions = data as ActionTypeInterface[];
          const actionsMap = new Map<string, string>();
          actions.forEach(action => {
            actionsMap.set(action.comment, action.action);
          });
          this.userActions.set(actionsMap);
        }
      });
  }

  applyAction(commentId: string, action: ActionCommentEnum) {
    if (!this.isLoggedIn()) {
      this.toastService.showToast(
        status.info,
        'Внимание',
        'Пожалуйста, войдите в систему или зарегистрируйтесь, чтобы выполнить это действие.'
      );
    }
    this.isLoadingActions.set(true);
    this.commentService
      .actionByComment(commentId, action)
      .pipe(
        tap(() => this.isLoadingActions),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (data: DefaultResponse) => {
          if ((data as DefaultResponse).error) {
            if ((data as DefaultResponse).message) {
              this.toastService.showToast(
                status.error,
                'Ошибка',
                (data as DefaultResponse).message
              );
              return;
            }
            this.toastService.showToast(
              status.error,
              'Ошибка',
              'Произошла ошибка при выполнении действия. Попробуйте еще раз.'
            );
          }

          // Успех
          if (action === ActionCommentEnum.violate) {
            this.toastService.showToast(
              status.success,
              'Успешно',
              'Жалоба отправлена'
            );
          }

          // Обновляем действия пользователя и комментарии
          this.loadUserActions();
          this.loadComments(this.currentCommentOffset());
        },
        error: (err: HttpErrorResponse) => {
          if (err.status === 401) {
            return;
          }
          if (err.error && err.error.message) {
            this.toastService.showToast(
              status.error,
              'Ошибка',
              err.error.message
            );
            return;
          }
          this.toastService.showToast(
            status.error,
            'Ошибка',
            'Произошла ошибка при выполнении действия. Попробуйте еще раз.'
          );
        },
      });
  }

  hasUserAction(commentId: string, action: string): boolean {
    return this.userActions().get(commentId) === action;
  }

  protected readonly environment = environment;
}
