import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm: FormGroup; //TODO: validation, captcha

  constructor(
    public fb: FormBuilder,
    public authService: AuthService,
    public router: Router
  ) {
    this.registerForm = this.fb.group({
      login: [''],
      email: [''],
      firstName: [''],
      lastName: [''],
      password: ['']
    })
  }

  ngOnInit() { }

  registerUser() {
    this.authService.register(this.registerForm.value).subscribe((res: any) => { //TODO: error handling
      if (res) {
        this.registerForm.reset();
        this.router.navigate(['']);
      }
    })
  }
}
