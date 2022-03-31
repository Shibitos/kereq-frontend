import {Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {User} from "../../models/user.model";
import {CommunicatorService} from "../../services/communicator.service";
import {ChatMessage} from "../../models/chat-message.model";
import {UserService} from "../../services/user.service";
import {AuthService} from "../../services/auth.service";
import {FormProperties} from "../../utils/form-properties";
import {FormBuilder, Validators} from "@angular/forms";
import {ChatWindowEventService} from "../../services/chat-window-event.service";
import {PageUtil} from "../../utils/page.util";
import {Subject, Subscription} from "rxjs";

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss']
})
export class ChatWindowComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();
  messageSubscription: Subscription;

  loggedUser: User;

  @Input()
  recipient: User;

  @ViewChild('messageContainerRef')
  private messageContainerRef: ElementRef;

  @ViewChildren('messagesRef')
  private messagesRef: QueryList<any>;

  chatMessages: ChatMessage[] = [];
  chatMessagesPageTool: PageUtil<ChatMessage>;
  firstScrolled: boolean = false;

  messageForm: FormProperties = new FormProperties();

  constructor(private formBuilder: FormBuilder,
              private communicatorService: CommunicatorService,
              private userService: UserService,
              private authService: AuthService,
              private chatWindowEventService: ChatWindowEventService) { }

  //TODO: if message event and minimized, add unread count. If maximized and scrolled clear unread count. Show unread count as red circle with number.
  //TODO: add button to scroll down while browsing, light it when new unread message.

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => {
      if (u.id) {
        this.loggedUser = u;
        this.messageSubscription = this.communicatorService.messagesSubject.subscribe(this.onMessage.bind(this));
      }
    });
    this.messageForm.form = this.formBuilder.group({
      content: ['', [
        Validators.minLength(1),
        Validators.maxLength(400)
      ]]
    });
    this.chatMessagesPageTool = new PageUtil<ChatMessage>(this.communicatorService.getMessagesWith.bind(this.communicatorService), this.chatMessages, 20, this.recipient.id, false, this.onMessagesLoad.bind(this));

  }

  ngAfterViewInit() {
    this.messagesRef.changes.subscribe(this.scrollToBottom.bind(this));
  }

  scrollToBottom(): void {
    if (!this.firstScrolled) {
      this.messageContainerRef.nativeElement.scrollTop = this.messageContainerRef.nativeElement.scrollHeight;
      this.firstScrolled = true;
    } else {
      let currentScroll = this.messageContainerRef.nativeElement.scrollTop;
      let maxScroll = this.messageContainerRef.nativeElement.scrollHeight - this.messageContainerRef.nativeElement.clientHeight;
      if ((currentScroll / maxScroll) > 0.6) {
        this.messageContainerRef.nativeElement.scrollTop = maxScroll;
      }
    }
  }

  onMessage(chatMessage: ChatMessage) {
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
      if (!chatMessage.read && chatMessage.senderId != this.loggedUser.id) {
        this.communicatorService.markMessageRead(chatMessage);
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
    this.communicatorService.sendMessage(CommunicatorService.MESSAGES_OUTBOX_DESTINATION, chatMessage);
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
      this.messageSubscription.unsubscribe();
      this.chatWindowEventService.closeWindow(this.recipient.id);
    }
  }

  loadMore() {
    this.chatMessagesPageTool.loadMore();
  }

  onMessagesLoad(chatMessages: ChatMessage[]) {
    for (let chatMessage of chatMessages) {
      if (!chatMessage.read && chatMessage.senderId != this.loggedUser.id) {
        this.communicatorService.markMessageRead(chatMessage);
      }
    }
    this.filterSortMessages();
  }

  filterSortMessages() {
    let filtered = this.chatMessages.filter((value, index, self) =>
      index === self.findIndex((t: ChatMessage) => t.id === value.id)
    );
    filtered.sort((a: ChatMessage, b: ChatMessage) => new Date(a.sendDate).getTime() - new Date(b.sendDate).getTime());
    this.chatMessages.length = 0;
    this.chatMessages.push(...filtered);
  }

  get f() {
    return this.messageForm.form.controls;
  }
}
