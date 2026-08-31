import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { ChatService, DomainOption, ChatMessageResponse } from './chat.service';

describe('ChatService', () => {
  let service: ChatService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ChatService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ChatService);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('getDomains_validCall_issuesGETAndReturnsDomains', () => {
    const mockDomains: DomainOption[] = [
      { code: 'FLIGHTS_SEARCH', displayName: 'Flights & Search' },
      { code: 'BOOKINGS_TICKETS', displayName: 'Bookings & Tickets' }
    ];

    service.getDomains().subscribe(domains => {
      expect(domains.length).toBe(2);
      expect(domains[0].code).toBe('FLIGHTS_SEARCH');
    });

    const req = httpTesting.expectOne('http://localhost:8081/api/chat/domains');
    expect(req.request.method).toBe('GET');
    req.flush(mockDomains);
  });

  it('sendMessage_validRequest_issuesPOSTAndReturnsResponse', () => {
    const mockResponse: ChatMessageResponse = {
      conversationId: 'c-1',
      domain: 'FLIGHTS_SEARCH',
      answer: 'Grounded response answer.'
    };

    service.sendMessage({
      domain: 'FLIGHTS_SEARCH',
      message: 'Hello'
    }).subscribe(res => {
      expect(res.conversationId).toBe('c-1');
      expect(res.answer).toBe('Grounded response answer.');
    });

    const req = httpTesting.expectOne('http://localhost:8081/api/chat');
    expect(req.request.method).toBe('POST');
    expect(req.request.body.message).toBe('Hello');
    req.flush(mockResponse);
  });
});
