import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryInterface } from '../../../../types/categories/categories.interface'
import { ActivateParamsInterface } from '../../../../types/categories/activateParams.interface'

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
    this.isActive.set(!this.isActive());
    const newCategories = [...(this.activeParams().categories || [])];

    const foundIndex = newCategories.indexOf(url);

    if (foundIndex !== -1 && !this.isActive()) {
      newCategories.splice(foundIndex, 1);
    } else if (foundIndex === -1 && this.isActive()) {
      newCategories.push(url);
    }

    const newParams = {
      ...this.activeParams(),
      categories: newCategories,
      page: 1,
    };

    this.router.navigate(['/blog'], {
      queryParams: newParams,
    });
  }
}
