import { Component, inject, OnInit, effect } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BooksService } from '../../../core/services/books';

@Component({
  selector: 'app-book-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './book-form.html',
  styleUrl: './book-form.css'
})
export class BookForm implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  service = inject(BooksService);

  editId: number | null = null;
  isEdit = false;
  submitting = false;

  // Track selected author IDs for many-to-many
  selectedAuthorIds: number[] = [];

  form = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(2)]],
    year: [new Date().getFullYear(), [Validators.required, Validators.min(1000)]],
    publisherId: [null as number | null]
  });

  constructor() {
    effect(() => {
      const book = this.service.selectedBook();
      if (book && this.isEdit) {
        this.form.patchValue({
          title: book.title,
          year: book.year,
          publisherId: book.publisher?.id ?? null
        });
        // Pre-select the authors — many-to-many
        this.selectedAuthorIds = book.authors.map(a => a.id);
      }
    });
  }

  ngOnInit() {
    // Always load authors and publishers for the dropdowns
    this.service.loadAuthors();
    this.service.loadPublishers();

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = Number(id);
      this.isEdit = true;
      this.service.loadOne(this.editId);
    }
  }

  // Toggle author selection — many-to-many
  toggleAuthor(authorId: number) {
    if (this.selectedAuthorIds.includes(authorId)) {
      this.selectedAuthorIds = this.selectedAuthorIds.filter(id => id !== authorId);
    } else {
      this.selectedAuthorIds = [...this.selectedAuthorIds, authorId];
    }
  }

  isAuthorSelected(authorId: number): boolean {
    return this.selectedAuthorIds.includes(authorId);
  }

  get titleControl() { return this.form.get('title')!; }
  get yearControl() { return this.form.get('year')!; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    this.submitting = true;
    const val = this.form.value;

    if (this.isEdit) {
      // Step 1 — update title/year/publisher
      const updateDto = {
        title: val.title!,
        year: val.year!,
        publisherId: val.publisherId ?? null
      };

      this.service.update(this.editId!, updateDto).subscribe({
        next: () => {
          // Step 2 — update authors (many-to-many)
          this.service.updateAuthors(this.editId!, {
            authorIds: this.selectedAuthorIds
          }).subscribe({
            next: () => {
              this.submitting = false;
              this.router.navigate(['/books']);
            },
            error: () => { this.submitting = false; alert('Failed to update authors'); }
          });
        },
        error: () => { this.submitting = false; alert('Failed to update book'); }
      });

    } else {
      // Create — authors included in the create DTO
      const createDto = {
        title: val.title!,
        year: val.year!,
        publisherId: val.publisherId ?? null,
        authorIds: this.selectedAuthorIds
      };

      this.service.create(createDto).subscribe({
        next: () => { this.submitting = false; this.router.navigate(['/books']); },
        error: () => { this.submitting = false; alert('Failed to create book'); }
      });
    }
  }
}
