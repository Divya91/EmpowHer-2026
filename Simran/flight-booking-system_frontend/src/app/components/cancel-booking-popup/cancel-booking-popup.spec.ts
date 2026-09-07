import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CancelBookingPopup } from './cancel-booking-popup';

describe('CancelBookingPopup', () => {
  let component: CancelBookingPopup;
  let fixture: ComponentFixture<CancelBookingPopup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelBookingPopup],
    }).compileComponents();

    fixture = TestBed.createComponent(CancelBookingPopup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
