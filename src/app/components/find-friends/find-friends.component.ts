import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FindFriendsAd} from "../../models/find-friends-ad.model";
import {FindFriendsService} from "../../services/find-friends.service";
import {UserService} from "../../services/user.service";
import {PageUtil} from "../../utils/page.util";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import MatchValidator from "../../utils/matchValidator";
import {Gender} from "../../enums/gender.enum";
import {first} from "rxjs/operators";
import {HttpStatusCode} from "@angular/common/http";
import {ModalConfig} from "../modal/modal.config";
import {ModalComponent} from "../modal/modal.component";

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent implements OnInit {

  loggedUser: User;
  myAd?: FindFriendsAd;
  myAdLoaded: boolean = false;

  @ViewChild('removeModal')
  private removeModal: ModalComponent;
  removeModalConfig: ModalConfig = new ModalConfig();

  browseAdsList: FindFriendsAd[] = [];
  browseAdsPageTool: PageUtil<FindFriendsAd>;

  adForm: FormGroup;
  loading: boolean = false;
  submitted: boolean = false;
  success: boolean = false;
  ageAny: boolean = true;
  error: string; //TODO: ng bootstrap alerts?
  readonly genders : typeof Gender = Gender;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private findFriendsService: FindFriendsService,
              private userService: UserService) {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
    this.removeModalConfig.modalTitle = $localize`:@@find-friends.remove-ad-confirm:Confirm poster removal`;
    this.removeModalConfig.confirmButtonLabel = $localize`:@@common.confirm:Confirm`;
    this.removeModalConfig.closeButtonLabel = $localize`:@@common.close:Close`;
    this.removeModalConfig.onConfirm = this.removeMyAd.bind(this);
  }

  ngOnInit(): void {
    this.adForm = this.formBuilder.group({
        minAge: ['', [
          Validators.maxLength(3)
        ]],
        maxAge: ['', [
          Validators.maxLength(3)
        ]],
        gender: [null, [
          Validators.maxLength(1)
        ]],
        description: ['', [
          Validators.required,
          Validators.minLength(15),
          Validators.maxLength(400)
        ]]
      });
    this.retrieveMyAd();
    this.browseAdsPageTool = new PageUtil<FindFriendsAd>(this.findFriendsService.browseAds.bind(this.findFriendsService), this.browseAdsList);
  }

  retrieveMyAd(): void {
    this.myAdLoaded = false;
    this.findFriendsService.getMyAd().subscribe(a => {
      this.myAd = a;
      this.myAdLoaded = true;
    }, () => {
      this.myAdLoaded = true;
    });
  }

  async removeMyAdModal() {
    return await this.removeModal.open();
  }

  removeMyAd(): void {
    this.findFriendsService.removeAd().subscribe(r => {
      this.myAd = undefined;
    }, (errorData) => {
      this.error = $localize`:@@common.unknown-error:Unknown error`;
    });
  }

  hide(index: number): void {
    this.browseAdsList.splice(index, 1); //TODO: store hidden userIds in localStorage?
  }

  invite(index: number): void {
    let ad = this.browseAdsList[index];
    if (ad.user.id) {
      this.userService.inviteFriend(ad.user.id).subscribe(a => {
        this.hide(index);
      }, error => {
        //TODO: handle
      });
    }
  }

  get f() {
    return this.adForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.adForm.markAllAsTouched();
    if (this.adForm.invalid) {
      return;
    }
    this.loading = true;
    this.addAd();
  }

  switchAgeAny(): void {
    this.ageAny = !this.ageAny;
    if (this.ageAny) {
      this.adForm.controls['minAge'].setValue(null);
      this.adForm.controls['maxAge'].setValue(null);
    } else {

    }
  }

  onAgeChange(selectedValues: number[]): void {
    if (!this.ageAny) {
      this.adForm.controls['minAge'].setValue(selectedValues[0]);
      this.adForm.controls['maxAge'].setValue(selectedValues[1]);
    }
  }

  addAd() {
    this.findFriendsService.addAd(this.adForm.value).pipe(first())
      .subscribe(
        data => {
          this.success = true;
          this.loading = false;
          this.retrieveMyAd();
        },
        errorData => {
          this.loading = false;
          this.handleError(errorData);
        });
  }

  handleError(errorData: any) : void {
    if (errorData.status == HttpStatusCode.BadRequest) {
      if (errorData.error['data']) {
        for (let entry in errorData.error['data']) {
          let field = errorData.error['data'][entry]['field'];
          let control = this.adForm.controls[field];
          if (control) {
            let customError = { customError: errorData.error['data'][entry]['messages'][0] };
            control.setErrors(customError); //TODO: refactor
          }
        }
      }
    } else {
      this.error = $localize`:@@common.unknown-error:Unknown error`;
    }
  }
}
