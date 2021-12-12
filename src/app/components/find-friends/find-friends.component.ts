import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FindFriendsAd} from "../../models/find-friends-ad.model";
import {FindFriendsService} from "../../services/find-friends.service";
import {UserService} from "../../services/user.service";
import {PageUtil} from "../../utils/page.util";
import {Page} from "../../utils/page";

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent implements OnInit {

  loggedUser: User;
  myAd: FindFriendsAd;
  myAdLoaded: boolean = false;
  browseAdsList: FindFriendsAd[] = [];
  browseAdsPageTool: PageUtil<FindFriendsAd>;

  constructor(private router: Router,
              private authService: AuthService,
              private findFriendsService: FindFriendsService,
              private userService: UserService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
    this.findFriendsService.getMyAd().subscribe(a => {
      this.myAd = a;
      this.myAdLoaded = true;
    }, () => {
      this.myAdLoaded = true;
    });
    this.browseAdsPageTool = new PageUtil<FindFriendsAd>(this.findFriendsService.browseAds.bind(this.findFriendsService), this.browseAdsList);
  }

  hide(index: number): void {
    this.browseAdsList.splice(index, 1); //TODO: store hidden userIds in localStorage?
  }

  invite(index: number): void {
    let ad = this.browseAdsList[index];
    if (ad.user.id) {
      this.userService.inviteFriend(ad.user.id).subscribe(a => {
        this.hide(index);
      }, error => {

      });
    }
  }
}
