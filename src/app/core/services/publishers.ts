import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Publisher, CreatePublisher } from '../models/publisher';
import { Book } from '../models/book';

@Injectable({ providedIn: 'root' })
export class PublishersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/publishers`;

  publishers = signal<Publisher[]>([]);
  selectedPublisher = signal<Publisher | null>(null);
  availableBooks = signal<Book[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  loadAll() {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Publisher[]>(this.baseUrl).subscribe({
      next: (data) => { this.publishers.set(data); this.loading.set(false); },
      error: () => { this.error.set('Failed to load publishers'); this.loading.set(false); }
    });
  }

  loadOne(id: number) {
    this.loading.set(true);
    this.error.set(null);
    this.http.get<Publisher>(`${this.baseUrl}/${id}`).subscribe({
      next: (data) => { this.selectedPublisher.set(data); this.loading.set(false); },
      error: () => { this.error.set('Publisher not found'); this.loading.set(false); }
    });
  }

  loadBooks() {
    this.http.get<Book[]>(`${environment.apiBaseUrl}/books`).subscribe({
      next: (data) => this.availableBooks.set(data)
    });
  }

  create(dto: CreatePublisher) {
    return this.http.post<Publisher>(this.baseUrl, dto);
  }

  update(id: number, dto: CreatePublisher) {
    return this.http.put(`${this.baseUrl}/${id}`, dto);
  }

  updateBooks(publisherId: number, bookIds: number[]) {
    return this.http.put(`${this.baseUrl}/${publisherId}/books`, { bookIds });
  }

  delete(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
