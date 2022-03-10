import { Component, OnInit } from '@angular/core';
import {CommunicatorService} from "../../services/communicator.service";
import {User} from "../../models/user.model";
import {ChatWindowEventService} from "../../services/chat-window-event.service";
import {Subject} from "rxjs";

@Component({
  selector: 'app-chat-window-container',
  templateUrl: './chat-window-container.component.html',
  styleUrls: ['./chat-window-container.component.scss']
})
export class ChatWindowContainerComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  recipients: User[] = [];

  constructor(private communicatorService: CommunicatorService,
              private chatWindowEventService: ChatWindowEventService) { }

  //TODO: listen to message event, if window is not open, open it (if minimized, do nothing).

  //TODO: window should be opened by this class. Control duplicates. Control max windows count.

  ngOnInit(): void {
    this.chatWindowEventService.getOpenWindowSubject().subscribe(recipient => this.openWindow(recipient));
    this.chatWindowEventService.getCloseWindowSubject().subscribe(recipientId => this.closeWindow(recipientId));

    window.addEventListener('scroll', () => {
      document.querySelectorAll('.chat-message-tooltip').forEach(item => {
        if (item.parentNode) item.parentNode.removeChild(item);
      });
    }, true);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  openWindow(recipient: User) {
    console.log("łopen2", this.recipients);
    if (this.recipients.findIndex(r => r.id === recipient.id) === -1) {
      console.log("łopen3");
      this.recipients.push(recipient);
    }
  }

  closeWindow(recipientId: number) {
    let index = this.recipients.findIndex(r => r.id === recipientId);
    if (index !== -1) {
      this.recipients.splice(index, 1);
    }
  }
}
