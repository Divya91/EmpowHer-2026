import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingHome } from './landing-home';

describe('LandingHome', () => {
  let component: LandingHome;
  let fixture: ComponentFixture<LandingHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingHome],
    }).compileComponents();

    fixture = TestBed.createComponent(LandingHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
