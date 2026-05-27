import { Routes } from '@angular/router';

export const PUBLISHERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./publishers-list/publishers-list').then(m => m.PublishersListComponent)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./publisher-form/publisher-form').then(m => m.PublisherForm)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./publisher-detail/publisher-detail').then(m => m.PublisherDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./publisher-form/publisher-form').then(m => m.PublisherForm)
  }
];
