import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {Page} from "../../utils/page";
import {Friendship} from "../../models/friendship.model";
import {Perspective} from "../../enums/perspective.enum";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;
  userLoaded: boolean = false;
  friendsList: Friendship[] = [];
  friendsLoaded: boolean = false;
  perspective: Perspective;


  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(params => {
      this.clear();
      if (params['id']) {
        this.perspective = Perspective.OTHER_USER;
        this.userService.getUser(params['id']).subscribe(u => {
          this.user = u;
          this.userLoaded = true;
          this.loadFull();
        }).add(() => {
          this.authService.currentUser.subscribe(u => {
            if (u.id == this.user.id) {
              this.perspective = Perspective.OWNER; //TODO: refactor
            }
          });
        });
      } else {
        this.perspective = Perspective.OWNER;
        this.authService.currentUser.subscribe(u => {
          if (!this.userLoaded && u.id) {
            this.user = u;
            this.userLoaded = true;
            this.loadFull();
          }
        });
      }
    });
  }

  ngOnInit(): void {

    if (this.user.id == this.authService.currentUserObject.id) this.perspective = Perspective.OWNER;
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
    this.userLoaded = false;
    this.friendsList = [];
    this.friendsLoaded = false;
  }

  isOwner(): boolean {
    return this.perspective == Perspective.OWNER;
  }

}
