import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { ActivateParamsInterface } from '../../../types/categories/activateParams.interface';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.html',
  styleUrl: './pagination.scss',
})
export class Pagination {
  pages = input.required<number[]>();
  activeParams = input.required<ActivateParamsInterface>();

  router = inject(Router);

  openPage(page: number) {
    if (this.activeParams().page === page) {
      return;
    }
    const newParams = {
      ...this.activeParams(),
      page: page,
    };
    this.router.navigate(['/blog'], {
      queryParams: newParams,
    });
  }

  openNextPage() {
    if (
      this.activeParams().page &&
      this.activeParams().page < this.pages().length
    ) {
      const newParams = {
        ...this.activeParams(),
        page: this.activeParams().page! + 1,
      };
      this.router.navigate(['/blog'], {
        queryParams: newParams,
      });
    }
  }

  openPrevPage() {
    if (this.activeParams().page && this.activeParams().page > 1) {
      const newParams = {
        ...this.activeParams(),
        page: this.activeParams().page! - 1,
      };
      this.router.navigate(['/blog'], {
        queryParams: newParams,
      });
    }
  }
}
