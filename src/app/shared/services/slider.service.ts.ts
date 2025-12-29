import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Carousel } from 'primeng/carousel';
import { SliderInterface } from '../../types/main/slider.interface.interface';
import { OffersEnum } from '../../types/offereEnum.enum';

@Injectable({
  providedIn: 'root',
})
export class SliderService {
  currentSlideIndex = signal(0);

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
    if (carousel) {
      carousel.navForward(event);
    }
  }

  prevToSlide(event: MouseEvent, carousel: Carousel) {
    if (carousel) {
      carousel.navBackward(event);
    }
  }
  goToSlide(index: number, carousel: Carousel, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (carousel && carousel.page !== index) {
      carousel.page = index;
      carousel.onPage.emit({ page: index });
    }
  }
}
