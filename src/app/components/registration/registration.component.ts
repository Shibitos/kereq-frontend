import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {first} from "rxjs/operators";
import MatchValidator from "../../utils/matchValidator";
import {NgxFormErrorConfig} from "ngx-form-error";
import {HttpStatusCode} from "@angular/common/http";
import {DictionaryService} from "../../services/dictionary.service";
import {DictionaryItem} from "../../models/dictionary-item.model";

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registrationForm: FormGroup; //TODO: captcha
  loading: boolean = false;
  submitted: boolean = false;
  success: boolean = false;
  error: string;
  componentLoaded: boolean = false;

  countries: DictionaryItem[];
  COUNTRIES_DICT_CODE: string = 'COUNTRIES'; //TODO: load once
  genders: string[] = ['M', 'W'];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dictionaryService: DictionaryService,
    errorFormConfig: NgxFormErrorConfig
  ) {
    errorFormConfig.updateMessages({ //TODO: form translations?
      matching: () => `Passwords must match.`,
      customError: (context) => context
    });
  }

  ngOnInit() {
    this.dictionaryService.getDictionaryValues(this.COUNTRIES_DICT_CODE).subscribe((items: DictionaryItem[]) => {
      this.countries = items;
      this.componentLoaded = true;
    });
    this.registrationForm = this.formBuilder.group({
        email: ['', [
          Validators.required,
          Validators.email,
          Validators.minLength(8),
          Validators.maxLength(50)
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(24)
        ]],
        confirmPassword: ['', Validators.required],
        firstName: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(35)
        ]],
        lastName: ['', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(40)
        ]],
        country: ['', Validators.required],
        gender: ['M', Validators.required],
        birthDate: ['', Validators.required],
        acceptedTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [MatchValidator.match('password', 'confirmPassword')]
      });
  }

  get f() {
    return this.registrationForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.registrationForm.markAllAsTouched();
    if (this.registrationForm.invalid) {
      return;
    }
    this.loading = true;
    this.registerUser();
  }

  onReset(): void {
    this.submitted = false;
    this.registrationForm.reset();
  }

  registerUser() {
    this.authService.register(this.registrationForm.value).pipe(first())
      .subscribe(
        data => {
          this.registrationForm.reset();
          this.success = true;
        },
        errorData => {
          this.loading = false;
          this.handleError(errorData);
        });
  }

  handleError(errorData: any) : void {
    if (errorData.status == HttpStatusCode.BadRequest) { //TODO: main error if other status
      if (errorData.error['data']) {
        for (let entry in errorData.error['data']) {
          let field = errorData.error['data'][entry]['field'];
          let control = this.registrationForm.controls[field];
          if (control) {
            let customError = { customError: errorData.error['data'][entry]['messages'][0] };
            control.setErrors(customError); //TODO: refactor
          }
        }
      }
    } else if (errorData.status == HttpStatusCode.Conflict) {
      this.error = $localize`:@@user.form.email-taken:Email already taken`;
    } else {
      this.error = $localize`:@@common.unknown-error:Unknown error`;
    }
  }
}
