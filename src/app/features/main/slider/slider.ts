import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Carousel, CarouselModule } from 'primeng/carousel';
import { ModalService } from '../../../shared/services/modal-service';
import { SliderService } from '../../../shared/services/slider.service.ts';
import { SliderInterface } from '../../../types/main/slider.interface.interface';
import { ModalType } from '../../../types/modal/modalRequest.interface';
import { OffersEnum } from '../../../types/offereEnum.enum';

@Component({
  selector: 'app-slider',
  imports: [CarouselModule, CommonModule],
  templateUrl: './slider.html',
  styleUrl: './slider.scss',
  changeDetection: ChangeDetectionStrategy.OnPush, // Оптимизация производительности
})
export class Slider implements AfterViewInit {
  @ViewChild('carousel', { static: false }) carousel!: Carousel;

  slides = signal<SliderInterface[]>([]);
  currentSlideIndex = signal(0);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  private sliderService = inject(SliderService);
  private autoplayTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    // Инициализируем slides из сервиса
    this.slides.set(this.sliderService.slides());
    this.currentSlideIndex.set(this.sliderService.currentSlideIndex());

    this.destroyRef.onDestroy(() => {
      this.clearAutoplayTimeout();
    });
  }

  consultationTo(value: OffersEnum) {
    this.modalService.setOffer({ offer: value, type: ModalType.order });
    this.modalService.open();
  }

  prevToSlide(event: MouseEvent) {
    event.preventDefault();
    this.sliderService.prevToSlide(event, this.carousel);
    this.restartAutoplay();
  }

  nextToSlide(event: MouseEvent) {
    event.preventDefault();
    this.sliderService.nextToSlide(event, this.carousel);
    this.restartAutoplay();
  }

  goToSlide(index: number, event: MouseEvent) {
    event.preventDefault();
    this.sliderService.goToSlide(index, this.carousel, event);
    this.restartAutoplay();
  }

  private restartAutoplay() {
    this.clearAutoplayTimeout();

    // Останавливаем автопрокрутку
    if (this.carousel) {
      this.carousel.stopAutoplay();
    }

    // Возобновляем через 5 секунд
    this.autoplayTimeout = setTimeout(() => {
      if (this.carousel && !this.destroyRef.destroyed) {
        this.carousel.startAutoplay();
      }
    }, 5000);
  }

  private clearAutoplayTimeout() {
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
      this.autoplayTimeout = null;
    }
  }

  ngAfterViewInit() {
    if (this.carousel) {
      this.carousel.onPage
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event: any) => {
          this.currentSlideIndex.set(event.page);
          this.sliderService.currentSlideIndex.set(event.page);
        });
    }
  }
}
