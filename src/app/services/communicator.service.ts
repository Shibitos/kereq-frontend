import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import {Client, Message} from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from "./auth.service";
import {User} from "../models/user.model";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Page} from "../utils/page";
import {Friendship} from "../models/friendship.model";
import {HttpClient} from "@angular/common/http";
import {ChatMessage} from "../models/chat-message.model";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {

  connectedSubject: Subject<void> = new Subject<void>();
  unsubscribe$: Subject<void> = new Subject<void>();

  private subscribedDestinations: string[] = [];
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

  isConnected() {
    return this.connected;
  }

  onConnection(callback: () => void) {
    this.connectedSubject.subscribe(() => {
      if (this.connected) {
        callback();
      }
    })
  }

  connect() {
    if (!this.connected && this.authService.isLoggedIn) {
      let socket = new SockJS(environment.communicatorUrl + this.websocketEndpoint);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({ 'Authorization': `Bearer ${this.authService.getToken()}` }, () => {
        this.connected = true;
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
        this.subscribedDestinations = [];
      });
    }
  }

  addSubscription(destination: string, callback: (message: Message) => any) {
    if (this.connected) {
      if (this.subscribedDestinations.indexOf(destination) < 0) {
        this.stompClient.subscribe(destination, callback);
        this.subscribedDestinations.push(destination);
      }
    } else {
      console.error("Subscription before WS connection");
    }
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
}
