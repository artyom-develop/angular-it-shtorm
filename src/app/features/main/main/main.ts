import { Component, inject } from '@angular/core';
import { ModalService } from '../../../shared/services/modal-service';
import { Offers } from '../offers/offers';
import { Slider } from '../slider/slider';

@Component({
  selector: 'app-main',
  imports: [Slider, Offers],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  modalService = inject(ModalService);
  offers = this.modalService.offers;
  fullOffers = this.modalService.fulOffers;
}
