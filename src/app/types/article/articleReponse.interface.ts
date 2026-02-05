import { ArticleInterface } from './articleTop.interface'

export interface ArticleResponse { 
	pages: number;
	items: ArticleInterface[];
	count: number;
}