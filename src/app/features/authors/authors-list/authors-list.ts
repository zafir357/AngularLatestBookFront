import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthorsService } from '../../../core/services/authors';
import { ConfirmDialogService } from '../../../shared/components/confirm-dialog/confirm-dialog-service';

@Component({
  selector: 'app-authors-list',
  imports: [RouterLink],
  templateUrl: './authors-list.html',
  styleUrl: './authors-list.css'
})
export class AuthorsList implements OnInit {
  service = inject(AuthorsService);
  private dialog = inject(ConfirmDialogService);

  ngOnInit() {
    this.service.loadAll();
  }

async delete(id: number, bookCount: number) {
  const confirmed = await this.dialog.open({
    title: 'Supprimer l\'auteur',
    message: bookCount > 0
      ? `Cet auteur a ${bookCount} livre(s). Êtes-vous sûr ?`
      : 'Êtes-vous sûr de vouloir supprimer cet auteur ?',
    confirmText: 'Supprimer',
    danger: true
  });

  if (!confirmed) return;

  this.service.delete(id).subscribe({
    next: () => this.service.loadAll(),
    error: () => alert('Échec de la suppression de l\'auteur')
  });
}
}
