import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FindFriendsAd} from "../../models/find-friends-ad.model";
import {FindFriendsService} from "../../services/find-friends.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent implements OnInit {

  loggedUser: User;
  myAd: FindFriendsAd;
  myAdLoaded: boolean = false;
  browseAdsList: FindFriendsAd[];
  browseAdsLoaded: boolean = false;
  throttle = 0;
  distance = 2;
  page = 0;
  stopLoading = false;

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
    }, error => {
      this.myAdLoaded = true;
    });
    this.findFriendsService.browseAds(this.page).subscribe(a => {
      if (!a.empty) {
        this.browseAdsList = a.content;
      } else {
        this.stopLoading = true;
      }
      this.browseAdsLoaded = true;
    });
  }

  onScroll(): void {
    if (!this.stopLoading) {
      this.findFriendsService.browseAds(++this.page).subscribe(a => {
        if (a.empty) {
          this.stopLoading = true;
        } else {
          this.browseAdsList.push(...a.content);
        }
      });
    }
  }

  hide(index: number): void {
    this.browseAdsList.splice(index, 1); //TODO: store hidden userIds in localStorage?
  }

  invite(index: number): void {
    let ad = this.browseAdsList[index];
    if (ad.user.id) {
      this.userService.inviteFriend(Number(ad.user.id)).subscribe(a => {
        this.hide(index);
      }, error => {

      });
    }
  }
}
