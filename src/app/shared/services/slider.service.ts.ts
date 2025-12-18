import { authInterceptor } from './../../core/interceptors/auth-interceptor';
import { Injectable, Signal, signal } from '@angular/core';
import { SliderInterface } from '../../types/main/sliderInterface.interface';
import { OffersEnum } from '../../types/offereEnum.enum';
import { Carousel } from 'primeng/carousel'

@Injectable({
  providedIn: 'root',
})
export class SliderService {



 currentSlideIndex = signal(0);
  autoplayIntervalSignal = signal(10000); 

  private autoplayTimeout: number | null = null;

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
  
  nextToSlide(event: MouseEvent, carousel: Carousel){
    this.autoplayIntervalSignal.set(0);

    if (carousel) {
      carousel.navForward(event);
    }

    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }

    this.autoplayTimeout = setTimeout(() => {
      this.autoplayIntervalSignal.set(10000);
    }, 5000);
  }

   prevToSlide(event: MouseEvent,carousel: Carousel) {
    this.autoplayIntervalSignal.set(0);

    if (carousel) {
      carousel.navBackward(event);
    }

    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }

    this.autoplayTimeout = setTimeout(() => {
      this.autoplayIntervalSignal.set(10000);
    }, 5000);
  }
  goToSlide(index: number, carousel: Carousel, event:MouseEvent) {
    this.autoplayIntervalSignal.set(0);

    if (carousel) {
      const currentPage = carousel.page;

      if (index > currentPage) {
        const steps = index - currentPage;
        for (let i = 0; i < steps; i++) {
          carousel.navForward(event);
        }
      } else if (index < currentPage) {
        const steps = currentPage - index;
        for (let i = 0; i < steps; i++) {
          carousel.navBackward(event);
        }
      }

      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
      }

      this.autoplayTimeout = setTimeout(() => {
        this.autoplayIntervalSignal.set(10000);
      }, 5000);
    }
  }
}
