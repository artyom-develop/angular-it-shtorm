import { RouterOutlet, Routes } from '@angular/router';
import { Layout } from './shared/layout/layout';
import { forwardGuard } from './core/guards/forward-guard';
import { Main } from './features/main/main/main';

export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {
        path: '',
        loadComponent: () => import('./features/main/index').then((m) => m.Main),
      },
      {
        path: 'login',
        loadComponent: () => import('./features/auth/index').then((m) => m.Login),
        canActivate: [forwardGuard],
      },
      {
        path: 'signup',
        loadComponent: () => import('./features/auth/index').then((m) => m.Signup),
        canActivate: [forwardGuard],
      },
    ],
  },
];
