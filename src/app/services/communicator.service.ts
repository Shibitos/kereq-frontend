import {Injectable} from '@angular/core';
import * as Stomp from 'stompjs';
import {Client} from 'stompjs';
import * as SockJS from 'sockjs-client';
import {AuthService} from "./auth.service";
import {User} from "../models/user.model";
import {takeUntil} from "rxjs/operators";
import {Subject} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommunicatorService {

  unsubscribe$: Subject<void> = new Subject<void>();

  private connected: boolean = false;
  private stompClient: Client;
  private retryCounter: number = 0;
  private maxRetryCount: number = 3;
  private retryDelay: number = 2000;

  private websocketEndpoint: string = 'websocket-service/ws';

  constructor(private authService: AuthService) {
    this.authService.currentUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
      if (!user.id) {
        this.disconnect();
      } else {
        this.connect();
      }
    });
  }

  ngOnDestroy(){
    console.log("test");
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  connect() {
    if (!this.connected && this.authService.isLoggedIn) {
      var socket = new SockJS(environment.communicatorUrl + this.websocketEndpoint);
      this.stompClient = Stomp.over(socket);
      this.stompClient.connect({ 'Authorization': `Bearer ${this.authService.getToken()}` }, () => {
        this.connected = true;
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
      });
    }
  }
}
