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
import { SliderInterface } from '../../../types/main/sliderInterface.interface';
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
  autoplayIntervalSignal = signal(0);
  private modalService = inject(ModalService);
  private destroyRef = inject(DestroyRef);
  private sliderService = inject(SliderService);
  private autoplayTimeout: number | null = null;

  constructor() {
    this.slides = this.sliderService.slides;
    this.currentSlideIndex = this.sliderService.currentSlideIndex;
    this.autoplayIntervalSignal = this.sliderService.autoplayIntervalSignal;
    effect(() => {
      if (this.sliderService.currentSlideIndex() !== this.currentSlideIndex()) {
        this.currentSlideIndex = this.sliderService.currentSlideIndex;
      }
    });
    effect(() => {
      if (this.autoplayIntervalSignal() !== this.sliderService.autoplayIntervalSignal()) {
        this.autoplayIntervalSignal = this.sliderService.autoplayIntervalSignal;
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.autoplayTimeout) {
        clearTimeout(this.autoplayTimeout);
      }
    });
  }

  consultationTo(value: OffersEnum) {
    this.modalService.setOffer({ offer: value, type: ModalType.consultation });
    this.modalService.open();
  }

  prevToSlide(event: MouseEvent) {
    this.sliderService.prevToSlide(event, this.carousel);
  }

  nextToSlide(event: MouseEvent) {
    this.sliderService.nextToSlide(event, this.carousel);
  }

  goToSlide(index: number, event: MouseEvent) {
    this.sliderService.goToSlide(index, this.carousel, event);
  }

  ngAfterViewInit() {
    if (this.carousel) {
      this.carousel.onPage.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event: any) => {
        this.currentSlideIndex.set(event.page);
      });
    }
  }
}
