import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup; //TODO: validation, captcha
  success: boolean = false;

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.registrationForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      country: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.success = false;
  }

  registerUser() {
    this.authService.register(this.registrationForm.value).pipe(first())
      .subscribe(
        data => {
          this.registrationForm.reset();
          this.success = true;
        },
        error => {
        });
  }
}
