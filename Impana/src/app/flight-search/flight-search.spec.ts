import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

import { FlightSearch } from './flight-search'; 

describe('FlightSearch', () => {
  let component: FlightSearch;
  let fixture: ComponentFixture<FlightSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FlightSearch],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]) // Replaces RouterTestingModule seamlessly
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(FlightSearch);
    component = fixture.componentInstance;
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});