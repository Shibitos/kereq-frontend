import {Component, OnInit} from '@angular/core';
import {CommunicatorService} from "../../services/communicator.service";
import {PageUtil} from "../../utils/page.util";
import {Subject} from "rxjs";
import {Friendship} from "../../models/friendship.model";
import {UserService} from "../../services/user.service";
import {Message} from "stompjs";
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";
import {ConnectionEvent} from "../../models/connection-event.model";
import {takeUntil} from "rxjs/operators";
import {ConnectionType} from "../../enums/connection-type.enum";
import {ChatWindowEventService} from "../../services/chat-window-event.service";

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.scss']
})
export class ChatbarComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  loggedUser: User;

  friendsList: Friendship[] = [];
  friendsPageTool: PageUtil<Friendship>;

  constructor(private communicatorService: CommunicatorService,
              private userService: UserService,
              private authService: AuthService,
              private chatWindowEventService: ChatWindowEventService) { }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => {
      if (u.id) {
        this.loggedUser = u;
        this.communicatorService.onConnection(() => {
            this.communicatorService.addSubscription('/user/queue/connections', this.onConnectionEvent.bind(this));
        });
      }
    });
    this.friendsPageTool = new PageUtil<Friendship>(this.userService.getFriendsOnlineFirst.bind(this.userService), this.friendsList, 30);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.destroyPageTool();
  }

  destroyPageTool() {
    if (this.friendsPageTool) {
      this.friendsPageTool.destroy();
    }
  }

  onConnectionEvent(message: Message) {
    let connectionEvent: ConnectionEvent = JSON.parse(message.body);
    if (connectionEvent.type == ConnectionType.CONNECTED) {
      this.markOnline(connectionEvent.userId);
    } else if (connectionEvent.type == ConnectionType.DISCONNECTED) {
      this.markOffline(connectionEvent.userId);
    } else if (connectionEvent.type == ConnectionType.REMOVAL) {
      this.remove(connectionEvent.userId);
    } else {
      console.error("Unknown connection type");
    }
  }

  markOnline(userId: number) {
    let friendshipIndex = this.friendsList.findIndex(friendship => friendship.friend.id === userId);
    if (friendshipIndex > -1 && !this.friendsList[friendshipIndex].friend.online) {
      let splice = this.friendsList.splice(friendshipIndex, 1);
      splice[0].friend.online = true;
      this.friendsList.unshift(splice[0]);
    } else {
      this.userService.getFriendship(userId).pipe(takeUntil(this.unsubscribe$)).subscribe(friendship => {
        this.friendsList.unshift(friendship);
      });
    }
  }

  markOffline(userId: number) {
    let friendshipIndex = this.friendsList.findIndex(friendship => friendship.friend.id === userId);
    if (friendshipIndex > -1 && this.friendsList[friendshipIndex].friend.online) {
      let firstOfflineIndex = this.friendsList.findIndex(friendship => !friendship.friend.online);
      this.friendsList[friendshipIndex].friend.online = false;
      if (firstOfflineIndex > friendshipIndex) {
        let element = this.friendsList[friendshipIndex];
        this.friendsList.splice(friendshipIndex, 1);
        this.friendsList.splice(firstOfflineIndex, 0, element);
      }
    }
  }

  remove(userId: number) {
    let friendshipIndex = this.friendsList.findIndex(friendship => friendship.friend.id === userId);
    if (friendshipIndex > -1) {
        this.friendsList.splice(friendshipIndex, 1);
    }
  }

  openChatWindow(friend: User) {
    this.chatWindowEventService.openWindow(friend);
  }
}
