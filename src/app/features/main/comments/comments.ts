import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { SliderService } from '../../../shared/services/slider.service.ts';
import { SliderInterface } from '../../../types/main/slider.interface.interface.js';
import { CommentInterface } from '../../../types/main/comment.interface.js';
import { FormatTextPipe } from "../../../shared/pipes/format-text-pipe";

@Component({
  selector: 'app-comments',
  imports: [CarouselModule, CommonModule, FormatTextPipe],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments {
  @ViewChild('carousel') carousel!: Carousel;

  comments = signal<{image: string,
     name:string,
     description: string
  }[]>([]);
  currentSlideIndex = signal(0);
  autoplayIntervalSignal = signal(0);
  private destroyRef = inject(DestroyRef);
  private sliderService = inject(SliderService);
  private autoplayTimeout: number | null = null;

  constructor() {
    this.comments.set([
      {
        image: 'assets/images/main/comments/comment-1.png',
        name: 'Станислав',
        description:
          'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
      },
      {
        image: 'assets/images/main/comments/comment-2.png',
        name: 'Анастасия',
        description:
          'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
      },
      {
        image: 'assets/images/main/comments/comment-3.png',
        name: 'Мария',
        description:
          'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
      },
         {
        image: 'assets/images/main/comments/comment-1.png',
        name: 'Станислав',
        description:
          'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
      },
      {
        image: 'assets/images/main/comments/comment-2.png',
        name: 'Анастасия',
        description:
          'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
      },
      {
        image: 'assets/images/main/comments/comment-3.png',
        name: 'Мария',
        description:
          'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
      },
         {
        image: 'assets/images/main/comments/comment-1.png',
        name: 'Станислав',
        description:
          'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.',
      },
      {
        image: 'assets/images/main/comments/comment-2.png',
        name: 'Анастасия',
        description:
          'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.',
      },
      {
        image: 'assets/images/main/comments/comment-3.png',
        name: 'Мария',
        description:
          'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!',
      },
    ]);
    this.currentSlideIndex = this.sliderService.currentSlideIndex;
    this.autoplayIntervalSignal = this.sliderService.autoplayIntervalSignal;
    effect(() => {
      if (this.sliderService.currentSlideIndex() !== this.currentSlideIndex()) {
        this.currentSlideIndex = this.sliderService.currentSlideIndex;
      }
    });
    effect(() => {
      if (
        this.autoplayIntervalSignal() !==
        this.sliderService.autoplayIntervalSignal()
      ) {
        this.autoplayIntervalSignal = this.sliderService.autoplayIntervalSignal;
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
      }
    });
  }

  prevToSlide(event: MouseEvent) {
    this.sliderService.prevToSlide(event, this.carousel);
  }

  nextToSlide(event: MouseEvent) {
    this.sliderService.nextToSlide(event, this.carousel);
  }

  ngAfterViewInit() {
    if (this.carousel) {
      this.carousel.onPage
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: any) => {
          this.currentSlideIndex.set(event.page);
        });
    }
  }
}
