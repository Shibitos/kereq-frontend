import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: User;

  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              private activatedRoute: ActivatedRoute) {
    this.activatedRoute.params.subscribe(paramsId => {
      if (paramsId['id']) {
        this.userService.getUser(paramsId['id']).subscribe(u => this.user = u);
      } else {
        this.authService.currentUser.subscribe(u => this.user = u);
      }
    });
    this.authService.currentUser.subscribe(u => this.user = u);
  }

  ngOnInit(): void {
  }

}
