import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";

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
}
