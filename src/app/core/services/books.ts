import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Book, CreateBook, UpdateBook, UpdateBookAuthors } from '../models/book';
import { Author } from '../models/author';
import { Publisher } from '../models/publisher';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/books`;

  books = signal<Book[]>([]);
  selectedBook = signal<Book | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // For the form dropdowns
  availableAuthors = signal<Author[]>([]);
  availablePublishers = signal<Publisher[]>([]);

  loadAll() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Book[]>(this.baseUrl).subscribe({
      next: (data) => { this.books.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load books'); this.loading.set(false); }
    });
  }

  loadOne(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Book>(`${this.baseUrl}/${id}`).subscribe({
      next: (data) => { this.selectedBook.set(data); this.loading.set(false); },
      error: () => { this.error.set('Book not found'); this.loading.set(false); }
    });
  }

  loadAuthors() {
    this.http.get<Author[]>(`${environment.apiBaseUrl}/authors`).subscribe({
      next: (data) => this.availableAuthors.set(data)
    });
  }

  loadPublishers() {
    this.http.get<Publisher[]>(`${environment.apiBaseUrl}/publishers`).subscribe({
      next: (data) => this.availablePublishers.set(data)
    });
  }

  create(dto: CreateBook) {
    return this.http.post<Book>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateBook) {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  updateAuthors(id: number, dto: UpdateBookAuthors) {
    return this.http.put(`${this.baseUrl}/${id}/authors`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
