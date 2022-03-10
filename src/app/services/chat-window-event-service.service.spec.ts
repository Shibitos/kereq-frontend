import { TestBed } from '@angular/core/testing';

import { ChatWindowEventService } from './chat-window-event.service';

describe('ChatWindowEventServiceService', () => {
  let service: ChatWindowEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatWindowEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
