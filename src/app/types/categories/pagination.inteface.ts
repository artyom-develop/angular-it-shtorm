import { ArticleInterface } from '../main/offer.interface'

export interface PaginationInterface {
	page: number;
	count: number;
	items: ArticleInterface[]
}