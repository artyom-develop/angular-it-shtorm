import { Component, inject } from '@angular/core';
import { ModalService } from '../../../shared/services/modal-service';
import { Offers } from '../offers/offers';
import { Slider } from '../slider/slider';
import { Advantages } from "../advantages/advantages";
import { Populars } from "../populars/populars";
import { Comments } from "../comments/comments";
import { Map } from "../map/map";

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
