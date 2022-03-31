import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class ChatWindowEventService {

  private openWindowSubject: Subject<User> = new Subject<User>();
  private closeWindowSubject: Subject<number> = new Subject<number>();

  constructor() { }

  openWindow(recipient: User) {
    this.openWindowSubject.next(recipient);
  }

  closeWindow(recipientId: number) {
    this.closeWindowSubject.next(recipientId);
  }

  getOpenWindowSubject() {
    return this.openWindowSubject;
  }

  getCloseWindowSubject() {
    return this.closeWindowSubject;
  }
}
