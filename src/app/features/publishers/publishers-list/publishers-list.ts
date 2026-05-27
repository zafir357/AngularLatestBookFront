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
      ? `Cet éditeur a ${bookCount} livre(s). Le supprimer les laissera sans éditeur.`
      : 'Êtes-vous sûr de vouloir supprimer cet éditeur ?';

    const confirmed = await this.dialog.open({
      title: 'Supprimer l\'éditeur',
      message,
      confirmText: 'Supprimer',
      cancelText: 'Annuler',
      danger: true
    });

    if (!confirmed) return;

    this.service.delete(id).subscribe({
      next: () => this.service.loadAll(),
      error: () => alert('Échec de la suppression de l\'éditeur')
    });
  }
}
