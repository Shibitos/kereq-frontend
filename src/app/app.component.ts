import {Component} from '@angular/core';
import {AuthService} from "./services/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kereq';

  constructor(public authService: AuthService) { }

  ngOnInit() {
    this.authService.checkToken();
  }
}
