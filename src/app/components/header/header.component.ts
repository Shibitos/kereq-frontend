import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  loggedUser: User;
  isToggleSearchBar: boolean = false;

  constructor(private router: Router, private authService: AuthService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
  }

  toggleSearchBar() {
    this.isToggleSearchBar = !this.isToggleSearchBar;
  }
}
