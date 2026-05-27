import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishersList } from './publishers-list';

describe('PublishersList', () => {
  let component: PublishersList;
  let fixture: ComponentFixture<PublishersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublishersList],
    }).compileComponents();

    fixture = TestBed.createComponent(PublishersList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
