import {Injectable} from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {FindFriendsAd} from "../models/find-friends-ad.model";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {Page} from "../utils/page";

@Injectable({
  providedIn: 'root'
})
export class FindFriendsService {

  ffUrl: string = 'find-friends/';

  constructor(private http: HttpClient, private router: Router) {
  }

  getMyAd(): Observable<FindFriendsAd> {
    return this.http.get<FindFriendsAd>(environment.backendUrl + this.ffUrl);
  }

  addAd(ad: FindFriendsAd): Observable<any> {
    return this.http.post(environment.backendUrl + this.ffUrl, ad);
  }

  modifyAd(ad: FindFriendsAd): Observable<any> {
    return this.http.put(environment.backendUrl + this.ffUrl, ad);
  }

  removeAd(): Observable<any> {
    return this.http.delete(environment.backendUrl + this.ffUrl);
  }

  browseAds(page: Page): Observable<any> {
    return this.http.get<FindFriendsAd>(environment.backendUrl + this.ffUrl + 'browse?' + page.generateQueryParams());
  }
}
