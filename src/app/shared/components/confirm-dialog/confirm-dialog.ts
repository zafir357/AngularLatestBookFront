import { Component, inject } from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog-service';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  templateUrl: './confirm-dialog.html',
  styleUrl: './confirm-dialog.css'
})
export class ConfirmDialogComponent {
  dialogService = inject(ConfirmDialogService);
}
