import { Routes } from '@angular/router';
import { forwardGuard } from './core/guards/forward-guard';
import { Layout } from './shared/layout/layout';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/main/index').then(m => m.Main),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/index').then(m => m.Login),
        canActivate: [forwardGuard],
      },
      {
        path: 'signup',
        loadComponent: () =>
          import('./features/auth/index').then(m => m.Signup),
        canActivate: [forwardGuard],
      },
      {
        path: 'blog',
        loadComponent: () => import('./features/blog/index').then(m => m.Blog),
      },
      {
        path: 'article/:url',
        loadComponent: () =>
          import('./features/blog/index').then(m => m.Article),
      },
    ],
  },
];
