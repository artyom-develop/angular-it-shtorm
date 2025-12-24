import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { ArticlesService } from '../../../shared/services/articles-service';
import { ArticleInterface } from '../../../types/article/articleTop.interface';
import { DefaultResponse } from '../../../types/defaultResponse.interface';

@Component({
  selector: 'app-populars',
  imports: [ArticleCard, RouterLink],
  templateUrl: './populars.html',
  styleUrl: './populars.scss',
})
export class Populars {
  articlesService = inject(ArticlesService);
  articles = signal<ArticleInterface[]>([]);
  private destroyRef = inject(DestroyRef);
  environment: any;

  constructor() {
    this.articlesService
      .getPopularArticles()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: DefaultResponse | ArticleInterface[]) => {
        if ((data as DefaultResponse).error !== undefined) {
          return;
        }
        const articles = data as ArticleInterface[];
        if (articles.length > 0) {
          this.articles.set(articles);
        }
      });
  }
}
