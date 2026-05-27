import { Routes } from '@angular/router';

export const BOOKS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./books-list/books-list').then(m => m.BooksList)
  },
  {
    path: 'create',
    loadComponent: () =>
      import('./book-form/book-form').then(m => m.BookForm)
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./book-detail/book-detail').then(m => m.BookDetail)
  },
  {
    path: ':id/edit',
    loadComponent: () =>
      import('./book-form/book-form').then(m => m.BookForm)
  }
];
