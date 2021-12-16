import {Component, OnInit, ViewChild} from '@angular/core';
import {User} from "../../models/user.model";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {FindFriendsAd} from "../../models/find-friends-ad.model";
import {FindFriendsService} from "../../services/find-friends.service";
import {UserService} from "../../services/user.service";
import {PageUtil} from "../../utils/page.util";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Gender} from "../../enums/gender.enum";
import {first} from "rxjs/operators";
import {ModalConfig} from "../modal/modal.config";
import {ModalComponent} from "../modal/modal.component";
import {FormProperties} from "../../utils/form-properties";

@Component({
  selector: 'app-find-friends',
  templateUrl: './find-friends.component.html',
  styleUrls: ['./find-friends.component.scss']
})
export class FindFriendsComponent implements OnInit {

  @ViewChild('removeModal')
  private removeModal: ModalComponent;
  removeModalConfig: ModalConfig = new ModalConfig();

  loggedUser: User;
  myAd?: FindFriendsAd;
  myAdLoaded: boolean = false;

  browseAdsList: FindFriendsAd[] = [];
  browseAdsPageTool: PageUtil<FindFriendsAd>;

  adForm: FormProperties = new FormProperties();
  ageAny: boolean = true;
  readonly genders : typeof Gender = Gender;

  constructor(private router: Router,
              private formBuilder: FormBuilder,
              private authService: AuthService,
              private findFriendsService: FindFriendsService,
              private userService: UserService) {
    this.removeModalConfig.modalTitle = $localize`:@@find-friends.remove-ad-confirm:Confirm poster removal`;
    this.removeModalConfig.confirmButtonLabel = $localize`:@@common.confirm:Confirm`;
    this.removeModalConfig.closeButtonLabel = $localize`:@@common.close:Close`;
    this.removeModalConfig.onConfirm = this.removeMyAd.bind(this);
  }

  ngOnInit(): void {
    this.authService.currentUser.subscribe(u => this.loggedUser = u);
    this.adForm.form = this.formBuilder.group({
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
      //this.error = $localize`:@@common.unknown-error:Unknown error`; //TODO: handle
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
    return this.adForm.form.controls;
  }

  onSubmit() {
    if (this.adForm.onSubmit()) {
      this.addAd();
    }
  }

  addAd() {
    this.findFriendsService.addAd(this.adForm.form.value).pipe(first())
      .subscribe(
        data => {
          this.adForm.onFinish();
          this.retrieveMyAd();
        },
        errorData => {
          this.adForm.onError(errorData);
        });
  }
}
