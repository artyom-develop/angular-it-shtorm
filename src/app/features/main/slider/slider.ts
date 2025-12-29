import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  effect,
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
})
export class Slider implements AfterViewInit {
  @ViewChild('carousel') carousel!: Carousel;

  slides = signal<SliderInterface[]>([]);
  currentSlideIndex = signal(0);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  private sliderService = inject(SliderService);
  private autoplayTimeout: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.slides = this.sliderService.slides;
    
    this.destroyRef.onDestroy(() => {
      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
      }
    });
  }

  consultationTo(value: OffersEnum) {
    this.modalService.setOffer({ offer: value, type: ModalType.order });
    this.modalService.open();
  }

  prevToSlide(event: MouseEvent) {
    this.sliderService.prevToSlide(event, this.carousel);
    this.restartAutoplay();
  }

  nextToSlide(event: MouseEvent) {
    this.sliderService.nextToSlide(event, this.carousel);
    this.restartAutoplay();
  }

  goToSlide(index: number, event: MouseEvent) {
    this.sliderService.goToSlide(index, this.carousel, event);
    this.restartAutoplay();
  }

  private restartAutoplay() {
    if (this.autoplayTimeout) {
      clearTimeout(this.autoplayTimeout);
    }
    
    // Останавливаем автопрокрутку
    if (this.carousel) {
      this.carousel.stopAutoplay();
    }
    
    // Возобновляем через 5 секунд
    this.autoplayTimeout = setTimeout(() => {
      if (this.carousel) {
        this.carousel.startAutoplay();
      }
    }, 5000);
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
