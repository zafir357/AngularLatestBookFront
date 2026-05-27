import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Author, CreateAuthor } from '../models/author';
import { Book } from '../models/book';




@Injectable({ providedIn: 'root' })
export class AuthorsService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/authors`;

  authors = signal<Author[]>([]);
  selectedAuthor = signal<Author | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  availableBooks = signal<Book[]>([]);
  selectedBookIds: number[] = [];
  loadBooks() {
    this.http.get<Book[]>(`${environment.apiBaseUrl}/books`).subscribe({
      next: (data) => this.availableBooks.set(data)
    });
  }

  updateBooks(authorId: number, bookIds: number[]) {
    // We use the existing books endpoint — update each book's authors
    // Since the API manages the relationship from the book side,
    // we call PUT /books/{id}/authors for each affected book
    return this.http.put(
      `${environment.apiBaseUrl}/authors/${authorId}/books`,
      { bookIds }
    );
  }
  loadAll() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Author[]>(this.baseUrl).subscribe({
      next: (data) => { this.authors.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load authors'); this.loading.set(false); }
    });
  }

  loadOne(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Author>(`${this.baseUrl}/${id}`).subscribe({
      next: (data) => { this.selectedAuthor.set(data); this.loading.set(false); },
      error: () => { this.error.set('Author not found'); this.loading.set(false); }
    });
  }

  create(dto: CreateAuthor) {
    return this.http.post<Author>(this.baseUrl, dto);
  }

  update(id: number, dto: CreateAuthor) {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
