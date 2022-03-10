import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatWindowContainerComponent } from './chat-window-container.component';

describe('ChatWindowContainerComponent', () => {
  let component: ChatWindowContainerComponent;
  let fixture: ComponentFixture<ChatWindowContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatWindowContainerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatWindowContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
