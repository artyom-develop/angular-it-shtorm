import { Component, inject, Input } from '@angular/core';
import { ModalService } from '../../../shared/services/modal-service';
import { ArticleInterface } from '../../../types/main/offer.interface';
import { ModalType } from '../../../types/modal/modalRequest.interface';
import { OffersEnum } from '../../../types/offereEnum.enum';

@Component({
  selector: 'app-offers',
  imports: [],
  templateUrl: './offers.html',
  styleUrl: './offers.scss',
})
export class Offers {
  @Input() fullOffers: ArticleInterface[] = [];
  modalService = inject(ModalService);
  modalOpen(offerTitle: OffersEnum) {
    this.modalService.setOffer({ offer: offerTitle, type: ModalType.order });
    this.modalService.open();
  }
}
