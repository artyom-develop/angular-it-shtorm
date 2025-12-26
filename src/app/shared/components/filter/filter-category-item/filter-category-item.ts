import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ActivateParamsInterface } from '../../../../types/categories/activateParams.interface';
import { CategoryInterface } from '../../../../types/categories/categories.interface';

@Component({
  selector: 'filter-category-item',
  imports: [],
  templateUrl: './filter-category-item.html',
  styleUrl: './filter-category-item.scss',
})
export class FilterCategoryItem {
  category = input.required<CategoryInterface>();
  activeParams = input.required<ActivateParamsInterface>();
  router = inject(Router);

  isActive = signal<boolean>(false);

  constructor() {
    effect(() => {
      const cat = this.category();
      if (cat) {
        this.isActive.set(cat.isActive ?? false);
      }
    });
  }

  updateFilterParam(url: string) {
    const currentCategories = this.activeParams().categories || [];
    const newCategories = [...currentCategories];

    const foundIndex = newCategories.indexOf(url);

    if (foundIndex !== -1) {
      newCategories.splice(foundIndex, 1);
    } else {
      newCategories.push(url);
    }

    this.router.navigate(['/blog'], {
      queryParams: {
        categories: newCategories.length > 0 ? newCategories : null,
        page: 1,
      },
      queryParamsHandling: 'merge',
    });
  }
}
