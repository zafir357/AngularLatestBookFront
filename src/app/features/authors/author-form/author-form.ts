import { Component, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthorsService } from '../../../core/services/authors';

@Component({
  selector: 'app-author-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './author-form.html',
  styleUrl: './author-form.css'
})
export class AuthorForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(AuthorsService);

  editId: number | null = null;
  isEdit = false;
  submitting = false;
  selectedBookIds: number[] = [];

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    country: ['', Validators.required]
  });

  constructor() {
    effect(() => {
      const a = this.service.selectedAuthor();
      if (a && this.isEdit) {
        this.form.patchValue({ name: a.name, country: a.country });
        this.selectedBookIds = a.books.map(b => b.id);
      }
    });
  }

  ngOnInit() {
    this.service.loadBooks();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.service.loadOne(this.editId);
    }
  }

  toggleBook(bookId: number) {
    if (this.selectedBookIds.includes(bookId)) {
      this.selectedBookIds = this.selectedBookIds.filter(id => id !== bookId);
    } else {
      this.selectedBookIds = [...this.selectedBookIds, bookId];
    }
  }

  isBookSelected(bookId: number): boolean {
    return this.selectedBookIds.includes(bookId);
  }

  get nameControl() { return this.form.get('name')!; }
  get countryControl() { return this.form.get('country')!; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting = true;
    const dto = this.form.value as { name: string; country: string };

    if (this.isEdit) {
      this.service.update(this.editId!, dto).subscribe({
        next: () => {
          this.service.updateBooks(this.editId!, this.selectedBookIds).subscribe({
            next: () => {
              this.submitting = false;
              this.router.navigate(['/authors']);
            },
            error: () => { this.submitting = false; alert('Failed to update books'); }
          });
        },
        error: () => { this.submitting = false; alert('Failed to update author'); }
      });
    } else {
      this.service.create(dto).subscribe({
        next: () => { this.submitting = false; this.router.navigate(['/authors']); },
        error: () => { this.submitting = false; alert('Something went wrong'); }
      });
    }
  }
}
