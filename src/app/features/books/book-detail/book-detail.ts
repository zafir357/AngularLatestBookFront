import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BooksService } from '../../../core/services/books';

@Component({
  selector: 'app-book-detail',
  imports: [RouterLink],
  templateUrl: './book-detail.html',
  styleUrl: './book-detail.css'
})
export class BookDetail implements OnInit {
  private route = inject(ActivatedRoute);
  service = inject(BooksService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.loadOne(id);
  }
}
