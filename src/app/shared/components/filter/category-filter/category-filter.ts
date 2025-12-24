import { Component, DestroyRef, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { ActivateParamsInterface } from '../../../../types/categories/activateParams.interface';
import { CategoryInterface } from '../../../../types/categories/categories.interface';
import { DefaultResponse } from '../../../../types/defaultResponse.interface';
import { ClickHide } from '../../../directives/click-hide';
import { CategoryService } from '../../../services/category-service';
import { ActiveParamsUtil } from '../../../utils/active-params.util';
import { FilterCategoryItem } from '../filter-category-item/filter-category-item';
import { debounceTime } from 'rxjs'

@Component({
  selector: 'category-filter',
  imports: [ClickHide, FilterCategoryItem],
  templateUrl: './category-filter.html',
  styleUrl: './category-filter.scss',
})
export class CategoryFilter {
  router = inject(Router);
  activatedRouter = inject(ActivatedRoute);
  categoryService = inject(CategoryService);
  isShowFilter = signal<boolean>(false);
  private destroyRef = inject(DestroyRef);
  categories = signal<CategoryInterface[]>([]);

  activeParams: ActivateParamsInterface = {
    categories: [],
    page: 1,
  };

  categoriesOutput = output<CategoryInterface[]>();
  constructor() {
    this.categoryService
      .getCategories()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data: DefaultResponse | CategoryInterface[]) => {
          if ((data as DefaultResponse).error !== undefined) {
            return;
          }

          this.categories.set(data as CategoryInterface[]);


          this.activatedRouter.queryParams
            .pipe(debounceTime(300),takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
              this.activeParams = ActiveParamsUtil.processParams(params);

              if (this.categories() && this.categories().length > 0) {
                const categoriesRes = this.categories().map(category => {
                  if (
                    this.activeParams.categories &&
                    this.activeParams.categories.length > 0 &&
                    this.activeParams.categories.some(
                      url => category.url === url
                    )
                  ) {
                    category.isActive = true;

                    return category;
                  } else {
                    category.isActive = false;
                    return category;
                  }
                });
                
                this.categories.set(categoriesRes);
                this.categoriesOutput.emit(categoriesRes);
              }
            });
        },
      });
  }

  toggleFilter() {
    this.isShowFilter.set(!this.isShowFilter());
  }

  closeFilterOpen(value: boolean) {
    if (value) {
      this.isShowFilter.set(false);
    }
  }
}
