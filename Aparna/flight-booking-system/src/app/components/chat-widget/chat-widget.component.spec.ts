import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ChatWidgetComponent } from './chat-widget.component';

describe('ChatWidgetComponent', () => {
  let component: ChatWidgetComponent;
  let fixture: ComponentFixture<ChatWidgetComponent>;
  let httpTesting: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatWidgetComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChatWidgetComponent);
    component = fixture.componentInstance;
    httpTesting = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should create component and have interactive topic chips ready', () => {
    expect(component).toBeTruthy();
    expect(component.interactiveTopics.length).toBeGreaterThan(0);
    expect(component.interactiveTopics[0].label).toContain('Cancellation');
  });

  it('should toggle chat drawer open and closed', () => {
    expect(component.isOpen).toBe(false);
    component.toggleChat();
    expect(component.isOpen).toBe(true);
    component.toggleChat();
    expect(component.isOpen).toBe(false);
  });

  it('should trigger topic selection and send message', () => {
    const topic = component.interactiveTopics[0];
    component.selectTopic(topic);

    expect(component.messages.length).toBe(2);
    expect(component.messages[1].text).toBe(topic.prompt);

    const reqMsg = httpTesting.expectOne('http://localhost:8081/api/chat');
    expect(reqMsg.request.method).toBe('POST');
    expect(reqMsg.request.body.domain).toBe('BOOKINGS_TICKETS');
    reqMsg.flush({
      conversationId: 'c-99',
      domain: 'BOOKINGS_TICKETS',
      answer: 'You can cancel any booking under My Bookings.'
    });

    expect(component.messages.length).toBe(3);
    expect(component.messages[2].text).toContain('My Bookings');
  });

  it('should send typed user message and append assistant answer', () => {
    component.userMessage = 'How do I cancel a ticket?';
    component.sendMessage();

    expect(component.messages.length).toBe(2);
    expect(component.messages[1].text).toBe('How do I cancel a ticket?');

    const reqMsg = httpTesting.expectOne('http://localhost:8081/api/chat');
    expect(reqMsg.request.method).toBe('POST');
    reqMsg.flush({
      conversationId: 'c-100',
      domain: 'BOOKINGS_TICKETS',
      answer: 'Go to My Bookings and click Cancel.'
    });

    expect(component.messages.length).toBe(3);
    expect(component.messages[2].text).toBe('Go to My Bookings and click Cancel.');
  });
});
