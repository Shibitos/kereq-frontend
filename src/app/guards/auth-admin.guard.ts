import {Observable} from "rxjs";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from "@angular/router";
import {AuthService} from "../services/auth.service";
import {Injectable} from "@angular/core";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class AuthAdminGuard implements CanActivate { //TODO: test

  loggedUser: User;

  constructor(public authService: AuthService, public router: Router) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (!this.authService.isLoggedIn || this.loggedUser.roles.findIndex(role => role.code === "ROLE_ADMIN") === -1) {
      this.router.navigate(['/'])
    }
    return true;
  }
}
