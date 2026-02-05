import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { CategoryInterface } from '../../../types/categories/categories.interface';

@Component({
  selector: 'app-filter-label',
  imports: [],
  templateUrl: './filter-label.html',
  styleUrl: './filter-label.scss',
})
export class FilterLabel {
  router = inject(Router);

  label = input.required<string>();
  categories = input.required<CategoryInterface[]>();
  activeParams = input.required<{ categories: string[] }>();

  deleteCategory() {
    if (
      this.label() &&
      this.categories() &&
      this.categories().length > 0 &&
      this.activeParams() &&
      this.activeParams().categories.length > 0
    ) {
      const newCategories = this.activeParams().categories.filter(catUrl => {
        const foundItem = this.categories().find(cat => cat.url === catUrl);
        return !(foundItem && foundItem.name === this.label());
      });

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
}
