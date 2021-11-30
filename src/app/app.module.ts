import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {HomeComponent} from './components/home/home.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LogoutComponent} from './components/logout/logout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JWTInterceptor} from "./interceptors/jwt-interceptor.service";
import {ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {WallComponent} from './components/wall/wall.component';
import {MenuComponent} from './components/menu/menu.component';
import { AccountConfirmationComponent } from './components/account-confirmation/account-confirmation.component';
import { FindFriendsComponent } from './components/find-friends/find-friends.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {InfiniteScrollModule} from "ngx-infinite-scroll";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    HomeComponent,
    ProfileComponent,
    LogoutComponent,
    HeaderComponent,
    WallComponent,
    MenuComponent,
    AccountConfirmationComponent,
    FindFriendsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InfiniteScrollModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
