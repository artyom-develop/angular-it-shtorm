import { OffersEnum } from '../offereEnum.enum';

export interface ArticleInterface {
  image: string;
  title: OffersEnum;
  subtitle: string;
  price: number;
}
