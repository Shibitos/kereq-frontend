import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {first, takeUntil} from "rxjs/operators";
import MatchValidator from "../../utils/matchValidator";
import {NgxFormErrorConfig} from "ngx-form-error";
import {DictionaryService} from "../../services/dictionary.service";
import {DictionaryItem} from "../../models/dictionary-item.model";
import {Gender} from "../../enums/gender.enum";
import {Subject} from "rxjs";
import {FormProperties} from "../../utils/form-properties";

@Component({
  selector: 'app-register',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  unsubscribe$: Subject<void> = new Subject<void>();

  registrationForm: FormProperties = new FormProperties(); //TODO: captcha
  componentLoaded: boolean = false;

  countries: DictionaryItem[];
  COUNTRIES_DICT_CODE: string = 'COUNTRIES'; //TODO: load once
  readonly genders : typeof Gender = Gender;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private dictionaryService: DictionaryService,
    errorFormConfig: NgxFormErrorConfig
  ) {
    errorFormConfig.updateMessages({
      matching: () => $localize`:@@user.form.password-match:Passwords must match.`,
      customError: (context) => context
    });
  }

  ngOnInit() {
    this.dictionaryService.getDictionaryValues(this.COUNTRIES_DICT_CODE).pipe(takeUntil(this.unsubscribe$)).subscribe((items: DictionaryItem[]) => {
      this.countries = items;
      this.componentLoaded = true;
    });
    this.registrationForm.form = this.formBuilder.group({
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
        gender: ['M', [
          Validators.required,
          Validators.maxLength(1)
        ]],
        birthDate: ['', Validators.required],
        acceptedTerms: [false, Validators.requiredTrue]
      },
      {
        validators: [MatchValidator.match('password', 'confirmPassword')]
      });
  }

  ngOnDestroy(){
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get f() {
    return this.registrationForm.form.controls;
  }

  onSubmit() {
    if (this.registrationForm.onSubmit()) {
      this.registerUser();
    }
  }

  registerUser() {
    this.authService.register(this.registrationForm.form.value).pipe(takeUntil(this.unsubscribe$), first())
      .subscribe(
        data => {
          this.registrationForm.onFinish();
        },
        errorData => {
          this.registrationForm.onError(errorData);
        });
  }
}
