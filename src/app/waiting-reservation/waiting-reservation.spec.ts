import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitingReservation } from './waiting-reservation';

describe('WaitingReservation', () => {
  let component: WaitingReservation;
  let fixture: ComponentFixture<WaitingReservation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WaitingReservation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaitingReservation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
