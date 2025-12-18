import { OffersEnum } from '../offereEnum.enum'

export interface SliderInterface{
  id: number,
  label: string,
  title: string,
  accent: string,
  buttonText: string,
  after: boolean,
  description?: string,
  image: string,
  offer: OffersEnum,
}
