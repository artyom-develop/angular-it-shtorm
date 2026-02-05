import { Component, inject } from '@angular/core';
import { ModalService } from '../../../shared/services/modal-service';
import { Advantages } from '../advantages/advantages';
import { Comments } from '../comments/comments';
import { Map } from '../map/map';
import { Offers } from '../offers/offers';
import { Populars } from '../populars/populars';
import { Slider } from '../slider/slider';

@Component({
  selector: 'app-main',
  imports: [Slider, Offers, Advantages, Populars, Comments, Map],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  modalService = inject(ModalService);
  offers = this.modalService.offers;
  fullOffers = this.modalService.fulOffers;
}
