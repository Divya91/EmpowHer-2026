import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchWithFilters } from './search-with-filters';

describe('SearchWithFilters', () => {
  let component: SearchWithFilters;
  let fixture: ComponentFixture<SearchWithFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchWithFilters],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchWithFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
