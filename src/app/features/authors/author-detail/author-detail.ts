import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthorsService } from '../../../core/services/authors';

@Component({
  selector: 'app-author-detail',
  imports: [RouterLink],
  templateUrl: './author-detail.html',
  styleUrl: './author-detail.css'
})
export class AuthorDetail implements OnInit {
  private route = inject(ActivatedRoute);
  service = inject(AuthorsService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.loadOne(id);
  }
}
