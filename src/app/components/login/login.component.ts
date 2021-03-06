import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  loginForm: FormGroup;
  error: string;
  loading: boolean = false;
  submitted: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    });
  }

  ngOnInit() { }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.loginUser();
  }

  loginUser() {
    this.authService.login(this.loginForm.value).pipe(takeUntil(this.unsubscribe$)).subscribe(() => {}, this.handleError.bind(this)); //TODO: remember me?
  }

  handleError(errorData: any) : void {
    this.error = $localize`:@@user.login-failed:Incorrect email or password`;
    this.loading = false;
  }
}
