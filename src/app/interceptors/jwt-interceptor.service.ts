import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {catchError, filter, switchMap, take} from "rxjs/operators";
import {BehaviorSubject, Observable, throwError} from "rxjs";
import {Router} from "@angular/router";
import {JWTToken} from "../models/jwt-token.model";

@Injectable()
export class JWTInterceptor implements HttpInterceptor {

  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isRefreshing: boolean = false;
  static readonly HEADER_SKIP_AUTH: string = "X-skip-auth";

  constructor(private router: Router, private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
    let authToken = this.authService.getToken();
    if (authToken && req.headers.get(JWTInterceptor.HEADER_SKIP_AUTH) != '1') {
      req = JWTInterceptor.addToken(req, authToken);
    }
    return next.handle(req).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === HttpStatusCode.Unauthorized) {
        return this.handle401Error(req, next);
      }
      return throwError(error);
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshToken().pipe(
        switchMap((response: JWTToken) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(response.access_token);
          return next.handle(JWTInterceptor.addToken(request, response.access_token));
        }),
        catchError((err) => {
          this.logout();
          return throwError(err);
        }));

    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(JWTInterceptor.addToken(request, jwt));
        }));
    }
  }

  private static addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private logout() {
    this.authService.logout();
    this.router.navigate(['login']);
    this.isRefreshing = false;
  }

  // private static isTokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }
}
