import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {JWTToken} from "../models/jwt-token.model";
import {tap} from "rxjs/operators";
import {JWTInterceptor} from "../interceptors/jwt-interceptor.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;
  public currentUserObject: User;

  static readonly TOKEN_NAME: string = 'access_token';
  static readonly REFRESH_TOKEN_NAME: string = 'refresh_token';

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(user: User): Observable<JWTToken> {
    return this.http.post<JWTToken>(environment.backendUrl + 'auth/login', user).pipe(tap((res: JWTToken) => {
      localStorage.setItem(AuthService.TOKEN_NAME, res.access_token);
      localStorage.setItem(AuthService.REFRESH_TOKEN_NAME, res.refresh_token);
      this.getCurrentUser().subscribe((user: User) => {
        this.currentUserSubject.next(user);
        this.currentUserObject = user;
        this.router.navigate(['/']);
      });
    }));
  }

  refreshToken(): Observable<JWTToken> {
    const request = { 'refreshToken': this.getRefreshToken() };
    let headers = new HttpHeaders().append(JWTInterceptor.HEADER_SKIP_AUTH, "1");
    return this.http.post<JWTToken>(environment.backendUrl + 'auth/refresh-token', request, {headers}).pipe(tap((response: JWTToken) => {
      this.saveTokens(response.access_token, response.refresh_token);
    }));
  }

  refreshUser(user: User) {
    this.currentUserSubject.next(user);
  }

  checkToken() {
    if (this.getToken() !== null) {
      this.getCurrentUser().subscribe((user: User) => {
        this.currentUserSubject.next(user);
        this.currentUserObject = user;
      }, () => {});
    }
  }

  register(user: User): Observable<any> {
    return this.http.post(environment.backendUrl + 'auth/register', user);
  }

  confirmUser(token: string): Observable<any> {
    return this.http.post(environment.backendUrl + 'auth/confirm', { token: token });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(environment.backendUrl + 'profile');
  }

  logout() {
    localStorage.removeItem(AuthService.TOKEN_NAME);
    localStorage.removeItem(AuthService.REFRESH_TOKEN_NAME);
    this.currentUserSubject.next(new User());
  }

  getToken() {
    return localStorage.getItem(AuthService.TOKEN_NAME);
  }

  getRefreshToken() {
    return localStorage.getItem(AuthService.REFRESH_TOKEN_NAME);
  }

  saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(AuthService.TOKEN_NAME, accessToken);
    localStorage.setItem(AuthService.REFRESH_TOKEN_NAME, refreshToken);
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem(AuthService.TOKEN_NAME);
    return authToken !== null;
  }
}
