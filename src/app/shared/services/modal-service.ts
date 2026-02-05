import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { DefaultResponse } from '../../types/defaultResponse.interface';
import { ArticleInterface } from '../../types/main/offer.interface';
import { ModalObj } from '../../types/modal/modal-obj.interface';
import {
  ModalRequest,
  ModalType,
} from '../../types/modal/modalRequest.interface';
import { OffersEnum } from '../../types/offereEnum.enum';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  http = inject(HttpClient);

  offer$ = new BehaviorSubject<ModalObj>({
    offer: '',
    type: ModalType.order,
  });

  isOpen$ = new BehaviorSubject<boolean>(false);

  setOffer(value: ModalObj) {
    this.offer$.next(value);
  }
  close() {
    this.isOpen$.next(false);
  }
  open() {
    this.isOpen$.next(true);
  }

  createOrder(order: ModalRequest): Observable<DefaultResponse> {
    return this.http.post<DefaultResponse>(
      environment.apiUrl + '/requests',
      order
    );
  }

  offers: OffersEnum[] = [
    OffersEnum.WEBSITE_CREATION,
    OffersEnum.MARKETING,
    OffersEnum.ADVERTISING,
    OffersEnum.COPYWRITING,
  ];
  fulOffers: ArticleInterface[] = [
    {
      image: 'assets/images/main/offers/offer-1.png',
      title: OffersEnum.WEBSITE_CREATION,
      subtitle:
        'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 7500,
    },
    {
      image: 'assets/images/main/offers/offer-2.png',
      title: OffersEnum.MARKETING,
      subtitle:
        'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 3500,
    },
    {
      image: 'assets/images/main/offers/offer-3.png',
      title: OffersEnum.ADVERTISING,
      subtitle:
        'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 1000,
    },
    {
      image: 'assets/images/main/offers/offer-4.png',
      title: OffersEnum.COPYWRITING,
      subtitle:
        'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 750,
    },
  ];
}
