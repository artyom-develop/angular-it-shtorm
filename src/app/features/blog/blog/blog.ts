import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ArticleCard } from '../../../shared/components/article-card/article-card';
import { FilterLabel } from '../../../shared/components/filter-label/filter-label';
import { CategoryFilter } from '../../../shared/components/filter/category-filter/category-filter';
import { Loading } from '../../../shared/components/loading/loading';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { ArticlesService } from '../../../shared/services/articles-service';
import { ActiveParamsUtil } from '../../../shared/utils/active-params.util';
import { ArticleResponse } from '../../../types/article/articleReponse.interface';
import { ArticleInterface } from '../../../types/article/articleTop.interface';
import { ActivateParamsInterface } from '../../../types/categories/activateParams.interface';
import { CategoryInterface } from '../../../types/categories/categories.interface';
import { DefaultResponse } from '../../../types/defaultResponse.interface';

@Component({
  selector: 'app-blog',
  imports: [ArticleCard, CategoryFilter, FilterLabel, Loading, Pagination],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
  standalone: true,
})
export class Blog {
  articlesService = inject(ArticlesService);
  activatedRoute = inject(ActivatedRoute);
  articles = signal<ArticleInterface[] | null>(null);
  pages = signal<number[]>([]);

  isShowFilter = false;
  isLoading = signal(true);

  labels = signal<string[]>([]);
  categories = signal<CategoryInterface[]>([]);
  destroyRef = inject(DestroyRef);
  
  toggleFilter() {
    this.isShowFilter = !this.isShowFilter;
  }
  activateParams: ActivateParamsInterface = {
    categories: [],
    page: 1,
  };
  closeFilterOpen(value: boolean) {
    if (value) {
      this.isShowFilter = false;
    }
  }

  onCategoriesResult(categories: CategoryInterface[]) {
    this.categories.set(categories);
    this.updateLabelsFromParams();
  }

  constructor() {
    this.activatedRoute.queryParams
      .pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        this.activateParams = ActiveParamsUtil.processParams(params);

        this.updateLabelsFromParams();
        this.loadArticles();
      });
  }

  private updateLabelsFromParams() {
    if (
      this.categories() &&
      this.categories().length > 0 &&
      this.activateParams.categories
    ) {
      const selectedLabels = this.activateParams.categories
        .map(catUrl => {
          const category = this.categories().find(cat => cat.url === catUrl);
          return category ? category.name : null;
        })
        .filter(name => name !== null) as string[];

      this.labels.set(selectedLabels);
    }
  }

  loadArticles() {
    this.isLoading.set(true);
    this.articlesService
      .getArticles(this.activateParams)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data: ArticleResponse | DefaultResponse) => {
        if ((data as DefaultResponse).error !== undefined) {
          return;
        }

        const pages = [];
        for (let i = 1; i <= (data as ArticleResponse).pages; i++) {
          pages.push(i);
        }
        this.pages.set(pages);

        this.articles.set((data as ArticleResponse).items);
        this.isLoading.set(false);
      });
  }
}
