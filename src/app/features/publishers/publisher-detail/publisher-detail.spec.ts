import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublisherDetail } from './publisher-detail';

describe('PublisherDetail', () => {
  let component: PublisherDetail;
  let fixture: ComponentFixture<PublisherDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublisherDetail],
    }).compileComponents();

    fixture = TestBed.createComponent(PublisherDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
