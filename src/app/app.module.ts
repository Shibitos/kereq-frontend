import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {LoginComponent} from './components/login/login.component';
import {RegistrationComponent} from './components/registration/registration.component';
import {ProfileComponent} from './components/profile/profile.component';
import {LogoutComponent} from './components/logout/logout.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {JWTInterceptor} from "./interceptors/jwt-interceptor.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HeaderComponent} from './components/header/header.component';
import {WallComponent} from './components/wall/wall.component';
import {MenuComponent} from './components/menu/menu.component';
import {AccountConfirmationComponent} from './components/account-confirmation/account-confirmation.component';
import {FindFriendsComponent} from './components/find-friends/find-friends.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {InfiniteScrollModule} from "ngx-infinite-scroll";
import {FriendsComponent} from './components/friends/friends.component';
import {ContentLoaderModule} from "@ngneat/content-loader";
import {NgxFormErrorModule} from "ngx-form-error";
import {DlDateTimeDateModule, DlDateTimePickerModule} from "angular-bootstrap-datetimepicker";
import {LoadingComponent} from './components/loading/loading.component';
import {NpnSliderModule} from "npn-slider";
import {ModalComponent} from './components/modal/modal.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {AsyncDateFormatComponent} from './components/async-date-format/async-date-format.component';
import {PostComponent} from './components/post/post.component';
import {RangePlaceholderComponent} from './components/range-placeholder/range-placeholder.component';
import {SliderComponent} from './components/slider/slider.component';
import {ChatbarComponent} from './components/chatbar/chatbar.component';
import {CommentComponent} from './components/comment/comment.component';
import {EditProfileComponent} from './components/edit-profile/edit-profile.component';
import {EditProfileImageComponent} from './components/edit-profile-image/edit-profile-image.component';
import {ImageCropperModule} from "ngx-image-cropper";
import {AvatarComponent} from "./components/avatar/avatar.component";
import {PhotoComponent} from "./components/photo/photo.component";
import {CommunicatorService} from "./services/communicator.service";
import {ChatWindowComponent} from './components/chat-window/chat-window.component';
import {ChatWindowContainerComponent} from './components/chat-window-container/chat-window-container.component';
import {ChatMessageComponent} from './components/chat-message/chat-message.component';
import {ChatHistoryHeaderComponent} from './components/chat-history-header/chat-history-header.component';
import {FilterPipe} from './pipes/filter.pipe';
import {NotificationHeaderComponent} from './components/notification-header/notification-header.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    ProfileComponent,
    LogoutComponent,
    HeaderComponent,
    WallComponent,
    MenuComponent,
    AccountConfirmationComponent,
    FindFriendsComponent,
    FriendsComponent,
    LoadingComponent,
    ModalComponent,
    AsyncDateFormatComponent,
    PostComponent,
    RangePlaceholderComponent,
    SliderComponent,
    ChatbarComponent,
    CommentComponent,
    EditProfileComponent,
    EditProfileImageComponent,
    AvatarComponent,
    PhotoComponent,
    ChatWindowComponent,
    ChatWindowContainerComponent,
    ChatMessageComponent,
    ChatHistoryHeaderComponent,
    FilterPipe,
    NotificationHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    InfiniteScrollModule,
    ContentLoaderModule,
    NgxFormErrorModule,
    DlDateTimeDateModule, //TODO: ng bootstrap
    DlDateTimePickerModule,
    NgbModule,
    ImageCropperModule,
    FormsModule,
    NpnSliderModule //TODO: change for better
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JWTInterceptor, multi: true },
    CommunicatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
