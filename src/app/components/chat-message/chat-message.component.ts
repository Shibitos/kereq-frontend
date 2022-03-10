import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {ChatMessage} from "../../models/chat-message.model";

declare var bootstrap: any;

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input()
  author: User;

  @Input()
  message: ChatMessage;

  @Input()
  isIncoming: boolean;

  constructor() { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    let tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl, { customClass: 'chat-message-tooltip' });
    });
  }
}
