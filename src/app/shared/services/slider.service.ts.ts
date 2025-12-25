import { DestroyRef, Injectable, signal, inject } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { SliderInterface } from '../../types/main/slider.interface.interface';
import { OffersEnum } from '../../types/offereEnum.enum';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  private destroyRef = inject(DestroyRef);
  currentSlideIndex = signal(0);
  autoplayIntervalSignal = signal(10000);

  private autoplayTimeout: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
      }
    });
  }

  slides = signal<SliderInterface[]>([
    {
      id: 1,
      label: 'предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса',
      accent: '-15%!',
      after: false,
      buttonText: 'Подробнее',
      image: 'assets/images/main/main-1.png',
      offer: OffersEnum.MARKETING,
    },
    {
      id: 2,
      label: 'Акция',
      title: 'Нужен грамотный ?',
      accent: 'копирайтер',
      buttonText: 'Подробнее',
      after: false,
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      image: 'assets/images/main/main-2.png',
      offer: OffersEnum.COPYWRITING,
    },
    {
      id: 3,
      label: 'Новость дня',
      title: ' в ТОП-10 SMM-агенств Москвы!',
      accent: '6 место',
      buttonText: 'Подробнее',
      after: true,
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      image: 'assets/images/main/main-3.png',
      offer: OffersEnum.ADVERTISING,
    },
  ]);

  nextToSlide(event: MouseEvent, carousel: Carousel) {
    this.autoplayIntervalSignal.set(0);

    if (carousel) {
      carousel.navForward(event);
      // Синхронизируем индекс после навигации
      setTimeout(() => {
        this.currentSlideIndex.set(carousel.page);
      }, 50);
    }

    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }

    this.autoplayTimeout = setTimeout(() => {
      this.autoplayIntervalSignal.set(10000);
    }, 5000);
  }

  prevToSlide(event: MouseEvent, carousel: Carousel) {
    this.autoplayIntervalSignal.set(0);

    if (carousel) {
      carousel.navBackward(event);
      // Синхронизируем индекс после навигации
      setTimeout(() => {
        this.currentSlideIndex.set(carousel.page);
      }, 50);
    }

    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }

    this.autoplayTimeout = setTimeout(() => {
      this.autoplayIntervalSignal.set(10000);
    }, 5000);
  }
  goToSlide(index: number, carousel: Carousel, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    // Останавливаем автопрокрутку
    this.autoplayIntervalSignal.set(0);

    if (carousel && carousel.page !== index) {
      // Прямое присвоение страницы - надежнее, чем множественные navForward/navBackward
      carousel.page = index;
      
      // Обновляем currentSlideIndex сразу для синхронизации UI
      this.currentSlideIndex.set(index);

      // Принудительно вызываем обновление carousel
      carousel.onPage.emit({ page: index });
    }

    // Очищаем предыдущий таймаут
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }

    // Возобновляем автопрокрутку через 5 секунд
    this.autoplayTimeout = setTimeout(() => {
      this.autoplayIntervalSignal.set(10000);
    }, 5000);
  }
}
