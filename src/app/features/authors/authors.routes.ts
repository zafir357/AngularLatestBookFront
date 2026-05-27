import { Routes } from '@angular/router';

export const AUTHORS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./authors-list/authors-list').then(m => m.AuthorsList)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./author-form/author-form').then(m => m.AuthorForm)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./author-detail/author-detail').then(m => m.AuthorDetail)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./author-form/author-form').then(m => m.AuthorForm)
  }
];
