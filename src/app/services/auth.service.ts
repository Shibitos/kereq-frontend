import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<User>(new User());
    this.currentUser = this.currentUserSubject.asObservable();
  }

  login(user: User) {
    this.http.post(environment.baseUrl + 'auth/login', user).subscribe((res: any) => {
      localStorage.setItem('access_token', res.access_token);
      this.getCurrentUser().subscribe((user: User) => {
        this.currentUserSubject.next(user);
        this.router.navigate(['/']);
      });
    });
  }

  checkToken() {
    if (this.getToken() !== null) {
      this.getCurrentUser().subscribe((user: User) => {
        this.currentUserSubject.next(user);
      }, () => {});
    }
  }

  register(user: User): Observable<any> {
    return this.http.post(environment.baseUrl + 'auth/register', user);
  }

  confirmUser(token: string): Observable<any> {
    return this.http.post(environment.baseUrl + 'auth/confirm', { token: token });
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(environment.baseUrl + 'profile/me');
  }

  logout() {
    localStorage.removeItem('access_token');
    this.currentUserSubject.next(new User());
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem('access_token');
    return authToken !== null;
  }
}
