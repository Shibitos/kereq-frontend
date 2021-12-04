import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RegistrationComponent} from "./components/registration/registration.component";
import {LogoutComponent} from "./components/logout/logout.component";
import {WallComponent} from "./components/wall/wall.component";
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./guards/auth.guard";
import {NoAuthGuard} from "./guards/noauth.guard";
import {ProfileComponent} from "./components/profile/profile.component";
import {AccountConfirmationComponent} from "./components/account-confirmation/account-confirmation.component";
import {FindFriendsComponent} from "./components/find-friends/find-friends.component";
import {FriendsComponent} from "./components/friends/friends.component";

const routes: Routes = [
  { path: '', component: WallComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'profile/:id', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [NoAuthGuard] },
  { path: 'register', component: RegistrationComponent, canActivate: [NoAuthGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: 'confirm-account', component: AccountConfirmationComponent, canActivate: [NoAuthGuard] },
  { path: 'find-friends', component: FindFriendsComponent, canActivate: [AuthGuard] },
  { path: 'friends', component: FriendsComponent, canActivate: [AuthGuard] },
  // { path: 'wall', component: WallComponent },
  //{ path: 'account', component: AccountComponent, canActivate: [AuthGuardLogin] },
  //{ path: 'admin', component: AdminComponent, canActivate: [AuthGuardAdmin] },
  { path: '**', redirectTo: 'login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
