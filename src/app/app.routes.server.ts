import { inject } from '@angular/core';
import { RenderMode, ServerRoute } from '@angular/ssr';
import { firstValueFrom } from 'rxjs';
import { ArticlesService } from './shared/services/articles-service';
import { ArticleResponse } from './types/article/articleReponse.interface';
import { DefaultResponse } from './types/defaultResponse.interface';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'blog',
    renderMode: RenderMode.Server,
  },
  {
    path: 'article/:url',
    renderMode: RenderMode.Prerender,

    async getPrerenderParams() {
      try {
        const articleService = inject(ArticlesService);
        const articles = await firstValueFrom(articleService.getArticles());
        if ((articles as DefaultResponse).error !== undefined) {
          throw new Error('Ошибка получения статей');
        }

        const urls = (articles as ArticleResponse).items.map(
          article => article.url
        );
        return urls.map(url => ({ url }));
      } catch (error) {
        console.error('Error in getPrerenderParams:', error);
        return [];
      }
    },
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'signup',
    renderMode: RenderMode.Prerender,
  },
];
