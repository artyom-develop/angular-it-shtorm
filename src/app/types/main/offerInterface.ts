import { OffersEnum } from '../offereEnum.enum'

export interface OfferInterface{
	image: string;
	title: OffersEnum;
	subtitle: string;
	price: number;
}