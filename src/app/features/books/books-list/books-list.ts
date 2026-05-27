import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BooksService } from '../../../core/services/books';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog-service';

@Component({
  selector: 'app-books-list',
  imports: [RouterLink],
  templateUrl: './books-list.html',
  styleUrl: './books-list.css'
})
export class BooksList implements OnInit {
  service = inject(BooksService);
  private dialog = inject(ConfirmDialogService);

  ngOnInit() {
    this.service.loadAll();
  }

  async delete(id: number, title: string) {
    const confirmed = await this.dialog.open({
      title: 'Delete Book',
      message: `Are you sure you want to delete "${title}"?`,
      confirmText: 'Delete',
      danger: true
    });

    if (!confirmed) return;

    this.service.delete(id).subscribe({
      next: () => this.service.loadAll(),
      error: () => alert('Failed to delete book')
    });
  }
}
