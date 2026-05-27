import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { PublishersService } from '../../../core/services/publishers';

@Component({
  selector: 'app-publisher-detail',
  imports: [RouterLink],
  templateUrl: './publisher-detail.html',
  styleUrl: './publisher-detail.css'
})
export class PublisherDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  service = inject(PublishersService);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.service.loadOne(id);
  }
}
