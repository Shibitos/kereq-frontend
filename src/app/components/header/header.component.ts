import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {User} from "../../models/user.model";
import {PhotoService} from "../../services/photo.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {

  loggedUser: User;
  isToggleSearchBar: boolean = false;

  constructor(private router: Router, private authService: AuthService, public photoService: PhotoService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
  }

  toggleSearchBar() {
    this.isToggleSearchBar = !this.isToggleSearchBar;
  }
}
