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
    return this.http.post(environment.baseUrl + this.friendsUrl + 'invite/' + userId, null);
  }

  getFriends(page: Page, userId?: number): Observable<any> {
    return this.http.get<Friendship[]>(environment.baseUrl + this.friendsUrl + 'friends' + (userId ? ('/' + userId) : '') + '?p=' + page.pageNumber + '&l=' + page.pageSize);
  }

  getInvitations(page: Page): Observable<any> {
    return this.http.get<Friendship[]>(environment.baseUrl + this.friendsUrl + 'invitations' + '?p=' + page.pageNumber + '&l=' + page.pageSize);
  }

  acceptInvitation(userId: number): Observable<any> {
    return this.http.post(environment.baseUrl + this.friendsUrl + 'accept/' + userId, null);
  }

  rejectInvitation(userId: number): Observable<any> {
    return this.http.post(environment.baseUrl + this.friendsUrl + 'reject/' + userId, null);
  }

  removeFriend(userId: number): Observable<any> {
    return this.http.delete(environment.baseUrl + this.friendsUrl + 'friend/' + userId);
  }

  getUser(userId: number): Observable<User> {
    return this.http.get<User>(environment.baseUrl + 'profile/' + userId);
  }
}
