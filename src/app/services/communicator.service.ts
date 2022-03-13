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

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {

  connectedSubject: Subject<void> = new Subject<void>();
  chatBarInitialized: Subject<void> = new Subject<void>();
  connectionsSubject: Subject<ConnectionEvent> = new Subject<ConnectionEvent>();
  messagesSubject: Subject<ChatMessage> = new Subject<ChatMessage>();
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
    this.addSubscription('/user/queue/connections', this.onConnectionEvent.bind(this));
    this.addSubscription('/user/queue/messages-inbox', this.onMessage.bind(this));
  }

  onMessage(message: Message) {
    let chatMessage: ChatMessage = JSON.parse(message.body);
    this.messagesSubject.next(chatMessage);
  }

  sendMessage(destination: string, object: any) {
    if (this.connected) {
      this.stompClient.send(destination, {}, JSON.stringify(object));
    } else {
      console.error("Send before WS connection");
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
