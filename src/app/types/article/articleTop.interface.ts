import { CategoriesEnum } from '../categories/categories.enum'

export interface ArticleInterface {
  id: string;
  title: string;
	description:string;
  image: string;
  date: string;
  category: CategoriesEnum;
  url: string;
}
