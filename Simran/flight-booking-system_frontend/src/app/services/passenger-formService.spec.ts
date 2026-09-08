import { TestBed } from '@angular/core/testing';

import { PassengerFormServices } from './passenger-formService';

describe('PassengerForm', () => {
  let service: PassengerFormServices;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PassengerFormServices);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
