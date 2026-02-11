import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { financeInitGuard } from '@core/guards/finance-init.guard';
import { welcomeGuard } from '@core/guards/welcome.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'finance-space',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    canActivate: [welcomeGuard],
    loadComponent: () =>
      import('./pages/welcome/welcome'),
  },
  {
    path: 'setup',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/setup/setup'),
  },
  {
    path: 'setup/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/setup/setup'),
  },
  {
    path: 'finance-space',
    canActivate: [financeInitGuard],
    loadComponent: () => import('./layout/finance-space/finance-space'),
    children: [
      {
        path: '',
        redirectTo: 'movements',
        pathMatch: 'full',
      },
      {
        path: 'movements',
        children: [
          {
            path: '',
            loadComponent: () => import('./pages/movements/movements'),
          },
          {
            path: 'new',
            loadComponent: () => import('./pages/movement-form/movement-form')
          },
          {
            path: ':id',
            loadComponent: () => import('./pages/movement-detail/movement-detail')
          },
          {
            path: ':id/edit',
            loadComponent: () => import('./pages/movement-form/movement-form')
          }
        ]
      },
      {
        path: 'summary',
        loadComponent: () => import('./pages/summary/summary')
      },
      {
        path: 'salary-list',
        loadComponent: () => import('./pages/salary-list/salary-list')
      },
      {
        path: 'saving',
        loadComponent: () => import('./pages/saving/saving')
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings')
      },
      {
        path: '**',
        redirectTo: 'home'
      },
    ]
  },
  {
    path: '**',
    redirectTo: 'welcome'
  }
];
