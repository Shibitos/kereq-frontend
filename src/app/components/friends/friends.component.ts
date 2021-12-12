import {Component, OnInit} from '@angular/core';
import {PageUtil} from "../../utils/page.util";
import {Friendship} from "../../models/friendship.model";
import {UserService} from "../../services/user.service";
import {Perspective} from "../../enums/perspective.enum";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit {

  perspective: Perspective;
  userId?: number;

  friendsList: Friendship[] = [];
  friendsPageTool: PageUtil<Friendship>;

  invitationsList: Friendship[] = [];
  invitationsPageTool: PageUtil<Friendship>;

  constructor(private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.clear();
      if (params['id']) {
        this.userId = params['id'];
        this.perspective = Perspective.OTHER_USER;
      } else {
        this.perspective = Perspective.OWNER;
      }
    });
  }

  clear(): void {
    this.userId = undefined;
    this.friendsList = [];
    this.invitationsList = [];
  }

  isOwner(): boolean {
    return this.perspective == Perspective.OWNER;
  }

  ngOnInit(): void {
    this.friendsPageTool = new PageUtil<Friendship>(this.userService.getFriends.bind(this.userService), this.friendsList, this.userId, 8);
    this.invitationsPageTool = new PageUtil<Friendship>(this.userService.getInvitations.bind(this.userService), this.invitationsList, this.userId,4);
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
