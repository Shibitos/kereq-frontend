import {Component, OnInit} from '@angular/core';
import {User} from "../../models/user.model";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  loggedUser: User;

  constructor(private authService: AuthService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  ngOnInit(): void {
  }

}
