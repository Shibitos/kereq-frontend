import { Component, OnInit } from '@angular/core';
import {filter, first, takeUntil} from "rxjs/operators";
import {User} from "../../models/user.model";
import {BehaviorSubject, Subject} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {PostService} from "../../services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {FormProperties} from "../../utils/form-properties";
import {FormBuilder, Validators} from "@angular/forms";
import MatchValidator from "../../utils/matchValidator";
import {DictionaryItem} from "../../models/dictionary-item.model";
import {DictionaryService} from "../../services/dictionary.service";
import {Gender} from "../../enums/gender.enum";

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent implements OnInit {

  private currentUserSubject: BehaviorSubject<User> = new BehaviorSubject<User>(new User());
  unsubscribe$: Subject<void> = new Subject<void>();

  user: User;
  userLoaded: boolean = false;
  componentLoaded: boolean = false;
  modifyMode: boolean = false;

  countries: DictionaryItem[];
  COUNTRIES_DICT_CODE: string = 'COUNTRIES'; //TODO: load once
  readonly genders : typeof Gender = Gender;

  userForm: FormProperties = new FormProperties();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private dictionaryService: DictionaryService,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.userForm.form = this.formBuilder.group({
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
        country: ['', Validators.required]
      });
    this.dictionaryService.getDictionaryValues(this.COUNTRIES_DICT_CODE).pipe(takeUntil(this.unsubscribe$)).subscribe((items: DictionaryItem[]) => {
      this.countries = items;
      this.componentLoaded = true;
    });

    this.currentUserSubject.pipe(
      filter((user: any) => user.id),
      takeUntil(this.unsubscribe$)
    ).subscribe((user: User) => {
      this.activatedRoute.params.pipe(takeUntil(this.unsubscribe$)).subscribe(params => {
        if (!params['id'] || params['id'] != user.id) {
          this.router.navigate(['/']);
        }
        this.user = user;
        this.userForm.form.patchValue(user);
        this.userLoaded = true;
      });
    });
    this.authService.currentUser.pipe(takeUntil(this.unsubscribe$)).subscribe((user: User) => {
      this.currentUserSubject.next(user);
    });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  get f() {
    return this.userForm.form.controls;
  }

  onSubmit() {
    if (this.userForm.onSubmit()) {
      this.editUser();
    }
  }

  modifyModeOn() {
    this.modifyMode = true;
  }

  editUser() {
    let modified = Object.assign(this.user, this.userForm.form.value);
    this.userService.modifyUser(modified).pipe(takeUntil(this.unsubscribe$), first())
      .subscribe(
        (modifiedUser: User) => {
          this.userForm.onFinish();
          this.authService.refreshUser(modifiedUser);
          this.modifyMode = false;
        },
        errorData => {
          this.userForm.onError(errorData);
        });
  }
}
