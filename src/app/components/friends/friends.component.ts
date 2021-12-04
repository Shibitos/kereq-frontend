import { Component, OnInit } from '@angular/core';
import {PageTool} from "../../tools/page.tool";
import {Friendship} from "../../models/friendship.model";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  friendsList: Friendship[] = [];
  friendsPageTool: PageTool<Friendship>;

  invitationsList: Friendship[] = [];
  invitationsPageTool: PageTool<Friendship>;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.friendsPageTool = new PageTool<Friendship>(this.userService.getFriends.bind(this.userService), this.friendsList, 8);
    this.invitationsPageTool = new PageTool<Friendship>(this.userService.getInvitations.bind(this.userService), this.invitationsList, 4);
  }

  acceptInvitation(index: number): void {
    let invitation = this.invitationsList[index];
    if (invitation.user.id) {
      this.userService.acceptInvitation(invitation.user.id).subscribe(a => {
        this.hideInvitation(index);
      }, error => {

      });
    }
  }

  rejectInvitation(index: number): void {
    let invitation = this.invitationsList[index];
    if (invitation.user.id) {
      this.userService.rejectInvitation(invitation.user.id).subscribe(a => {
        this.hideInvitation(index);
      }, error => {

      });
    }
  }

  hideInvitation(index: number): void {
    this.invitationsList.splice(index, 1);
  }

  removeFriend(index: number): void {
    let friend = this.friendsList[index];
    if (friend.friend.id) {
      this.userService.removeFriend(friend.friend.id).subscribe(a => {
        this.hideFriend(index);
      }, error => {

      });
    }
  }

  hideFriend(index: number): void {
    this.friendsList.splice(index, 1);
  }
}
