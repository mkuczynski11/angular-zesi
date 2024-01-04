import { TestBed } from '@angular/core/testing';

import { GreetingsServiceService } from './greetings-service.service';

describe('GreetingsServiceService', () => {
  let service: GreetingsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GreetingsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
