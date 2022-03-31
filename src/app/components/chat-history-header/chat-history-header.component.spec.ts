import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChatHistoryHeaderComponent} from './chat-history-header.component';

describe('ChatHistoryHeaderComponent', () => {
  let component: ChatHistoryHeaderComponent;
  let fixture: ComponentFixture<ChatHistoryHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatHistoryHeaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatHistoryHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
