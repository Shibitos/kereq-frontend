import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {CommunicatorService} from "../../services/communicator.service";
import {Message} from "stompjs";
import {ConnectionEvent} from "../../models/connection-event.model";
import {ConnectionType} from "../../enums/connection-type.enum";
import {ChatMessage} from "../../models/chat-message.model";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {FormProperties} from "../../utils/form-properties";
import {FormBuilder, Validators} from "@angular/forms";
import {ChatWindowEventService} from "../../services/chat-window-event.service";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  loggedUser: User;

  @Input()
  recipient: User;

  chatMessages: ChatMessage[] = [];

  messageForm: FormProperties = new FormProperties();

  constructor(private formBuilder: FormBuilder,
              private communicatorService: CommunicatorService,
              private userService: UserService,
              private authService: AuthService,
              private chatWindowEventService: ChatWindowEventService) { }

  //TODO: if message event and minimized, add unread count. If maximized and scrolled clear unread count. Show unread count as red circle with number.

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => {
      if (u.id) {
        this.loggedUser = u;
        // this.communicatorService.onConnection(() => {
        //         //   this.communicatorService.addSubscription('/user/queue/messages-inbox', this.onMessage.bind(this));
        //         // });
        this.communicatorService.addSubscription('/user/queue/messages-inbox', this.onMessage.bind(this));
      }
    });
    this.messageForm.form = this.formBuilder.group({
      content: ['', [
        Validators.minLength(1),
        Validators.maxLength(400)
      ]]
    });
  }

  onMessage(message: Message) {
    let chatMessage: ChatMessage = JSON.parse(message.body);
    console.log("Got mess", chatMessage);
    if (chatMessage.senderId !== this.recipient.id && chatMessage.recipientId !== this.recipient.id) {
      return;
    }
    if (this.chatMessages.findIndex(m => m.id === chatMessage.id) == -1) {
      let insertIndex = this.findIndexForMessage(chatMessage.sendDate);
      if (insertIndex === -1) {
        this.chatMessages.push(chatMessage);
      } else {
        this.chatMessages.splice(insertIndex, 0, chatMessage);
      }
    } else {
      console.log("Chat: duplicated message", chatMessage.id);
    }
  }

  sendMessage() {
    let chatMessage: ChatMessage = this.messageForm.form.value;
    if (!this.loggedUser.id || !this.recipient.id) {
      console.error("Chat: empty user/recipient id");
      return;
    }
    chatMessage.senderId = this.loggedUser.id;
    chatMessage.recipientId = this.recipient.id;
    this.communicatorService.sendMessage("/messages-outbox", chatMessage);
    this.messageForm.reset(); //TODO: success check stomp?
    //TODO: early save?
  }

  onSubmit() {
    if (this.messageForm.onSubmit()) {
      this.sendMessage();
    }
  }

  findIndexForMessage(sendDate: Date) {
    let current = -1;
    for (let i = 0; i < this.chatMessages.length; i++) {
      if (sendDate < this.chatMessages[i].sendDate) {
        current = i - 1;
        break;
      }
    }
    return current;
  }

  close() {
    if (this.recipient.id) {
      this.chatWindowEventService.closeWindow(this.recipient.id);
    }
  }

  get f() {
    return this.messageForm.form.controls;
  }
}
