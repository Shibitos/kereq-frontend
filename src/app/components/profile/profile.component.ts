import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Page} from "../../tools/page";
import {Friendship} from "../../models/friendship.model";
import {Perspective} from "../../enums/perspective.enum";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  friendsLoaded: boolean = false;
  friendsList: Friendship[] = [];
  perspective: Perspective;


  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(paramsId => {
      this.clear();
      if (paramsId['id']) {
        this.perspective = Perspective.OTHER_USER;
        this.userService.getUser(paramsId['id']).subscribe(u => {
          this.user = u;
          this.loadFull();
        });
      } else {
        this.perspective = Perspective.OWNER;
        this.authService.currentUser.subscribe(u => {
          this.user = u;
          this.loadFull();
        });
      }
    });
  }

  ngOnInit(): void {
  }

  loadFull(): void {
    this.userService.getFriends(new Page(8), this.user.id).subscribe(a => {
      if (!a.empty) {
        this.friendsList.push(...a.content);
      }
      this.friendsLoaded = true;
    },
      () => {
      this.friendsLoaded = true;
      });
  }

  clear(): void {
    this.friendsList = [];
    this.friendsLoaded = false;
  }

  isOwner(): boolean {
    return this.perspective == Perspective.OWNER;
  }

}
