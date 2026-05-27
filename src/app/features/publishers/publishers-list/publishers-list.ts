import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PublishersService } from '../../../core/services/publishers';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog-service';

@Component({
  selector: 'app-publishers-list',
  imports: [RouterLink],
  templateUrl: './publishers-list.html',
  styleUrl: './publishers-list.css'
})
export class PublishersListComponent implements OnInit {
  service = inject(PublishersService);
  private dialog = inject(ConfirmDialogService);

  ngOnInit() {
    this.service.loadAll();
  }

  async delete(id: number, bookCount: number) {
    const message = bookCount > 0
      ? `This publisher has ${bookCount} book(s). Deleting it will leave them without a publisher.`
      : 'Are you sure you want to delete this publisher?';

    const confirmed = await this.dialog.open({
      title: 'Delete Publisher',
      message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true
    });

    if (!confirmed) return;

    this.service.delete(id).subscribe({
      next: () => this.service.loadAll(),
      error: () => alert('Failed to delete publisher')
    });
  }
}
