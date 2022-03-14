import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import {Client, Message} from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from "./auth.service";
import {User} from "../models/user.model";
import {takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {Page} from "../utils/page";
import {HttpClient} from "@angular/common/http";
import {ChatMessage} from "../models/chat-message.model";
import {ConnectionEvent} from "../models/connection-event.model";
import {ChatMessageEventType} from "../enums/chat-message-event-type.enum";
import {ChatMessageEvent} from "../models/chat-message-event.model";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {

  public static MESSAGES_OUTBOX_DESTINATION = '/messages-outbox';
  public static MESSAGES_EVENT_DESTINATION = '/messages-event';

  public static MESSAGES_INBOX_DESTINATION = '/user/queue/messages-inbox';
  public static CONNECTIONS_DESTINATION = '/user/queue/connections';

  connectedSubject: Subject<void> = new Subject<void>();
  chatBarInitialized: Subject<void> = new Subject<void>();
  connectionsSubject: Subject<ConnectionEvent> = new Subject<ConnectionEvent>();
  messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
  messageReadSubject: Subject<ChatMessage> = new Subject<ChatMessage>();

  unsubscribe$: Subject<void> = new Subject<void>();

  private subscribedDestinations: Map<string, string[]> = new Map<string, string[]>();

  private connected: boolean = false;
  private stompClient: Client;
  private retryCounter: number = 0;
  private maxRetryCount: number = 3;
  private retryDelay: number = 2000;

  private websocketEndpoint: string = 'ws';
  private chatEndpoint: string = 'chat';

  constructor(private authService: AuthService, private http: HttpClient) {
    this.authService.currentUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
      if (!user.id) {
        this.disconnect();
      } else {
        this.connect();
      }
    });
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onConnection(callback: () => void) {
    this.connectedSubject.subscribe(() => {
      if (this.connected) {
        callback();
      }
    });
  }

  connect() {
    if (!this.connected && this.authService.isLoggedIn) {
      let socket = new SockJS(environment.communicatorUrl + this.websocketEndpoint);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({ 'Authorization': `Bearer ${this.authService.getToken()}` }, () => {
        this.connected = true;
        this.registerSubscriptions();
        this.connectedSubject.next();
      }, () => {
        if (this.retryCounter < this.maxRetryCount) {
          this.retryCounter += 1;
          setTimeout(this.connect, this.retryDelay);
        }
      });
    }
  }

  disconnect() {
    if (this.connected) {
      this.stompClient.disconnect(() => {
        this.connected = false;
        this.subscribedDestinations.clear();
      });
    }
  }

  onConnectionEvent(message: Message) {
    let connectionEvent: ConnectionEvent = JSON.parse(message.body);
    this.connectionsSubject.next(connectionEvent);
  }

  registerSubscriptions() {
    this.addSubscription(CommunicatorService.CONNECTIONS_DESTINATION, this.onConnectionEvent.bind(this));
    this.addSubscription(CommunicatorService.MESSAGES_INBOX_DESTINATION, this.onMessage.bind(this));
  }

  onMessage(message: Message) {
    let chatMessage: ChatMessage = JSON.parse(message.body);
    this.messagesSubject.next(chatMessage);
  }

  sendMessage(destination: string, object: any): boolean {
    if (this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(object));
      return true;
    } else {
      console.error("Send before WS connection");
    }
    return false;
  }

  markMessageRead(message: ChatMessage) {
    let messageEvent = new ChatMessageEvent();
    messageEvent.messageId = message.id;
    messageEvent.type = ChatMessageEventType.READ;
    if (this.sendMessage(CommunicatorService.MESSAGES_EVENT_DESTINATION, messageEvent)) {
      this.messageReadSubject.next(message);
    } else {
      console.error('Error sending message read event');
    }
  }

  getMessagesWith(page: Page, recipientId?: number): Observable<any> {
    return this.http.get<ChatMessage[]>(environment.communicatorUrl + this.chatEndpoint + '/messages/' + (recipientId ? recipientId : '') + '?' + page.generateQueryParams());
  }

  getChatHistory(page: Page): Observable<any> {
    return this.http.get<ChatMessage[]>(environment.communicatorUrl + this.chatEndpoint + '/history?' + page.generateQueryParams());
  }

  private addSubscription(destination: string, callback: (message: Message) => any) {
    if (this.connected) {
      this.stompClient.subscribe(destination, callback);
    } else {
      console.error("Subscription before WS connection");
    }
  }
}
