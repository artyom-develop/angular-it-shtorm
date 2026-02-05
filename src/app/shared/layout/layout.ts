import { Component, HostListener, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from './footer/footer';
import { Header } from './header/header';

@Component({
  selector: 'app-layout',
  imports: [Footer, Header, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
  standalone: true,
})
export class Layout {
  showScrollTop = signal(false);

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollTop.set(window.pageYOffset > 200);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
