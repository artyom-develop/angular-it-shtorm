import { Params } from '@angular/router';
import { ActivateParamsInterface } from '../../types/categories/activateParams.interface';

export class ActiveParamsUtil {
  static processParams(params: Params): ActivateParamsInterface {
    const activateParams: ActivateParamsInterface = {
      categories: [],
      page: 1,
    };
    const categories: string[] = params['categories'];
    if (params.hasOwnProperty('categories')) {
      activateParams.categories = Array.isArray(categories)
        ? categories
        : [categories];
    }

    if (params.hasOwnProperty('page')) {
      activateParams.page = +params['page']; // Преобразуем в число
    }

    if (params.hasOwnProperty('url')) {
      activateParams.url = params['url'];
    }

    return activateParams;
  }
}
