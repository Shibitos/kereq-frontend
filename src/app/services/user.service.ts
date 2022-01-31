import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {Friendship} from "../models/friendship.model";
import {Page} from "../utils/page";
import {User} from "../models/user.model";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  friendsUrl: string = 'friends/';

  constructor(private http: HttpClient, private router: Router) {
  }

  inviteFriend(userId: number): Observable<any> {
    return this.http.post(environment.baseUrl + this.friendsUrl + 'invitations/' + userId, null);
  }

  getFriends(page: Page, userId?: number): Observable<any> {
    return this.http.get<Friendship[]>(environment.baseUrl + this.friendsUrl + (userId ? userId : '') + '?' + page.generateQueryParams());
  }

  getInvitations(page: Page): Observable<any> {
    return this.http.get<Friendship[]>(environment.baseUrl + this.friendsUrl + 'invitations' + '?' + page.generateQueryParams());
  }

  acceptInvitation(userId: number): Observable<any> {
    return this.http.post(environment.baseUrl + this.friendsUrl + 'accept/' + userId, null);
  }

  rejectInvitation(userId: number): Observable<any> {
    return this.http.post(environment.baseUrl + this.friendsUrl + 'reject/' + userId, null);
  }

  removeFriend(userId: number): Observable<any> {
    return this.http.delete(environment.baseUrl + this.friendsUrl + userId);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(environment.baseUrl + 'profile/' + userId);
  }

  modifyUser(user: User): Observable<any> {
    return this.http.patch(environment.baseUrl + 'profile', user);
  }

  modifyUserBiography(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + 'profile/biography', user);
  }

  uploadProfileImage(image: File, croppedSize: number, croppedPosX: number, croppedPosY: number): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', image);
    formData.append('size', croppedSize.toString());
    formData.append('posX', croppedPosX.toString());
    formData.append('posY', croppedPosY.toString());

    return this.http.post(environment.baseUrl + 'profile/image', formData, {
      reportProgress: true,
      responseType: 'json'
    });
  }
}
