import { CategoriesEnum } from './categories.enum'

export interface CategoryInterface {
  id: string;
  name: CategoriesEnum;
  url: string;
  isActive?: boolean;
}
