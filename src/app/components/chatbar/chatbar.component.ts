import {Component, OnInit} from '@angular/core';
import {CommunicatorService} from "../../services/communicator.service";
import {PageUtil} from "../../utils/page.util";
import {Subject} from "rxjs";
import {Friendship} from "../../models/friendship.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-chatbar',
  templateUrl: './chatbar.component.html',
  styleUrls: ['./chatbar.component.scss']
})
export class ChatbarComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  friendsOnlineList: Friendship[] = [];
  friendsOnlinePageTool: PageUtil<Friendship>;

  constructor(private communicatorService: CommunicatorService, private userService: UserService) { }

  ngOnInit(): void {
    this.friendsOnlinePageTool = new PageUtil<Friendship>(this.userService.getFriendsOnline.bind(this.userService), this.friendsOnlineList, 20);
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
    this.destroyPageTool();
  }

  destroyPageTool() {
    if (this.friendsOnlinePageTool) {
      this.friendsOnlinePageTool.destroy();
    }
  }
}
