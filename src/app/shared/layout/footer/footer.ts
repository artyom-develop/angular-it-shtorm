import { ViewportScroller } from '@angular/common'
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  standalone: true,
})
export class Footer {
  date = new Date().getFullYear();
  router = inject(Router);
  private scrollTimeout!: ReturnType<typeof setTimeout>;
  private viewportScroller = inject(ViewportScroller);

  navigateWithFragment(route: string, fragment: string) {
    this.router.navigate([route], { fragment }).then(() => {
      if (this.scrollTimeout) {
        clearTimeout(this.scrollTimeout);
      }
      this.scrollTimeout = setTimeout(() => {
        this.viewportScroller.scrollToAnchor(fragment);
      }, 100);
    });
  }
}
