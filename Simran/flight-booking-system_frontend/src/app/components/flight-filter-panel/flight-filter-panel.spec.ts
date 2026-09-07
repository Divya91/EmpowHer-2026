import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlightFilterPanel } from './flight-filter-panel';

describe('FlightFilterPanel', () => {
  let component: FlightFilterPanel;
  let fixture: ComponentFixture<FlightFilterPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FlightFilterPanel],
    }).compileComponents();

    fixture = TestBed.createComponent(FlightFilterPanel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
