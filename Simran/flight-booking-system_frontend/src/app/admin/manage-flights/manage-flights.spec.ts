import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageFlights } from './manage-flights';

describe('ManageFlights', () => {
  let component: ManageFlights;
  let fixture: ComponentFixture<ManageFlights>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageFlights],
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFlights);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
